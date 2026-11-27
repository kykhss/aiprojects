// Session 3: Traffic Light Engineer — student mission pack
SESSIONS.push({
  title: "Session 3: Traffic Light Engineer",
  lessons: [
    {
      title: "1. Build a Three-LED Traffic Light",
      explanation: "A traffic light is a sequence controller. Arduino turns on one LED at a time in a repeating order: RED, GREEN, then YELLOW. Each LED needs its own current-limiting resistor.",
      notes: {
        intro: "Mission: build a tiny road junction. Use three LEDs and watch the traffic-light sequence.",
        sections: [
          {
            title: "Wire the LEDs",
            text: "Connect red LED to pin 8, yellow to pin 9 and green to pin 10 through separate 220Ω–330Ω resistors. Connect each LED's short leg to GND.",
            points: [
              "Long leg is usually the anode (+).",
              "Never connect an LED directly to a pin without a resistor."
            ]
          }
          ,
          {
            title: "Make a safe sequence",
            text: "Set all LED pins as OUTPUT in setup(). Turn one colour on, wait, then turn it off before the next colour.",
            points: [
              "Red means STOP.",
              "Green means GO.",
              "Yellow means GET READY / CAUTION."
            ]
          }
        ],
        diagram: { file: "session3-lesson1.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "const int redLED = 8;\nconst int yellowLED = 9;\nconst int greenLED = 10;\n\nvoid setup() {\n  pinMode(redLED, OUTPUT);\n  pinMode(yellowLED, OUTPUT);\n  pinMode(greenLED, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(redLED, HIGH);\n  digitalWrite(yellowLED, LOW);\n  digitalWrite(greenLED, LOW);\n  delay(3000);\n\n  digitalWrite(redLED, LOW);\n  digitalWrite(greenLED, HIGH);\n  delay(3000);\n\n  digitalWrite(greenLED, LOW);\n  digitalWrite(yellowLED, HIGH);\n  delay(1000);\n  digitalWrite(yellowLED, LOW);\n}",
      task: "Change the red and green waiting times to 4 seconds. Keep yellow at 1 second.",
      hint: "4000 milliseconds = 4 seconds. Find the delay() after the RED and GREEN stages.",
      checks: [
        {
          label: "All three LEDs are outputs",
          fail: "Set redLED, yellowLED and greenLED as OUTPUT.",
          pattern: /pinMode\s*\(\s*redLED\s*,\s*OUTPUT\s*\)/
        }
        ,
        {
          label: "Red stage is included",
          fail: "Turn the red LED on.",
          pattern: /digitalWrite\s*\(\s*redLED\s*,\s*HIGH\s*\)/
        }
        ,
        {
          label: "Green stage is included",
          fail: "Turn the green LED on.",
          pattern: /digitalWrite\s*\(\s*greenLED\s*,\s*HIGH\s*\)/
        }
        ,
        {
          label: "Yellow stage is included",
          fail: "Turn the yellow LED on.",
          pattern: /digitalWrite\s*\(\s*yellowLED\s*,\s*HIGH\s*\)/
        }
        ,
        {
          label: "Red timing is four seconds",
          fail: "Set the red delay to 4000 ms.",
          pattern: /delay\s*\(\s*4000\s*\)/
        }
      ]
    }
    ,
    {
      title: "2. Pedestrian Crossing Button",
      explanation: "Add a pedestrian request button. When someone presses it, the traffic light gives a short safe crossing phase. This introduces digital input and decision-making.",
      notes: {
        intro: "Mission: let a pedestrian request a crossing. The button uses INPUT_PULLUP, so a pressed button reads LOW.",
        sections: [
          {
            title: "Connect the button",
            text: "Connect one side of the push button to pin 2 and the other side to GND. Use INPUT_PULLUP.",
            points: [
              "No external pull-up resistor is needed with INPUT_PULLUP.",
              "Pressed = LOW; released = HIGH."
            ]
          }
          ,
          {
            title: "Add a crossing phase",
            text: "When the button is pressed, stop traffic with RED, then allow a short crossing time using a separate pedestrian LED on pin 11 if available.",
            points: [
              "Keep the vehicle GREEN off during the crossing.",
              "After the crossing, return to the normal sequence."
            ]
          }
        ],
        diagram: { file: "session3-lesson2.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "const int redLED = 8;\nconst int yellowLED = 9;\nconst int greenLED = 10;\nconst int buttonPin = 2;\nconst int walkLED = 11;\n\nvoid setup() {\n  pinMode(redLED, OUTPUT);\n  pinMode(yellowLED, OUTPUT);\n  pinMode(greenLED, OUTPUT);\n  pinMode(walkLED, OUTPUT);\n  pinMode(buttonPin, INPUT_PULLUP);\n}\n\nvoid loop() {\n  if (digitalRead(buttonPin) == LOW) {\n    digitalWrite(greenLED, LOW);\n    digitalWrite(yellowLED, HIGH);\n    delay(1000);\n    digitalWrite(yellowLED, LOW);\n    digitalWrite(redLED, HIGH);\n    digitalWrite(walkLED, HIGH);\n    delay(4000);\n    digitalWrite(walkLED, LOW);\n    digitalWrite(redLED, LOW);\n  } else {\n    digitalWrite(redLED, HIGH);\n    delay(2000);\n    digitalWrite(redLED, LOW);\n    digitalWrite(greenLED, HIGH);\n    delay(2000);\n    digitalWrite(greenLED, LOW);\n    digitalWrite(yellowLED, HIGH);\n    delay(1000);\n    digitalWrite(yellowLED, LOW);\n  }\n}",
      task: "Test the button. Press it during the normal cycle and check that the vehicle RED LED and walk LED turn on for the crossing phase.",
      hint: "Read the button with digitalRead(buttonPin) == LOW. Turn GREEN off before starting the crossing phase.",
      checks: [
        {
          label: "Button is configured as INPUT_PULLUP",
          fail: "Use pinMode(buttonPin, INPUT_PULLUP).",
          pattern: /pinMode\s*\(\s*buttonPin\s*,\s*INPUT_PULLUP\s*\)/
        }
        ,
        {
          label: "Button press is detected",
          fail: "Check digitalRead(buttonPin) == LOW.",
          pattern: /digitalRead\s*\(\s*buttonPin\s*\)\s*==\s*LOW/
        }
        ,
        {
          label: "Pedestrian signal turns on",
          fail: "Turn walkLED HIGH.",
          pattern: /digitalWrite\s*\(\s*walkLED\s*,\s*HIGH\s*\)/
        }
        ,
        {
          label: "Vehicle red signal turns on",
          fail: "Turn redLED HIGH during crossing.",
          pattern: /digitalWrite\s*\(\s*redLED\s*,\s*HIGH\s*\)/
        }
      ]
    }
  ]
});
