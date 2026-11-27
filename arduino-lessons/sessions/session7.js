// Session 7: Stepper Motor Builder — student mission pack
SESSIONS.push({
  title: "Session 7: Stepper Motor Builder",
  lessons: [
    {
      title: "1. Control a 28BYJ-48 Stepper Motor",
      explanation: "A stepper motor moves in small steps instead of spinning freely. The common 28BYJ-48 motor is used with a ULN2003 driver board. Never connect the motor coils directly to Arduino pins.",
      notes: {
        intro: "Mission: make a small motor turn forward and backward using a driver board.",
        sections: [
          {
            title: "Connect the driver",
            text: "Plug the 28BYJ-48 motor into the ULN2003 board. Connect IN1–IN4 to Arduino pins 8, 9, 10 and 11. Power the driver from a suitable supply and join grounds.",
            points: [
              "Use the motor's driver board; do not connect the motor directly to Arduino.",
              "Check the supply voltage and current for your motor."
            ]
          }
          ,
          {
            title: "Use the Stepper library",
            text: "The Stepper library controls the coil sequence. Define the number of steps per revolution for your motor model.",
            points: [
              "The common 28BYJ-48 is often described as 2048 steps per output-shaft revolution in a common half-step setup; actual library configuration and gearing can affect this.",
              "Start slowly and test the direction."
            ]
          }
        ],
        diagram: { file: "session7-lesson1.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "#include <Stepper.h>\n\nconst int stepsPerRevolution = 2048;\nStepper myStepper(stepsPerRevolution, 8, 10, 9, 11);\n\nvoid setup() {\n  myStepper.setSpeed(8);\n}\n\nvoid loop() {\n  myStepper.step(stepsPerRevolution);\n  delay(1000);\n  myStepper.step(-stepsPerRevolution);\n  delay(1000);\n}",
      task: "Change the motor speed from 8 RPM to 12 RPM. Test one forward turn and one reverse turn.",
      hint: "Use myStepper.setSpeed(12). Keep the negative step count to reverse direction.",
      checks: [
        {
          label: "Stepper library is included",
          fail: "Add #include <Stepper.h>.",
          pattern: /#include\s*<Stepper\.h>/
        }
        ,
        {
          label: "Stepper object is created",
          fail: "Create the myStepper object.",
          pattern: /Stepper\s+myStepper/
        }
        ,
        {
          label: "Speed is set to 12 RPM",
          fail: "Change setSpeed to 12.",
          pattern: /setSpeed\s*\(\s*12\s*\)/
        }
        ,
        {
          label: "Forward movement exists",
          fail: "Use a positive step count.",
          pattern: /myStepper\.step\s*\(\s*stepsPerRevolution\s*\)/
        }
        ,
        {
          label: "Reverse movement exists",
          fail: "Use a negative step count.",
          pattern: /myStepper\.step\s*\(\s*-\s*stepsPerRevolution\s*\)/
        }
      ]
    }
    ,
    {
      title: "2. Move a Stepper by a Chosen Amount",
      explanation: "A stepper can move a requested number of steps. Use the Serial Monitor to send F for forward, R for reverse and S to stop between commands. The motor stops when no step command is being processed.",
      notes: {
        intro: "Mission: create a simple command-controlled turntable. Type F or R in the Serial Monitor and press Send.",
        sections: [
          {
            title: "Read a serial command",
            text: "Serial.available() checks whether a character has arrived. Serial.read() reads it.",
            points: [
              "Set Serial Monitor to 9600 baud.",
              "Select newline or no line ending; this example ignores line-ending characters."
            ]
          }
          ,
          {
            title: "Move in small steps",
            text: "A positive step count moves one way; a negative count moves the other way.",
            points: [
              "The motor is powered through the ULN2003 driver.",
              "Use an appropriate external supply and common ground."
            ]
          }
        ],
        diagram: { file: "session7-lesson2.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "#include <Stepper.h>\n\nconst int stepsPerRevolution = 2048;\nStepper myStepper(stepsPerRevolution, 8, 10, 9, 11);\n\nvoid setup() {\n  Serial.begin(9600);\n  myStepper.setSpeed(8);\n  Serial.println(\"Send F for forward, R for reverse\");\n}\n\nvoid loop() {\n  if (Serial.available() > 0) {\n    char command = Serial.read();\n\n    if (command == 'F' || command == 'f') {\n      myStepper.step(256);\n      Serial.println(\"Moved forward\");\n    } else if (command == 'R' || command == 'r') {\n      myStepper.step(-256);\n      Serial.println(\"Moved backward\");\n    }\n  }\n}",
      task: "Add a command B that moves the motor backward by 512 steps. Test F, R and B from the Serial Monitor.",
      hint: "Add another else if condition for command == 'B' or command == 'b', then call myStepper.step(-512).",
      checks: [
        {
          label: "Serial input is enabled",
          fail: "Start Serial at 9600.",
          pattern: /Serial\.begin\s*\(\s*9600\s*\)\s*;/
        }
        ,
        {
          label: "Incoming serial data is checked",
          fail: "Use Serial.available().",
          pattern: /Serial\.available\s*\(\s*\)/
        }
        ,
        {
          label: "A command is read",
          fail: "Use Serial.read().",
          pattern: /Serial\.read\s*\(\s*\)/
        }
        ,
        {
          label: "Forward command exists",
          fail: "Check for F or f.",
          pattern: /command\s*==\s*'F'/
        }
        ,
        {
          label: "Backward 512-step command exists",
          fail: "Move backward by 512 steps.",
          pattern: /myStepper\.step\s*\(\s*-\s*512\s*\)/
        }
      ]
    }
  ]
});
