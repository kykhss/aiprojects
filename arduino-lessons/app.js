// Arduino Lessons - app logic with Web Serial API, STK500 Flasher & Right-Side Serial Monitor

const KEY = "arduinoLessons.v2";

// Flatten all sessions into one list of lessons with a unique id
const ALL = [];
SESSIONS.forEach((session, si) => {
  session.lessons.forEach((lesson, li) => {
    ALL.push({ id: si + "-" + li, session: session, sessionIndex: si, lesson: lesson, first: li === 0 });
  });
});

// Saved progress: { current: 0, done: {"0-0": true}, code: {"0-0": "..."} }
function loadState() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { current: 0, done: {}, code: {} };
  } catch (e) {
    return { current: 0, done: {}, code: {} };
  }
}
function saveState() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

const state = loadState();
if (!state.done) state.done = {};
if (!state.code) state.code = {};
if (!(state.current >= 0 && state.current < ALL.length)) state.current = 0;

const $ = (id) => document.getElementById(id);
const sidebar = $("sidebar");
const editor = $("editor");
const boardSelect = $("boardSelect");
const portBadge = $("portBadge");
const boardStatus = $("boardStatus");
const uploadBtn = $("uploadBtn");
const notesIntro = $("notesIntro");
const notesSections = $("notesSections");
const circuitImage = $("circuitImage");
const diagramPlaceholder = $("diagramPlaceholder");
const diagramFileHint = $("diagramFileHint");
const diagramZoomBtn = $("diagramZoomBtn");
const diagramDialog = $("diagramDialog");
const largeCircuitImage = $("largeCircuitImage");

// Right-Side Serial Monitor elements
const serialSidebar = $("serialSidebar");
const serialDot = $("serialDot");
const baudSelect = $("baudSelect");
const serialConnectBtn = $("serialConnectBtn");
const serialTimestamp = $("serialTimestamp");
const serialAutoscroll = $("serialAutoscroll");
const serialOutput = $("serialOutput");
const serialInput = $("serialInput");
const lineEndingSelect = $("lineEndingSelect");
function setConnectionPills(connected, label) {
  document.querySelectorAll("[data-connection-status]").forEach((el) => {
    el.textContent = label || (connected ? "Connected" : "Not connected");
    el.classList.toggle("is-connected", !!connected);
    el.classList.toggle("is-disconnected", !connected);
  });
}

const BOARD_NAMES = {
  uno: "Arduino Uno",
  nano: "Arduino Nano",
  "nano-old": "Arduino Nano (Old Bootloader)",
};

// Web Serial state
let selectedSerialPort = null;
let serialReader = null;
let serialPipeDone = null;   // promise of port.readable -> decoder pipe
let serialReadLoop = null;   // promise of the monitor read loop
let isSerialReading = false;
let isUploading = false;
let serialBusy = false;      // guards connect/disconnect from running at the same time
let lineBuffer = "";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Always leaves the port closed. Never throws (safe to call on an already closed port).
async function closePortSafely(port) {
  if (!port) return;
  try {
    await port.close();
  } catch (e) {
    // Already closed, or still locked. Nothing more we can do here.
  }
}

function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function renderSidebar() {
  sidebar.querySelectorAll(".session-title, .lesson-link").forEach((node) => node.remove());
  ALL.forEach((item, i) => {
    if (item.first) { const h=document.createElement("div"); h.className="session-title"; h.textContent=item.session.title; sidebar.appendChild(h); }
    const b=document.createElement("button"); b.type="button"; b.className="lesson-link"; if(i===state.current)b.classList.add("active");
    const number=document.createElement("span"); number.className="lesson-number"; number.textContent=String(i+1).padStart(2,"0");
    const name=document.createElement("span"); name.textContent=item.lesson.title; b.append(number,name);
    if(state.done[item.id]){const tick=document.createElement("span");tick.className="done";tick.textContent="★";b.appendChild(tick);}
    b.addEventListener("click",()=>{saveEditor();state.current=i;saveState();showLesson();sidebar.classList.remove("open");}); sidebar.appendChild(b);
  });
  const count=ALL.filter(item=>state.done[item.id]).length; const percent=ALL.length?Math.round(count/ALL.length*100):0;
  $("progress").textContent=count+" / "+ALL.length+" lessons";
  if($("completedCount"))$("completedCount").textContent=percent+"%";
  if($("progressFill"))$("progressFill").style.width=percent+"%";
}

