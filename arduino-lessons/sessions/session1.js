/*
  SESSION 1: First Steps — Controlling Lights & Brightness
  Student-friendly progression:
    1. Blinking the Built-in LED (Zero wiring — focus purely on setup, loop, and timing)
    2. Heartbeat Rhythm (Custom ON/OFF patterns)
    3. Smooth LED Fade (First breadboard wire + PWM brightness)
*/

SESSIONS.push({
  title: "Session 1: First Steps with LEDs",
  lessons: [
    {
      title: "1. Blink the Built-in LED",
      explanation:
        "Every Arduino sketch has two main blocks: <code>setup()</code> runs <strong>once</strong> when power turns on, " +
        "and <code>loop()</code> repeats <strong>forever</strong>. Use <code>delay(1000)</code> to pause for 1,000 milliseconds (1 second)[cite: 1].",
      notes: {
        intro: "No wires needed yet! Your Arduino Uno has a tiny built-in LED (labeled 'L') connected to pin 13[cite: 1]. Let's control its rhythm.",
        sections: [
          {
            title: "How Arduino reads your code",
            text: "Arduino reads code from top to bottom. setup() prepares the pins once, then loop() repeats over and over until you unplug the board[cite: 1].",
            points: [
              "pinMode(LED_BUILTIN, OUTPUT) tells the Arduino to send power out to the built-in LED[cite: 1].",
              "HIGH means ON (5V power); LOW means OFF (0V power)[cite: 1].",
            ],
          },
          {
            title: "Understanding milliseconds",
            text: "Arduino counts time in milliseconds (ms). 1000 ms = 1 second, so 2000 ms = 2 seconds[cite: 1].",
            points: [
              "The first delay() controls how long the light stays ON[cite: 1].",
              "The second delay() controls how long the light stays OFF[cite: 1].",
            ],
          },
          {
            title: "Experiment safely",
            text: "Because we are using LED_BUILTIN, you cannot wire anything wrong[cite: 1]. Try uploading first, then change the numbers!",
            points: [
              "Watch the tiny orange 'L' light on your Arduino board after uploading.",
              "Try making a fast blink (100 ms) or a slow blink (2000 ms)[cite: 1].",
            ],
          },
        ],
        diagram: { file: "led-blink.png", alt: "Arduino Uno built-in LED blink diagram" },
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
      task: "Make a slow blink: keep the LED ON for 2 seconds (2000 ms) and OFF for 2 seconds (2000 ms)[cite: 1].",
      hint: "Change both delay(1000) lines to delay(2000)[cite: 1].",
      checks: [
        {
          label: "LED stays ON for 2000 ms[cite: 1]",
          fail: "Set the delay after HIGH to 2000[cite: 1].",
          pattern: /digitalWrite\(\s*LED_BUILTIN\s*,\s*HIGH\s*\)\s*;\s*delay\(\s*2000\s*\)\s*;/,
        },
        {
          label: "LED stays OFF for 2000 ms[cite: 1]",
          fail: "Set the delay after LOW to 2000[cite: 1].",
          pattern: /digitalWrite\(\s*LED_BUILTIN\s*,\s*LOW\s*\)\s*;\s*delay\(\s*2000\s*\)\s*;/,
        },
        {
          label: "Old 1000 ms delays updated",
          fail: "Replace both delay(1000) calls with delay(2000)[cite: 1].",
          pattern: /delay\(\s*1000\s*\)/,
          not: true,
        },
      ],
    },
    {
      title: "2. Smooth LED Fade (PWM)",
      explanation:
        "Instead of just ON or OFF, pins marked with a wave symbol (<code>~</code>) can dim an LED using " +
        "<code>analogWrite(pin, brightness)</code> with any number from <code>0</code> (off) to <code>255</code> (full bright)[cite: 1].",
      notes: {
        intro: "Time for your first breadboard circuit! By changing brightness in tiny steps, we can make an LED breathe smoothly[cite: 1].",
        sections: [
          {
            title: "How to wire your LED safely",
            text: "Always use a 220Ω or 330Ω resistor in series with an external LED so it doesn't burn out[cite: 1].",
            points: [
              "Long leg (Anode +) connects to Pin ~9 through a 220–330Ω resistor[cite: 1].",
              "Short leg (Cathode -) connects to GND (Ground) on the Arduino[cite: 1].",
            ],
          },
          {
            title: "How fading math works",
            text: "Each time loop() runs, we add fadeAmount to brightness[cite: 1]. When brightness hits 255 or 0, we flip the sign to reverse direction[cite: 1].",
            points: [
              "Bigger fadeAmount = larger jumps in brightness (faster fade)[cite: 1].",
              "Smaller delay() = quicker updates between steps (faster fade)[cite: 1].",
            ],
          },
        ],
        diagram: { file: "led-fade.png", alt: "Arduino Uno PWM pin 9 connected through a resistor to an LED" },
      },
      code: `int led = 9;         // Pin ~9 supports brightness control
int brightness = 0;  // Current brightness (0 to 255)
int fadeAmount = 5;  // How many points to change each step

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
      task: "Speed up the breathing effect: set the step size (fadeAmount) to 10 and the pause (delay) to 10 ms[cite: 1].",
      hint: "Change int fadeAmount = 5; to 10, and change delay(30); to delay(10);[cite: 1].",
      checks: [
        {
          label: "Step size (fadeAmount) is 10[cite: 1]",
          fail: "Change int fadeAmount = 5; to int fadeAmount = 10;[cite: 1].",
          pattern: /int\s+fadeAmount\s*=\s*10\s*;/,
        },
        {
          label: "Loop delay is 10 ms[cite: 1]",
          fail: "Change delay(30); to delay(10);[cite: 1].",
          pattern: /delay\(\s*10\s*\)\s*;/,
        },
        {
          label: "Direction reversal kept intact",
          fail: "Keep the line fadeAmount = -fadeAmount; so the LED fades back down[cite: 1].",
          pattern: /fadeAmount\s*=\s*-\s*fadeAmount\s*;/,
        },
      ],
    },
  ],
});