/*
  SESSION 3: Talking to the Computer (Serial Monitor)
  Uses the right-side Serial Monitor panel!
*/

SESSIONS.push({
  title: "Session 3: Serial Monitor & Messages",
  lessons: [
    {
      title: "1. Hello from Arduino!",
      explanation:
        "Your Arduino can send text messages back to your computer over the USB cable using <code>Serial.begin(9600)</code> " +
        "and <code>Serial.println(\"message\")</code>. Watch the <strong>Serial Monitor</strong> on the right!",
      notes: {
        intro: "The Serial Monitor is like a chat window between your Arduino and your computer screen.",
        sections: [
          {
            title: "How Serial communication starts",
            text: "Both the Arduino and the Serial Monitor must agree on the communication speed (baud rate), usually 9600.",
            points: [
              "Serial.begin(9600); goes inside setup() so it runs once at startup.",
              "Serial.println() prints text and moves to a new line.",
            ],
          },
          {
            title: "Using the Serial Monitor",
            text: "After clicking Upload to board, the Serial Monitor on the right will automatically connect at 9600 baud.",
            points: [
              "Use Clear anytime to wipe old messages.",
              "Check Timestamps to see the exact second each message arrived.",
            ],
          },
        ],
        diagram: { file: "serial-hello.png", alt: "Arduino Uno connected via USB to Serial Monitor" },
      },
      code: `int count = 1;

void setup() {
  Serial.begin(9600);
  Serial.println("Arduino is ready!");
}

void loop() {
  Serial.print("Loop number: ");
  Serial.println(count);
  count = count + 1;
  delay(1000);
}`,
      task: "Change the startup message in setup() to print \"Hello Student!\" and make the loop count every 2 seconds (2000 ms).",
      hint: "Replace \"Arduino is ready!\" with \"Hello Student!\" and change delay(1000) to delay(2000).",
      checks: [
        {
          label: "Startup message prints Hello Student!",
          fail: "Change Serial.println(\"Arduino is ready!\"); to Serial.println(\"Hello Student!\");",
          pattern: /Serial\.println\(\s*"Hello Student!"\s*\)\s*;/,
        },
        {
          label: "Loop prints every 2000 ms",
          fail: "Change delay(1000); to delay(2000);",
          pattern: /delay\(\s*2000\s*\)\s*;/,
        },
      ],
    },
  ],
});