function saveEditor() {
  state.code[ALL[state.current].id] = editor.value;
  saveState();
}

function showLesson() {
  if(!ALL.length){$("lessonTitle").textContent="Your lessons are getting ready";$("lessonText").textContent="Add a session file to start learning.";editor.value="";return;}
  const item=ALL[state.current], lesson=item.lesson;
  $("sessionName").textContent=item.session.title; $("lessonTitle").textContent=lesson.title;
  $("lessonText").innerHTML=lesson.explanation||"Let's explore this Arduino idea together.";
  $("taskText").textContent=lesson.task||"Try the example and experiment with the code.";
  if($("lessonCounter"))$("lessonCounter").textContent=`Lesson ${state.current+1} of ${ALL.length}`;
  if($("prevBtn"))$("prevBtn").disabled=state.current===0;
  renderStudyNotes(lesson); editor.value=state.code[item.id]!=null?state.code[item.id]:(lesson.code||"");
  $("hint").hidden=true; $("results").innerHTML=""; $("banner").hidden=true;
  $("nextBtn").hidden=!(state.done[item.id]&&state.current<ALL.length-1); renderSidebar(); updateLedPreview();
  window.scrollTo({top:0,behavior:"smooth"});
}

function renderStudyNotes(lesson) {
  const notes = lesson.notes || {};
  notesIntro.textContent = notes.intro || "Read the lesson notes, then use the task to practice.";
  notesSections.replaceChildren();

  // Optional one-question knowledge check for this lesson.
  const oldQuiz = document.getElementById("lessonQuiz");
  if (oldQuiz) oldQuiz.remove();
  if (lesson.quiz && Array.isArray(lesson.quiz.options)) {
    const quiz = lesson.quiz;
    const card = document.createElement("section");
    card.className = "lesson-quiz";
    card.id = "lessonQuiz";
    const heading = document.createElement("h3");
    heading.textContent = "⚡ Quick knowledge check";
    const question = document.createElement("p");
    question.className = "quiz-question";
    question.textContent = quiz.question;
    const choices = document.createElement("div");
    choices.className = "quiz-options";
    const feedback = document.createElement("p");
    feedback.className = "quiz-feedback";
    feedback.setAttribute("aria-live", "polite");
    quiz.options.forEach((option, index) => {
      const choice = document.createElement("button");
      choice.type = "button";
      choice.className = "quiz-choice";
      choice.textContent = option;
      choice.addEventListener("click", () => {
        choices.querySelectorAll("button").forEach((button) => {
          button.disabled = true;
          button.classList.remove("correct", "incorrect");
        });
        if (index === quiz.answer) {
          choice.classList.add("correct");
          feedback.className = "quiz-feedback correct-text";
          feedback.textContent = "🌟 " + (quiz.explanation || "That's right!");
        } else {
          choice.classList.add("incorrect");
          feedback.className = "quiz-feedback incorrect-text";
          feedback.textContent = "💡 Not quite. " + (quiz.explanation || "Read the lesson notes and try again.");
          const retry = document.createElement("button");
          retry.type = "button";
          retry.className = "quiz-retry";
          retry.textContent = "Try again";
          retry.addEventListener("click", () => {
            choices.querySelectorAll("button").forEach((button) => {
              button.disabled = false;
              button.classList.remove("correct", "incorrect");
            });
            feedback.textContent = "";
            feedback.className = "quiz-feedback";
            retry.remove();
          });
          feedback.appendChild(retry);
        }
      });
      choices.appendChild(choice);
    });
    card.append(heading, question, choices, feedback);
    notesSections.appendChild(card);
  }

  (notes.sections || []).forEach((section, index) => {
    const details = document.createElement("details");
    details.className = "note-section";
    details.open = index === 0;
    const summary = document.createElement("summary");
    summary.textContent = section.title;
    details.appendChild(summary);
    if (section.text) {
      const paragraph = document.createElement("p");
      paragraph.textContent = section.text;
      details.appendChild(paragraph);
    }
    if (Array.isArray(section.points) && section.points.length) {
      const list = document.createElement("ul");
      section.points.forEach((point) => {
        const item = document.createElement("li");
        item.textContent = point;
        list.appendChild(item);
      });
      details.appendChild(list);
    }
    notesSections.appendChild(details);
  });

  const diagram = notes.diagram || {};
  const file = diagram.file || `${lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.png`;
  const src = `assets/${file}`;
  circuitImage.dataset.lessonSrc = src;
  circuitImage.hidden = true;
  diagramPlaceholder.hidden = false;
  diagramZoomBtn.hidden = true;
  circuitImage.alt = diagram.alt || `${lesson.title} circuit diagram`;
  diagramFileHint.textContent = `Keep the lesson diagram at ${src} to show it here.`;
  circuitImage.onload = () => {
    if (circuitImage.dataset.lessonSrc !== src) return;
    circuitImage.hidden = false;
    diagramPlaceholder.hidden = true;
    diagramZoomBtn.hidden = false;
  };
  circuitImage.onerror = () => {
    if (circuitImage.dataset.lessonSrc !== src) return;
    circuitImage.hidden = true;
    diagramPlaceholder.hidden = false;
    diagramZoomBtn.hidden = true;
  };
  circuitImage.src = src;
  largeCircuitImage.src = src;
  largeCircuitImage.alt = circuitImage.alt;
  $("diagramDialogTitle").textContent = `${lesson.title} · Circuit diagram`;
}

