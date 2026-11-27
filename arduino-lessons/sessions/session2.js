// Session 2: Joystick & Serial Explorer — student mission pack
SESSIONS.push({
  title: "Session 2: Joystick & Serial Explorer",
  lessons: [
    {
      title: "1. Meet the Joystick",
      explanation: "A joystick is an input device. It has two tiny variable resistors: one for left/right (X) and one for up/down (Y). The Arduino reads them with analogRead() and reads the push button with digitalRead().",
      notes: {
        intro: "Mission: move the joystick and watch the numbers change in the Serial Monitor. You are teaching Arduino to listen!",
        sections: [
          {
            title: "Connect the joystick",
            text: "Use the joystick module pins: VCC to 5V, GND to GND, VRx to A0, VRy to A1 and SW to digital pin 2.",
            points: [
              "Check the labels on your own module before wiring.",
              "The joystick button is commonly HIGH when released and LOW when pressed when using INPUT_PULLUP."
            ]
          }
          ,
          {
            title: "Read the values",
            text: "analogRead() gives a number from 0 to 1023. The centre is usually near 512. The button is a digital input.",
            points: [
              "X changes when you move left or right.",
              "Y changes when you move up or down.",
              "Serial.println() sends readable values to the Serial Monitor."
            ]
          }
          ,
          {
            title: "Serial Monitor",
            text: "Set the Serial Monitor baud rate to 9600, matching Serial.begin(9600).",
            points: [
              "Use one line per reading so the values are easy to follow.",
              "If the monitor is blank, check the baud rate and USB connection."
            ]
          }
        ],
        diagram: { file: "session2-lesson1.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "const int xPin = A0;\nconst int yPin = A1;\nconst int buttonPin = 2;\n\nvoid setup() {\n  pinMode(buttonPin, INPUT_PULLUP);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int xValue = analogRead(xPin);\n  int yValue = analogRead(yPin);\n  int buttonState = digitalRead(buttonPin);\n\n  Serial.print(\"X: \");\n  Serial.print(xValue);\n  Serial.print(\" | Y: \");\n  Serial.print(yValue);\n  Serial.print(\" | Button: \");\n  Serial.println(buttonState == LOW ? \"PRESSED\" : \"released\");\n\n  delay(200);\n}",
      task: "Upload the sketch, open Serial Monitor at 9600 baud, and record the X and Y values when the joystick is centred, pushed left, and pushed up.",
      hint: "Use analogRead(A0) and analogRead(A1) for the two joystick axes. The button uses INPUT_PULLUP.",
      checks: [
        {
          label: "Serial starts at 9600 baud",
          fail: "Add Serial.begin(9600); in setup().",
          pattern: /Serial\.begin\s*\(\s*9600\s*\)\s*;/
        }
        ,
        {
          label: "Both joystick axes are read",
          fail: "Read both A0 and A1 using analogRead().",
          pattern: /analogRead\s*\(\s*xPin\s*\)/
        }
        ,
        {
          label: "Y axis is also read",
          fail: "Add an analogRead() for yPin.",
          pattern: /analogRead\s*\(\s*yPin\s*\)/
        }
        ,
        {
          label: "Button uses the pull-up input",
          fail: "Set buttonPin to INPUT_PULLUP.",
          pattern: /pinMode\s*\(\s*buttonPin\s*,\s*INPUT_PULLUP\s*\)/
        }
      ]
    }
    ,
    {
      title: "2. Joystick Direction Controller",
      explanation: "Now turn raw joystick numbers into directions. Values below 400 can mean LEFT or DOWN, values above 600 can mean RIGHT or UP, and values between them mean CENTRE. The exact centre varies slightly between modules.",
      notes: {
        intro: "Mission: make Arduino name the direction you choose. This is a simple example of turning sensor input into a decision.",
        sections: [
          {
            title: "Choose a threshold",
            text: "A threshold is a boundary used to make a decision. Here 400 and 600 create a centre zone.",
            points: [
              "If x is less than 400, report LEFT.",
              "If x is greater than 600, report RIGHT.",
              "Otherwise report CENTRE."
            ]
          }
          ,
          {
            title: "Send messages",
            text: "Serial.println() sends a word or message to the computer.",
            points: [
              "The Serial Monitor is useful for testing sensors before connecting motors or lights.",
              "Use else if so only one direction is reported at a time."
            ]
          }
        ],
        diagram: { file: "session2-lesson2.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "const int xPin = A0;\nconst int yPin = A1;\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int x = analogRead(xPin);\n  int y = analogRead(yPin);\n\n  if (x < 400) {\n    Serial.println(\"LEFT\");\n  } else if (x > 600) {\n    Serial.println(\"RIGHT\");\n  } else if (y < 400) {\n    Serial.println(\"UP\");\n  } else if (y > 600) {\n    Serial.println(\"DOWN\");\n  } else {\n    Serial.println(\"CENTRE\");\n  }\n\n  delay(150);\n}",
      task: "Change the threshold values to 350 and 650. Test all four directions and the centre position.",
      hint: "Use if, else if and else. X usually controls left/right; Y usually controls up/down.",
      checks: [
        {
          label: "Serial communication is enabled",
          fail: "Add Serial.begin(9600);.",
          pattern: /Serial\.begin\s*\(\s*9600\s*\)\s*;/
        }
        ,
        {
          label: "Left direction is detected",
          fail: "Add a condition for x < 350.",
          pattern: /x\s*<\s*350/
        }
        ,
        {
          label: "Right direction is detected",
          fail: "Add a condition for x > 650.",
          pattern: /x\s*>\s*650/
        }
        ,
        {
          label: "A centre message is available",
          fail: "Add a CENTRE message for the remaining position.",
          pattern: /CENTRE/
        }
      ]
    }
  ]
});
