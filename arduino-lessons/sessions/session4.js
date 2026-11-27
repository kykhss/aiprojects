// Session 4: IR Sensor Detective — student mission pack
SESSIONS.push({
  title: "Session 4: IR Sensor Detective",
  lessons: [
    {
      title: "1. Detect an Object with One IR Module",
      explanation: "An IR obstacle sensor sends infrared light and checks how much reflects back. Its digital OUT pin usually changes between HIGH and LOW when an object is near. Module adjustment and output polarity can vary.",
      notes: {
        intro: "Mission: detect an object with an IR sensor and show the result using the Serial Monitor and an LED.",
        sections: [
          {
            title: "Connect the module",
            text: "VCC to 5V, GND to GND and OUT to pin 2. Connect an indicator LED with a resistor to pin 13 if you want a separate output.",
            points: [
              "Check whether your module works at 3.3V or 5V before connecting.",
              "Turn the small potentiometer to adjust detection distance."
            ]
          }
          ,
          {
            title: "Read digital output",
            text: "Use digitalRead(sensorPin). Test your own module to discover whether detection gives LOW or HIGH.",
            points: [
              "Many common LM393 IR obstacle modules output LOW when an object is detected.",
              "Do not assume polarity; test it on your module."
            ]
          }
        ],
        diagram: { file: "session4-lesson1.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "const int sensorPin = 2;\nconst int indicatorLED = 13;\n\nvoid setup() {\n  pinMode(sensorPin, INPUT);\n  pinMode(indicatorLED, OUTPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int sensorValue = digitalRead(sensorPin);\n\n  if (sensorValue == LOW) {\n    Serial.println(\"OBJECT DETECTED\");\n    digitalWrite(indicatorLED, HIGH);\n  } else {\n    Serial.println(\"CLEAR\");\n    digitalWrite(indicatorLED, LOW);\n  }\n\n  delay(100);\n}",
      task: "Move your hand in front of the sensor. Adjust the potentiometer until the detection distance is useful. If your module uses opposite logic, change LOW to HIGH.",
      hint: "The sensor's OUT wire goes to sensorPin. Use digitalRead() and an if/else decision.",
      checks: [
        {
          label: "Sensor pin is configured",
          fail: "Set sensorPin as INPUT.",
          pattern: /pinMode\s*\(\s*sensorPin\s*,\s*INPUT\s*\)/
        }
        ,
        {
          label: "Sensor value is read",
          fail: "Use digitalRead(sensorPin).",
          pattern: /digitalRead\s*\(\s*sensorPin\s*\)/
        }
        ,
        {
          label: "Object detection message exists",
          fail: "Print OBJECT DETECTED.",
          pattern: /OBJECT DETECTED/
        }
        ,
        {
          label: "Indicator responds",
          fail: "Control indicatorLED with digitalWrite().",
          pattern: /digitalWrite\s*\(\s*indicatorLED/
        }
      ]
    }
    ,
    {
      title: "2. Three-Sensor Line Detector",
      explanation: "Use three IR modules: LEFT, CENTRE and RIGHT. Together they can help a simple robot understand where a dark line is. First test each sensor and note whether black or white gives LOW or HIGH on your modules.",
      notes: {
        intro: "Mission: build a three-sensor dashboard. Read all three sensors and print a simple pattern such as 0-1-0.",
        sections: [
          {
            title: "Connect three sensors",
            text: "Connect OUT pins to D2, D3 and D4. Share 5V and GND between modules.",
            points: [
              "All modules must share a common GND with the Arduino.",
              "Keep sensor spacing even and close to the floor for line-following experiments."
            ]
          }
          ,
          {
            title: "Understand the pattern",
            text: "The pattern tells you which sensor sees the line. The example assumes LOW means line detected; test and reverse the condition if needed.",
            points: [
              "Centre sensor detects line: robot is aligned.",
              "Left sensor detects line: robot may need to steer left.",
              "Right sensor detects line: robot may need to steer right."
            ]
          }
        ],
        diagram: { file: "session4-lesson2.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "const int leftSensor = 2;\nconst int centreSensor = 3;\nconst int rightSensor = 4;\n\nvoid setup() {\n  pinMode(leftSensor, INPUT);\n  pinMode(centreSensor, INPUT);\n  pinMode(rightSensor, INPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int L = digitalRead(leftSensor);\n  int C = digitalRead(centreSensor);\n  int R = digitalRead(rightSensor);\n\n  Serial.print(L);\n  Serial.print(\" - \");\n  Serial.print(C);\n  Serial.print(\" - \");\n  Serial.println(R);\n\n  if (C == LOW) {\n    Serial.println(\"LINE UNDER CENTRE\");\n  } else if (L == LOW) {\n    Serial.println(\"LINE LEFT\");\n  } else if (R == LOW) {\n    Serial.println(\"LINE RIGHT\");\n  } else {\n    Serial.println(\"LINE NOT FOUND\");\n  }\n\n  delay(100);\n}",
      task: "Move the sensor board over a black line on white paper. Record the three readings for centre, left and right positions. Adjust LOW/HIGH logic to match your modules.",
      hint: "Use three separate digitalRead() calls. The example assumes LOW means the line is detected.",
      checks: [
        {
          label: "All three pins are configured",
          fail: "Configure left, centre and right as INPUT.",
          pattern: /pinMode\s*\(\s*leftSensor\s*,\s*INPUT\s*\)/
        }
        ,
        {
          label: "Left sensor is read",
          fail: "Read leftSensor.",
          pattern: /digitalRead\s*\(\s*leftSensor\s*\)/
        }
        ,
        {
          label: "Centre sensor is read",
          fail: "Read centreSensor.",
          pattern: /digitalRead\s*\(\s*centreSensor\s*\)/
        }
        ,
        {
          label: "Right sensor is read",
          fail: "Read rightSensor.",
          pattern: /digitalRead\s*\(\s*rightSensor\s*\)/
        }
        ,
        {
          label: "Serial monitor is enabled",
          fail: "Start Serial at 9600.",
          pattern: /Serial\.begin\s*\(\s*9600\s*\)\s*;/
        }
      ]
    }
  ]
});
