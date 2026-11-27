/*
  SESSION 1: First Steps — Controlling Lights & Brightness
  Learning journey:
    1. Blink the Built-in LED — zero wiring
    2. Heartbeat Rhythm — create a custom ON/OFF pattern
    3. Smooth LED Fade — first breadboard circuit + PWM
*/

SESSIONS.push({
  title: "Session 1: First Steps with LEDs",
  lessons: [
    {
      title: "1. Blink the Built-in LED",
      explanation:
        "🎯 MISSION: Make the tiny L light on your Arduino blink. " +
        "You will learn the two most important parts of every Arduino sketch: <code>setup()</code> and <code>loop()</code>. " +
        "<code>setup()</code> runs once; <code>loop()</code> repeats again and again.",
      notes: {
        intro: "Welcome, Light Engineer! 🔦 No breadboard and no extra wires today. Your Arduino Uno already has a small LED marked L. We will teach it to blink like a tiny lighthouse.",
        sections: [
          {
            title: "📚 Mini lecture 1 — Meet the two code rooms",
            text: "Imagine your Arduino is a little robot. Before it starts its job, it prepares its tools. That preparation happens inside setup(). After that, it keeps doing its job inside loop().",
            points: [
              "void setup() { } — runs only once when the board starts or resets.",
              "void loop() { } — repeats continuously while the board has power.",
              "The curly braces { } show which instructions belong in each part.",
              "The semicolon ; is like a full stop at the end of most Arduino instructions."
            ]
          },
          {
            title: "💡 Mini lecture 2 — Tell the LED what to do",
            text: "The built-in LED is connected to LED_BUILTIN (pin 13 on an Uno). First we tell Arduino that this pin is an OUTPUT. Then we can send it an ON or OFF command.",
            points: [
              "pinMode(LED_BUILTIN, OUTPUT); prepares the LED pin to send a signal out.",
              "digitalWrite(LED_BUILTIN, HIGH); turns the LED ON.",
              "digitalWrite(LED_BUILTIN, LOW); turns the LED OFF.",
              "LED_BUILTIN is a helpful name provided by the Arduino board definition."
            ]
          },
          {
            title: "⏱️ Mini lecture 3 — Become a time controller",
            text: "Arduino measures delay in milliseconds (ms). One second is 1,000 milliseconds. A bigger delay makes the LED wait longer before changing.",
            points: [
              "delay(1000); = wait 1 second.",
              "delay(500); = wait half a second.",
              "delay(2000); = wait 2 seconds.",
              "The first delay controls ON time. The second delay controls OFF time."
            ]
          },
          {
            title: "🧪 Teacher demo — Watch, predict, explain",
            text: "Before uploading, ask: 'What will the LED do first?' Follow the instructions in loop() from top to bottom. It turns ON, waits, turns OFF, waits, and starts again.",
            points: [
              "Upload the sketch and find the small L LED on the Uno.",
              "Predict what happens if the first delay is 200 and the second is 1000.",
              "Change both delays to 2000. The LED should blink slowly.",
              "There is no external wiring in this lesson, so it is a safe first experiment."
            ]
          }
        ],
        diagram: { file: "session1-lesson1.svg", alt: "Arduino Uno built-in L LED and blink sequence" }
      },
      quiz: {
        question: "Which part of an Arduino sketch repeats forever?",
        options: ["setup()", "loop()", "pinMode()"],
        answer: 1,
        explanation: "Correct! loop() keeps repeating while the Arduino is powered."
      },
      code: `void setup() {
  // Prepare the built-in LED pin as an output
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH); // Turn LED ON
  delay(1000);                     // Wait 1 second
  digitalWrite(LED_BUILTIN, LOW);  // Turn LED OFF
  delay(1000);                     // Wait 1 second
}`,
      task: "🏁 CHALLENGE: Make a slow lighthouse blink. Keep the LED ON for 2 seconds and OFF for 2 seconds. Change both delay values to 2000.",
      hint: "Find the two delay(1000) lines. Change each 1000 to 2000. Do not change the pin or HIGH/LOW commands.",
      checks: [
        {
          label: "ON time is 2000 ms",
          fail: "After the HIGH command, set delay(2000);",
          pattern: /digitalWrite\(\s*LED_BUILTIN\s*,\s*HIGH\s*\)\s*;\s*delay\(\s*2000\s*\)\s*;/
        },
        {
          label: "OFF time is 2000 ms",
          fail: "After the LOW command, set delay(2000);",
          pattern: /digitalWrite\(\s*LED_BUILTIN\s*,\s*LOW\s*\)\s*;\s*delay\(\s*2000\s*\)\s*;/
        },
        {
          label: "Both original 1000 ms delays changed",
          fail: "Replace both delay(1000) calls with delay(2000).",
          pattern: /delay\(\s*1000\s*\)/,
          not: true
        }
      ]
    },
    {
      title: "2. Heartbeat Rhythm",
      explanation:
        "❤️ MISSION: A heartbeat is not a regular blink. It makes a quick flash, another quick flash, then waits. " +
        "You will use the same LED commands but arrange them in a new rhythm.",
      notes: {
        intro: "Your LED can do more than blink slowly. Let's make it act like a heartbeat: lub-dub ... pause ... lub-dub ... pause!",
        sections: [
          {
            title: "📚 Mini lecture 1 — A rhythm is a sequence",
            text: "A pattern is made by placing instructions in a particular order. Each HIGH turns the LED on; each LOW turns it off. Different delay values create different rhythms.",
            points: [
              "Short ON time = a quick flash.",
              "Short OFF time = a small gap between flashes.",
              "Long OFF time = a pause before the next heartbeat.",
              "The Arduino repeats the whole pattern because it is inside loop()."
            ]
          },
          {
            title: "❤️ Mini lecture 2 — Read the heartbeat",
            text: "Our pattern is: ON briefly, OFF briefly, ON a little longer, OFF for a longer pause. Then loop() starts the pattern again.",
            points: [
              "First beat: HIGH for 150 ms.",
              "Tiny gap: LOW for 150 ms.",
              "Second beat: HIGH for 300 ms.",
              "Rest: LOW for 900 ms."
            ]
          },
          {
            title: "🧑‍🏫 Teacher demo — Clap the code",
            text: "Read each command aloud and clap when the LED is ON. Students can say 'beat, gap, beat, rest'. Ask them to predict which delay makes the longest pause.",
            points: [
              "Try changing the final delay to 1500 for a slower heartbeat.",
              "Try changing the first two delays to 80 for a sharper double flash.",
              "Keep the HIGH and LOW commands in the same order.",
              "The pattern is created by code only; no extra components are required."
            ]
          },
          {
            title: "🛠️ Debugging tip",
            text: "If the LED stays on or the rhythm looks wrong, check that every HIGH has a matching LOW and that each digitalWrite command ends with a semicolon.",
            points: [
              "Check the order of the four digitalWrite commands.",
              "Check that each delay has opening and closing parentheses.",
              "Check that the code is inside loop(), not after the closing brace."
            ]
          }
        ],
        diagram: { file: "session1-heartbeat.svg", alt: "Heartbeat LED timing pattern with two flashes and a rest" }
      },
      quiz: {
        question: "Which delay creates the long rest before the heartbeat repeats?",
        options: ["150 ms", "300 ms", "900 ms"],
        answer: 2,
        explanation: "Yes! The final LOW period is 900 ms, giving the heartbeat a longer rest."
      },
      code: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // Beat 1
  digitalWrite(LED_BUILTIN, HIGH);
  delay(150);
  digitalWrite(LED_BUILTIN, LOW);
  delay(150);

  // Beat 2
  digitalWrite(LED_BUILTIN, HIGH);
  delay(300);
  digitalWrite(LED_BUILTIN, LOW);
  delay(900); // Rest before the next heartbeat
}`,
      task: "🏁 CHALLENGE: Make the heartbeat quicker. Change the first beat ON time to 100 ms and the final rest to 600 ms. Keep the double-beat order.",
      hint: "Change the first delay(150) after the first HIGH to delay(100). Change the final delay(900) to delay(600).",
      checks: [
        {
          label: "First beat is 100 ms",
          fail: "Set the delay immediately after the first HIGH to 100.",
          pattern: /digitalWrite\(\s*LED_BUILTIN\s*,\s*HIGH\s*\)\s*;\s*delay\(\s*100\s*\)\s*;/
        },
        {
          label: "Final rest is 600 ms",
          fail: "Set the delay after the final LOW to 600.",
          pattern: /digitalWrite\(\s*LED_BUILTIN\s*,\s*LOW\s*\)\s*;\s*delay\(\s*600\s*\)\s*;\s*\}/
        },
        {
          label: "Two flashes are still present",
          fail: "Keep two HIGH commands in loop() for the double beat.",
          pattern: /digitalWrite\(\s*LED_BUILTIN\s*,\s*HIGH\s*\)[\s\S]*digitalWrite\(\s*LED_BUILTIN\s*,\s*HIGH\s*\)/
        }
      ]
    },
    {
      title: "3. Smooth LED Fade (PWM)",
      explanation:
        "🌈 MISSION: Make an external LED breathe smoothly from dim to bright and back again. " +
        "A PWM pin marked with ~ can simulate different brightness levels using <code>analogWrite(pin, value)</code>. " +
        "The value ranges from 0 (off) to 255 (full brightness).",
      notes: {
        intro: "Fantastic work! You can now control time and rhythm. In this lesson, you will build your first LED circuit and control brightness instead of only ON and OFF.",
        sections: [
          {
            title: "🔌 Mini lecture 1 — Build the circuit safely",
            text: "An external LED must have a current-limiting resistor in series. This protects the LED and the Arduino pin. Use a 220Ω or 330Ω resistor.",
            points: [
              "Arduino Uno pin 9 is a PWM pin (look for the ~ symbol).",
              "Connect pin 9 → resistor → LED long leg (anode +).",
              "Connect the LED short leg (cathode −) → GND.",
              "The resistor can be placed before or after the LED as long as it is in the same series path.",
              "Do not connect an external LED directly to the pin without a resistor."
            ]
          },
          {
            title: "🎚️ Mini lecture 2 — Brightness is a number",
            text: "digitalWrite() gives a simple ON or OFF. analogWrite() on a PWM pin lets us choose an apparent brightness level. On an Uno, the usual range is 0 to 255.",
            points: [
              "analogWrite(led, 0); = LED off.",
              "analogWrite(led, 80); = dim light.",
              "analogWrite(led, 255); = full brightness.",
              "PWM rapidly switches the pin on and off; changing the duty cycle changes the brightness we see."
            ]
          },
          {
            title: "🧮 Mini lecture 3 — Variables make the fade",
            text: "A variable is a named box that stores a value. brightness stores the current light level. fadeAmount tells the program how much to increase or decrease it each time.",
            points: [
              "int brightness = 0; starts the LED at zero brightness.",
              "int fadeAmount = 5; changes brightness by 5 each loop.",
              "brightness = brightness + fadeAmount; updates the value.",
              "When brightness reaches an end, fadeAmount changes sign so the light moves in the opposite direction."
            ]
          },
          {
            title: "🔁 Mini lecture 4 — Understand the IF decision",
            text: "The if statement checks whether brightness has reached either end of its range. The || symbol means OR: if either condition is true, reverse the direction.",
            points: [
              "brightness >= 255 checks the bright end.",
              "brightness <= 0 checks the dark end.",
              "fadeAmount = -fadeAmount; changes a positive step to negative, or negative to positive.",
              "delay(30); controls how long the program waits between brightness steps."
            ]
          },
          {
            title: "🧑‍🏫 Teacher demo — Predict, build, observe",
            text: "First show the LED circuit with power disconnected. Ask students to identify the long leg, short leg, resistor, PWM pin and GND. Then connect USB and upload the sketch.",
            points: [
              "Observe the LED slowly becoming brighter and then dimmer.",
              "Increase fadeAmount for bigger brightness jumps.",
              "Decrease delay for quicker updates.",
              "If the LED does not light, check polarity, the resistor path, the GND connection and that the wire is on pin 9."
            ]
          }
        ],
        diagram: { file: "session1-lesson2.svg", alt: "Arduino Uno pin 9 PWM connected through a resistor to an external LED" }
      },
      quiz: {
        question: "Which analogWrite value means full brightness?",
        options: ["0", "80", "255"],
        answer: 2,
        explanation: "Correct! 255 is the maximum PWM value in this beginner Uno example."
      },
      code: `int led = 9;         // Pin ~9 supports PWM brightness
int brightness = 0;  // Current brightness (0 to 255)
int fadeAmount = 5;  // Brightness change at each step

void setup() {
  pinMode(led, OUTPUT);
}

void loop() {
  analogWrite(led, brightness);
  brightness = brightness + fadeAmount;

  // Reverse direction at the ends of the fade
  if (brightness <= 0 || brightness >= 255) {
    fadeAmount = -fadeAmount;
  }

  delay(30);
}`,
      task: "🏁 CHALLENGE: Make the LED breathe faster. Set fadeAmount to 10 and delay to 10 ms. Keep the direction-reversal decision so the LED fades both up and down.",
      hint: "Change int fadeAmount = 5; to int fadeAmount = 10;. Then change delay(30); to delay(10);.",
      checks: [
        {
          label: "Fade step size is 10",
          fail: "Set int fadeAmount = 10;.",
          pattern: /int\s+fadeAmount\s*=\s*10\s*;/
        },
        {
          label: "Update delay is 10 ms",
          fail: "Set delay(10); at the end of loop().",
          pattern: /delay\(\s*10\s*\)\s*;/
        },
        {
          label: "Fade reverses direction",
          fail: "Keep fadeAmount = -fadeAmount; inside the if statement.",
          pattern: /fadeAmount\s*=\s*-\s*fadeAmount\s*;/
        },
        {
          label: "PWM output is still used",
          fail: "Keep analogWrite(led, brightness); so brightness can change smoothly.",
          pattern: /analogWrite\(\s*led\s*,\s*brightness\s*\)\s*;/
        }
      ]
    }
  ]
});