function checkCode() {
  const item = ALL[state.current];
  saveEditor();
  const clean = stripComments(editor.value);
  const list = $("results");
  list.innerHTML = "";
  let allPass = true;

  (item.lesson.checks || []).forEach((c) => {
    const found = c.pattern.test(clean);
    const pass = c.not ? !found : found;
    if (!pass) allPass = false;
    const li = document.createElement("li");
    li.className = pass ? "pass" : "fail";
    const mark = document.createElement("span");
    mark.className = "mark";
    mark.textContent = pass ? "✓" : "✗";
    li.appendChild(mark);
    li.appendChild(document.createTextNode(pass ? c.label : c.fail));
    list.appendChild(li);
  });

  const banner = $("banner");
  banner.hidden = false;
  if (allPass) {
    banner.className = "banner success";
    banner.textContent = "🌟 Amazing work! You completed this mission. You earned a star!";
    state.done[item.id] = true;
    saveState();
    renderSidebar();
    $("nextBtn").hidden = state.current >= ALL.length - 1;
  } else {
    banner.className = "banner try";
    banner.textContent = "🧩 Almost there! Check the pink tips and give it another try. You can do it!";
  }
}

$("checkBtn").addEventListener("click", checkCode);

$("hintBtn").addEventListener("click", () => {
  const h = $("hint");
  h.textContent = "Hint: " + ALL[state.current].lesson.hint;
  h.hidden = !h.hidden;
});

$("resetBtn").addEventListener("click", () => {
  if (confirm("Reset the code to the original?")) {
    delete state.code[ALL[state.current].id];
    saveState();
    showLesson();
  }
});

$("nextBtn").addEventListener("click", () => {
  state.current += 1;
  saveState();
  showLesson();
});

$("menuBtn").addEventListener("click", () => sidebar.classList.toggle("open"));

editor.addEventListener("input", saveEditor);

async function copyCode() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(editor.value);
    } else {
      editor.focus();
      editor.select();
      if (!document.execCommand("copy")) throw new Error("Copy was blocked by the browser.");
    }
    boardStatus.textContent = "Code copied to clipboard.";
  } catch (error) {
    boardStatus.textContent = `Could not copy code: ${error.message}`;
  }
}

// --- WEB SERIAL API PORT SELECTION ---
async function selectPort() {
  if (!("serial" in navigator)) {
    boardStatus.textContent = "Web Serial is not supported here. Please open this app in Google Chrome or Microsoft Edge.";
    return false;
  }

  try {
    if (isSerialReading) await disconnectSerialMonitor();
    // If a different port was open before, make sure it is released.
    await closePortSafely(selectedSerialPort);

    const port = await navigator.serial.requestPort({
      filters: [
        { usbVendorId: 0x2341 }, // Official Arduino
        { usbVendorId: 0x1A86 }, // CH340 / CH341 USB-Serial
        { usbVendorId: 0x0403 }, // FTDI
        { usbVendorId: 0x10C4 }, // CP210x
        { usbVendorId: 0x2A03 }, // Arduino.org
      ],
    });

    selectedSerialPort = port;
    const info = port.getInfo();
    const vid = info.usbVendorId ? info.usbVendorId.toString(16).toUpperCase().padStart(4, "0") : "USB";
    portBadge.textContent = `Port (${vid})`;
    portBadge.classList.add("connected");
    boardStatus.textContent = `USB Serial port selected (VID:${vid}). Ready to upload.`;
    setConnectionPills(true, "USB selected");
    return true;
  } catch (error) {
    if (error.name !== "NotFoundError") {
      boardStatus.textContent = `Port error: ${error.message}`;
    }
    return false;
  }
}

