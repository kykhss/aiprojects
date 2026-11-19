/*
  SESSION 2: Mini Project — Traffic Light Controller
  Student-friendly progression:
    1. Build & Time a Traffic Signal (3 outputs working in sequence)
    2. Rewire with Variables (Why named variables save time when moving wires)
*/

SESSIONS.push({
  title: "Session 2: Traffic Light Project",
  lessons: [
    {
      title: "1. Traffic Light Sequence",
      explanation:
        "Real traffic lights follow a strict sequence: <strong>Red → Green → Yellow</strong>[cite: 2]. " +
        "We control three separate LEDs one after another using <code>HIGH</code>, <code>delay()</code>, and <code>LOW</code>[cite: 2].",
      notes: {
        intro: "Build a miniature intersection on your breadboard using Red, Yellow, and Green LEDs[cite: 2].",
        sections: [
          {
            title: "Breadboard wiring checklist",
            text: "Each LED needs its own digital pin and its own protective resistor (220–330Ω)[cite: 2].",
            points: [
              "Red LED → Pin 11 | Yellow LED → Pin 10 | Green LED → Pin 9[cite: 2].",
              "Connect all three short legs (cathodes) to the breadboard GND rail, and connect that rail to Arduino GND[cite: 2].",
            ],
          },
          {
            title: "Reading the light cycle",
            text: "Notice how each light turns ON, waits for its delay, and turns OFF before the next light turns ON[cite: 2].",
            points: [
              "In the starter code: Red = 3s, Green = 3s, Yellow = 1s[cite: 2].",
              "Busy intersections give Green more time than Yellow[cite: 2].",
            ],
          },
        ],
        diagram: { file: "traffic-light-timing.png", alt: "Arduino Uno traffic light wiring with red, yellow, and green LEDs" },
      },
      code: `int red = 11;
int yellow = 10;
int green = 9;

void setup() {
  pinMode(red, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(green, OUTPUT);
}

void loop() {
  // Red phase
  digitalWrite(red, HIGH);
  delay(3000);
  digitalWrite(red, LOW);

  // Green phase
  digitalWrite(green, HIGH);
  delay(3000);
  digitalWrite(green, LOW);

  // Yellow phase
  digitalWrite(yellow, HIGH);
  delay(1000);
  digitalWrite(yellow, LOW);
}`,
      task: "Give traffic more time to pass: keep Green ON for 5 seconds (5000 ms) and Yellow ON for 2 seconds (2000 ms). Keep Red at 3 seconds[cite: 2].",
      hint: "Change delay(3000) under Green to delay(5000), and delay(1000) under Yellow to delay(2000)[cite: 2].",
      checks: [
        {
          label: "Green light stays ON for 5000 ms[cite: 2]",
          fail: "Set the delay after digitalWrite(green, HIGH) to 5000[cite: 2].",
          pattern: /digitalWrite\(\s*green\s*,\s*HIGH\s*\)\s*;\s*delay\(\s*5000\s*\)\s*;/,
        },
        {
          label: "Yellow light stays ON for 2000 ms[cite: 2]",
          fail: "Set the delay after digitalWrite(yellow, HIGH) to 2000[cite: 2].",
          pattern: /digitalWrite\(\s*yellow\s*,\s*HIGH\s*\)\s*;\s*delay\(\s*2000\s*\)\s*;/,
        },
        {
          label: "Red light remains 3000 ms[cite: 2]",
          fail: "Keep Red's delay at 3000 ms[cite: 2].",
          pattern: /digitalWrite\(\s*red\s*,\s*HIGH\s*\)\s*;\s*delay\(\s*3000\s*\)\s*;/,
        },
      ],
    },
    {
      title: "2. Move Pins Using Variables",
      explanation:
        "Because we saved our pin numbers in variables (<code>red</code>, <code>yellow</code>, <code>green</code>) at the top of the sketch, " +
        "moving wires to new Arduino pins only takes three quick edits[cite: 2]!",
      notes: {
        intro: "Good programmers avoid typing raw pin numbers everywhere. Naming your pins makes hardware changes fast and mistake-free[cite: 2].",
        sections: [
          {
            title: "Why variables are useful",
            text: "When you change int red = 11; to int red = 8;, every line in setup() and loop() automatically uses pin 8[cite: 2].",
            points: [
              "Always update your physical breadboard wires to match your new code[cite: 2].",
              "Pins 6, 7, and 8 work great as standard digital outputs[cite: 2].",
            ],
          },
          {
            title: "Troubleshooting tip",
            text: "If an LED doesn't light up after rewiring, check three things:",
            points: [
              "Does the variable number at the top match the physical pin hole on the Arduino[cite: 2]?",
              "Is the LED's long leg facing the resistor/pin and short leg facing GND[cite: 1, 2]?",
            ],
          },
        ],
        diagram: { file: "change-pins.png", alt: "Traffic light LEDs rewired from Arduino pins 11, 10, and 9 to pins 8, 7, and 6" },
      },
      code: `int red = 11;
int yellow = 10;
int green = 9;

void setup() {
  pinMode(red, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(green, OUTPUT);
}

void loop() {
  digitalWrite(red, HIGH);
  delay(3000);
  digitalWrite(red, LOW);

  digitalWrite(green, HIGH);
  delay(3000);
  digitalWrite(green, LOW);

  digitalWrite(yellow, HIGH);
  delay(1000);
  digitalWrite(yellow, LOW);
}`,
      task: "Move your traffic light to new pins: set Red to pin 8, Yellow to pin 7, and Green to pin 6[cite: 2].",
      hint: "Update the first three lines to: int red = 8; int yellow = 7; int green = 6;[cite: 2].",
      checks: [
        {
          label: "Red assigned to pin 8[cite: 2]",
          fail: "Set int red = 8; at the top of the code[cite: 2].",
          pattern: /int\s+red\s*=\s*8\s*;/,
        },
        {
          label: "Yellow assigned to pin 7[cite: 2]",
          fail: "Set int yellow = 7; at the top of the code[cite: 2].",
          pattern: /int\s+yellow\s*=\s*7\s*;/,
        },
        {
          label: "Green assigned to pin 6[cite: 2]",
          fail: "Set int green = 6; at the top of the code[cite: 2].",
          pattern: /int\s+green\s*=\s*6\s*;/,
        },
        {
          label: "All pinMode() setups preserved[cite: 2]",
          fail: "Keep all three pinMode() lines inside setup()[cite: 2].",
          pattern: /pinMode\(\s*red\s*,\s*OUTPUT\s*\)\s*;[\s\S]*pinMode\(\s*yellow\s*,\s*OUTPUT\s*\)\s*;[\s\S]*pinMode\(\s*green\s*,\s*OUTPUT\s*\)\s*;/,
        },
      ],
    },
  ],
});