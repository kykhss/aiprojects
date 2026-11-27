// Session 5: Servo Motion Maker — student mission pack
SESSIONS.push({
  title: "Session 5: Servo Motion Maker",
  lessons: [
    {
      title: "1. Move a Servo to an Angle",
      explanation: "A hobby servo moves to a requested angle, often around 0° to 180°. The Servo library creates the control pulses. Use a suitable external 5V supply for larger servos and connect the supply GND to Arduino GND.",
      notes: {
        intro: "Mission: control a tiny robot arm or gate. Try 0°, 90° and 180° and watch the servo move.",
        sections: [
          {
            title: "Wire the servo",
            text: "Signal (often orange/yellow) to pin 9, red to a suitable 5V supply, brown/black to GND. Join external supply GND to Arduino GND.",
            points: [
              "Do not power a large servo from the Arduino 5V pin; it may draw too much current.",
              "Check your servo voltage and wire colours."
            ]
          }
          ,
          {
            title: "Use the Servo library",
            text: "Include Servo.h, create a Servo object, attach it to pin 9, then use write(angle).",
            points: [
              "Servo.write(90) requests the middle position.",
              "Move slowly and avoid forcing the servo horn by hand."
            ]
          }
        ],
        diagram: { file: "session5-lesson1.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "#include <Servo.h>\n\nServo myServo;\nconst int servoPin = 9;\n\nvoid setup() {\n  myServo.attach(servoPin);\n}\n\nvoid loop() {\n  myServo.write(0);\n  delay(1000);\n\n  myServo.write(90);\n  delay(1000);\n\n  myServo.write(180);\n  delay(1000);\n}",
      task: "Change the middle position to 45°. Upload and observe the three positions.",
      hint: "Find myServo.write(90) and change the angle to 45.",
      checks: [
        {
          label: "Servo library is included",
          fail: "Add #include <Servo.h>.",
          pattern: /#include\s*<Servo\.h>/
        }
        ,
        {
          label: "Servo is attached to pin 9",
          fail: "Use myServo.attach(servoPin).",
          pattern: /myServo\.attach\s*\(\s*servoPin\s*\)/
        }
        ,
        {
          label: "Servo reaches zero degrees",
          fail: "Keep the 0 degree position.",
          pattern: /myServo\.write\s*\(\s*0\s*\)/
        }
        ,
        {
          label: "Middle angle is 45 degrees",
          fail: "Change the middle write() to 45.",
          pattern: /myServo\.write\s*\(\s*45\s*\)/
        }
        ,
        {
          label: "Servo reaches 180 degrees",
          fail: "Keep the 180 degree position.",
          pattern: /myServo\.write\s*\(\s*180\s*\)/
        }
      ]
    }
    ,
    {
      title: "2. Build a Sweeping Servo",
      explanation: "A sweep moves the servo gradually from one end to the other. A for loop changes the angle by one degree each time.",
      notes: {
        intro: "Mission: make a radar scanner! The servo should sweep from 0° to 180°, then return.",
        sections: [
          {
            title: "Use a for loop",
            text: "A for loop repeats a block while the angle changes.",
            points: [
              "Start at 0 and increase to 180.",
              "Then count down from 180 to 0."
            ]
          }
          ,
          {
            title: "Choose a safe speed",
            text: "A small delay gives the servo time to move to each requested position.",
            points: [
              "Try delay(15) as a starting point.",
              "If your servo buzzes or strains at the ends, reduce its travel range."
            ]
          }
        ],
        diagram: { file: "session5-lesson2.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "#include <Servo.h>\n\nServo scanner;\n\nvoid setup() {\n  scanner.attach(9);\n}\n\nvoid loop() {\n  for (int angle = 0; angle <= 180; angle++) {\n    scanner.write(angle);\n    delay(15);\n  }\n\n  for (int angle = 180; angle >= 0; angle--) {\n    scanner.write(angle);\n    delay(15);\n  }\n}",
      task: "Make the sweep faster by changing both delays to 8 ms. If the servo struggles, use a smaller angle range.",
      hint: "There are two for loops and two delay(15) lines. Change both delays.",
      checks: [
        {
          label: "Servo is attached",
          fail: "Attach scanner to pin 9.",
          pattern: /scanner\.attach\s*\(\s*9\s*\)/
        }
        ,
        {
          label: "Forward sweep loop exists",
          fail: "Count angle upward to 180.",
          pattern: /angle\s*<=\s*180/
        }
        ,
        {
          label: "Reverse sweep loop exists",
          fail: "Count angle downward to 0.",
          pattern: /angle\s*>=\s*0/
        }
        ,
        {
          label: "Sweep delay is 8 ms",
          fail: "Set delay to 8.",
          pattern: /delay\s*\(\s*8\s*\)\s*;/
        }
      ]
    }
  ]
});