if ("serial" in navigator) {
  navigator.serial.addEventListener("disconnect", (event) => {
    if (selectedSerialPort && event.target === selectedSerialPort) {
      isSerialReading = false;
      selectedSerialPort = null;
      serialReader = null;
      serialPipeDone = null;
      serialReadLoop = null;
      portBadge.textContent = "No port";
      portBadge.classList.remove("connected");
      serialDot.classList.remove("live");
      serialConnectBtn.textContent = "Connect";
      boardStatus.textContent = "Arduino disconnected from USB.";
      setConnectionPills(false, "Not connected");
    }
  });
}

// --- STK500v1 BOOTLOADER FLASHER OVER WEB SERIAL ---
function parseIntelHex(hexString) {
  const lines = hexString.trim().split(/\r?\n/);
  const memory = new Uint8Array(32768);
  let maxAddr = 0;

  for (const line of lines) {
    if (!line.startsWith(":")) continue;
    const len = parseInt(line.substr(1, 2), 16);
    const addr = parseInt(line.substr(3, 4), 16);
    const type = parseInt(line.substr(7, 2), 16);
    if (type === 0x00) {
      for (let i = 0; i < len; i++) {
        memory[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
      }
      if (addr + len > maxAddr) maxAddr = addr + len;
    }
  }
  return memory.slice(0, maxAddr);
}

async function flashHexOverWebSerial(port, hexString, baudRate) {
  const firmware = parseIntelHex(hexString);
  if (!firmware.length) throw new Error("Compiled binary is empty.");

  // Make sure nothing is holding the port from an earlier session.
  await closePortSafely(port);
  await port.open({ baudRate });

  const writer = port.writable.getWriter();
  const reader = port.readable.getReader();

  // One single read pump fills a buffer. This avoids leaving abandoned
  // reader.read() calls behind when a bootloader reply times out.
  const rx = [];
  const pump = (async () => {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) for (const byte of value) rx.push(byte);
      }
    } catch (e) {
      // Reader cancelled or port closed: stop quietly.
    }
  })();

  const readBytes = async (count, timeoutMs) => {
    const deadline = Date.now() + timeoutMs;
    while (rx.length < count) {
      if (Date.now() > deadline) {
        throw new Error("Bootloader response timed out. Check selected Board type.");
      }
      await sleep(5);
    }
    return new Uint8Array(rx.splice(0, count));
  };

  try {
    await port.setSignals({ dataTerminalReady: false, requestToSend: false });
    await sleep(250);
    await port.setSignals({ dataTerminalReady: true, requestToSend: true });
    await sleep(250);

    const sendCommand = async (bytes, expectedReplyLen = 2) => {
      rx.length = 0; // drop stale bytes before each command
      await writer.write(new Uint8Array(bytes));
      const reply = await readBytes(expectedReplyLen, 1200);
      if (reply[0] !== 0x14 || reply[reply.length - 1] !== 0x10) {
        throw new Error("STK500 sync mismatch. Verify Board selection (Uno vs Nano / Old Bootloader).");
      }
      return reply;
    };

    let synced = false;
    for (let attempt = 0; attempt < 12; attempt++) {
      try {
        await sendCommand([0x30, 0x20], 2);
        synced = true;
        break;
      } catch (e) {
        await sleep(80);
      }
    }
    if (!synced) {
      throw new Error("Could not sync with Arduino bootloader. Try switching between Nano and Nano (Old Bootloader).");
    }

    await sendCommand([0x50, 0x20], 2);

    const pageSize = 128;
    for (let addr = 0; addr < firmware.length; addr += pageSize) {
      const wordAddr = addr >> 1;
      await sendCommand([0x55, wordAddr & 0xff, (wordAddr >> 8) & 0xff, 0x20], 2);

      const slice = firmware.slice(addr, addr + pageSize);
      const paddedPage = new Uint8Array(pageSize).fill(0xff);
      paddedPage.set(slice);

      await sendCommand([0x64, 0x00, pageSize, 0x46, ...paddedPage, 0x20], 2);
    }

    await sendCommand([0x51, 0x20], 2);
  } finally {
    // Cleanup runs step by step; one failing step must never skip port.close().
    try { await reader.cancel(); } catch (e) { /* ignore */ }
    try { await pump; } catch (e) { /* ignore */ }
    try { reader.releaseLock(); } catch (e) { /* ignore */ }
    try { writer.releaseLock(); } catch (e) { /* ignore */ }
    await closePortSafely(port);
  }
}

async function uploadCode() {
  if (isUploading) return;
  const code = editor.value.trim();
  const board = boardSelect.value;
  if (!code) {
    boardStatus.textContent = "The sketch is empty.";
    return;
  }

  if (!selectedSerialPort) {
    const ok = await selectPort();
    if (!ok) return;
  }

  isUploading = true;
  const wasMonitoring = isSerialReading;
  if (wasMonitoring) await disconnectSerialMonitor();

  uploadBtn.disabled = true;
  uploadBtn.textContent = "Uploading…";
  boardStatus.textContent = `Compiling sketch for ${BOARD_NAMES[board]}…`;

  try {
    const compileRes = await fetch("https://hexi.wokwi.com/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sketch: code,
        board: board === "uno" ? "uno" : "nano",
      }),
    });

    if (!compileRes.ok) {
      throw new Error(`Compiler service returned HTTP ${compileRes.status}`);
    }

    const compiled = await compileRes.json();
    if (!compiled.hex) {
      throw new Error(compiled.stderr || "Compilation failed. Check your code syntax.");
    }

    boardStatus.textContent = `Flashing ${BOARD_NAMES[board]} over USB…`;
    const baudRate = board === "nano-old" ? 57600 : 115200;
    await flashHexOverWebSerial(selectedSerialPort, compiled.hex, baudRate);

    boardStatus.textContent = `${BOARD_NAMES[board]} upload completed successfully!`;

    if (wasMonitoring || code.includes("Serial.begin")) {
      // Give the board a moment to reboot into the new sketch.
      await sleep(400);
      isUploading = false;
      serialSidebar.classList.remove("collapsed");
      await connectSerialMonitor();
    }
  } catch (error) {
    boardStatus.textContent = `Upload failed: ${error.message}`;
  } finally {
    isUploading = false;
    uploadBtn.disabled = false;
    uploadBtn.textContent = "Upload to board";
  }
}

// --- RIGHT-SIDE SERIAL MONITOR ---
function appendSerialText(chunk) {
  if (!serialTimestamp.checked) {
    serialOutput.textContent += chunk;
  } else {
    lineBuffer += chunk;
    const lines = lineBuffer.split("\n");
    lineBuffer = lines.pop();
    const now = new Date().toLocaleTimeString([], { hour12: false });
    lines.forEach((line) => {
      serialOutput.textContent += `[${now}] ${line}\n`;
    });
  }

  if (serialAutoscroll.checked) {
    serialOutput.scrollTop = serialOutput.scrollHeight;
  }
}

async function connectSerialMonitor() {
  if (serialBusy || isUploading) return;
  if (!selectedSerialPort) {
    const ok = await selectPort();
    if (!ok) return;
  }
  if (isSerialReading) return;

  serialBusy = true;
  const port = selectedSerialPort;
  const baudRate = parseInt(baudSelect.value, 10) || 9600;
  try {
    // Defensive: if the port is somehow still open, close it first.
    if (port.readable || port.writable) await closePortSafely(port);

    await port.open({ baudRate });
    isSerialReading = true;
    lineBuffer = "";
    serialDot.classList.add("live");
    serialConnectBtn.textContent = "Disconnect";
    setConnectionPills(true, "Serial live");

    const decoder = new TextDecoderStream();
    serialPipeDone = port.readable.pipeTo(decoder.writable).catch(() => {});
    const reader = decoder.readable.getReader();
    serialReader = reader;

    serialReadLoop = (async () => {
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) appendSerialText(value);
        }
      } catch (e) {
        // Ignore read abort when disconnecting
      }
    })();
  } catch (error) {
    isSerialReading = false;
    serialDot.classList.remove("live");
    serialConnectBtn.textContent = "Connect";
    boardStatus.textContent = `Serial Monitor error: ${error.message}`;
    await closePortSafely(port);
  } finally {
    serialBusy = false;
  }
}

async function disconnectSerialMonitor() {
  // Wait if a connect/disconnect is still in progress.
  while (serialBusy) await sleep(20);
  serialBusy = true;

  isSerialReading = false;
  serialDot.classList.remove("live");
  serialConnectBtn.textContent = "Connect";

  const port = selectedSerialPort;
  const reader = serialReader;
  const pipeDone = serialPipeDone;
  const readLoop = serialReadLoop;
  serialReader = null;
  serialPipeDone = null;
  serialReadLoop = null;

  try {
    // 1) Cancel the reader: this also cancels the pipe and port.readable.
    if (reader) { try { await reader.cancel(); } catch (e) { /* ignore */ } }
    // 2) WAIT until the pipe has really released port.readable. Closing the
    //    port before this point fails silently and leaves the port open.
    if (pipeDone) { try { await pipeDone; } catch (e) { /* ignore */ } }
    if (readLoop) { try { await readLoop; } catch (e) { /* ignore */ } }
    if (reader) { try { reader.releaseLock(); } catch (e) { /* ignore */ } }
    // 3) Now the port can be closed for real.
    await closePortSafely(port);
  } finally {
    setConnectionPills(!!selectedSerialPort, selectedSerialPort ? "USB selected" : "Not connected");
    serialBusy = false;
  }
}

async function sendSerialData() {
  const text = serialInput.value;
  if (!text) return;
  if (!isSerialReading || !selectedSerialPort || !selectedSerialPort.writable) {
    boardStatus.textContent = "Click Connect in the Serial Monitor before sending data.";
    return;
  }

  const endingMap = { "\\n": "\n", "\\r\\n": "\r\n", "": "" };
  const ending = endingMap[lineEndingSelect.value] ?? "\n";

  let writer = null;
  try {
    const encoder = new TextEncoder();
    writer = selectedSerialPort.writable.getWriter();
    await writer.write(encoder.encode(text + ending));
    serialInput.value = "";
  } catch (error) {
    boardStatus.textContent = `Send error: ${error.message}`;
  } finally {
    // Always release the writer, otherwise port.close() fails later.
    if (writer) { try { writer.releaseLock(); } catch (e) { /* ignore */ } }
  }
}

// Event bindings
$("copyBtn").addEventListener("click", copyCode);
$("selectPortBtn").addEventListener("click", selectPort);
uploadBtn.addEventListener("click", uploadCode);

$("serialToggleBtn").addEventListener("click", () => {
  serialSidebar.classList.toggle("collapsed");
});
$("serialCloseBtn").addEventListener("click", () => {
  serialSidebar.classList.add("collapsed");
});
serialConnectBtn.addEventListener("click", () => {
  if (isSerialReading) disconnectSerialMonitor();
  else connectSerialMonitor();
});
baudSelect.addEventListener("change", async () => {
  if (isSerialReading) {
    await disconnectSerialMonitor();
    await connectSerialMonitor();
  }
});
$("serialClearBtn").addEventListener("click", () => {
  serialOutput.textContent = "";
  lineBuffer = "";
});
$("serialSendBtn").addEventListener("click", sendSerialData);
serialInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendSerialData();
});

diagramZoomBtn.addEventListener("click", () => {
  if (typeof diagramDialog.showModal === "function") diagramDialog.showModal();
});
$("closeDiagramBtn").addEventListener("click", () => diagramDialog.close());

// Tab key inserts two spaces instead of leaving the editor
editor.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const s = editor.selectionStart;
    editor.value = editor.value.slice(0, s) + "  " + editor.value.slice(editor.selectionEnd);
    editor.selectionStart = editor.selectionEnd = s + 2;
    saveEditor();
  }
});


// Lesson 1 only: live browser simulation of the built-in Arduino LED.
let blinkTimer = null, blinkPhaseStartedAt = 0, blinkIsOn = false, blinkRunning = false, blinkRemaining = 0;
const blinkCard = $("blinkPreviewCard"), blinkOnInput = $("blinkOnTime"), blinkOffInput = $("blinkOffTime");
const blinkBulb = $("ledBulb"), blinkState = $("ledState"), blinkCaption = $("ledCaption");
const blinkBar = $("blinkCycleBar"), blinkPhase = $("cyclePhase"), blinkCountdown = $("cycleCountdown");
function blinkDuration(){ return Number(blinkIsOn ? blinkOnInput.value : blinkOffInput.value); }
function updateBlinkLabels(){ $("blinkOnValue").textContent = `${blinkOnInput.value} ms`; $("blinkOffValue").textContent = `${blinkOffInput.value} ms`; }
function paintBlinkState(on){
  blinkIsOn=on; blinkBulb.classList.toggle("on",on); blinkBulb.setAttribute("aria-label",on?"Built-in LED is on":"Built-in LED is off");
  blinkState.textContent=on?"LED ON":"LED OFF"; blinkState.className="sim-state "+(on?"state-on":"state-off");
  blinkCaption.textContent=on?`HIGH · Light is ON for ${blinkOnInput.value} ms`:`LOW · Light is OFF for ${blinkOffInput.value} ms`;
  blinkPhase.textContent=on?"Current phase · ON":"Current phase · OFF";
}
function stopBlinkTimer(){ if(blinkTimer) clearTimeout(blinkTimer); blinkTimer=null; }
function scheduleBlinkPhase(duration){
  stopBlinkTimer(); blinkPhaseStartedAt=performance.now(); blinkRemaining=duration;
  const tick=()=>{
    if(!blinkRunning)return;
    const elapsed=performance.now()-blinkPhaseStartedAt, left=Math.max(0,duration-elapsed);
    blinkCountdown.textContent=`${(left/1000).toFixed(1)} s`; blinkBar.style.width=`${Math.min(100,elapsed/duration*100)}%`;
    if(left<=0){ paintBlinkState(!blinkIsOn); scheduleBlinkPhase(blinkDuration()); return; }
    blinkTimer=setTimeout(tick,Math.min(40,left));
  }; tick();
}
function startBlinkPreview(){
  if(blinkRunning)return; blinkRunning=true; $("blinkStartBtn").disabled=true; $("blinkPauseBtn").disabled=false;
  if(blinkRemaining>0) scheduleBlinkPhase(blinkRemaining);
  else { paintBlinkState(true); scheduleBlinkPhase(Number(blinkOnInput.value)); }
}
function pauseBlinkPreview(){
  if(!blinkRunning)return;
  blinkRemaining=Math.max(0,blinkDuration()-(performance.now()-blinkPhaseStartedAt)); stopBlinkTimer(); blinkRunning=false;
  $("blinkStartBtn").disabled=false; $("blinkStartBtn").textContent="▶ Resume blinking"; $("blinkPauseBtn").disabled=true;
  blinkState.textContent="PAUSED"; blinkPhase.textContent="Simulation paused"; blinkCountdown.textContent=`${(blinkRemaining/1000).toFixed(1)} s left`;
}
function resetBlinkPreview(){
  stopBlinkTimer(); blinkRunning=false; blinkRemaining=0; blinkIsOn=false;
  $("blinkStartBtn").disabled=false; $("blinkStartBtn").textContent="▶ Start blinking"; $("blinkPauseBtn").disabled=true;
  blinkBulb.classList.remove("on"); blinkBulb.setAttribute("aria-label","Built-in LED is off");
  blinkState.textContent="READY"; blinkState.className="sim-state"; blinkCaption.textContent="Press Start to run your first blink.";
  blinkPhase.textContent="Waiting to start"; blinkCountdown.textContent="—"; blinkBar.style.width="0%";
}
function updateLedPreview(){
  const show=(ALL[state.current]?.lesson?.title||"").toLowerCase().includes("blink the built-in led");
  blinkCard.hidden=!show; resetBlinkPreview(); updateBlinkLabels();
}
$("blinkStartBtn").addEventListener("click",startBlinkPreview);
$("blinkPauseBtn").addEventListener("click",pauseBlinkPreview);
$("blinkResetBtn").addEventListener("click",resetBlinkPreview);
[blinkOnInput,blinkOffInput].forEach(input=>input.addEventListener("input",()=>{
  updateBlinkLabels();
  if(blinkRunning && ((blinkIsOn && input===blinkOnInput)||(!blinkIsOn && input===blinkOffInput))){
    const elapsed=performance.now()-blinkPhaseStartedAt, remaining=Math.max(0,blinkDuration()-elapsed);
    scheduleBlinkPhase(remaining);
  } else if(!blinkRunning && blinkRemaining>0){ blinkRemaining=blinkDuration(); blinkCountdown.textContent=`${(blinkRemaining/1000).toFixed(1)} s left`; }
}));
if($("prevBtn"))$("prevBtn").addEventListener("click",()=>{if(state.current<=0)return;saveEditor();state.current--;saveState();showLesson();});

showLesson();
