// Session 6: Ultrasonic Distance Explorer — student mission pack
SESSIONS.push({
  title: "Session 6: Ultrasonic Distance Explorer",
  lessons: [
    {
      title: "1. Measure Distance with HC-SR04",
      explanation: "The HC-SR04 sends an ultrasonic sound pulse and measures how long its echo takes to return. The Arduino converts that time into an approximate distance in centimetres.",
      notes: {
        intro: "Mission: build a parking sensor. Move your hand closer and farther away and watch the distance in the Serial Monitor.",
        sections: [
          {
            title: "Connect the HC-SR04",
            text: "VCC to 5V, GND to GND, TRIG to pin 9 and ECHO to pin 10.",
            points: [
              "Keep the module facing the object.",
              "The common HC-SR04 echo output is 5V; check compatibility if using a 3.3V board."
            ]
          }
          ,
          {
            title: "Calculate distance",
            text: "Send a short trigger pulse, then use pulseIn() to measure echo time. Distance in cm is approximately duration × 0.0343 ÷ 2.",
            points: [
              "The divide-by-two accounts for the sound travelling to the object and back.",
              "pulseIn() can time out; handle a zero result."
            ]
          }
        ],
        diagram: { file: "session6-lesson1.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "const int trigPin = 9;\nconst int echoPin = 10;\n\nvoid setup() {\n  pinMode(trigPin, OUTPUT);\n  pinMode(echoPin, INPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  digitalWrite(trigPin, LOW);\n  delayMicroseconds(2);\n  digitalWrite(trigPin, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(trigPin, LOW);\n\n  long duration = pulseIn(echoPin, HIGH, 30000);\n  if (duration == 0) {\n    Serial.println(\"No echo - check sensor\");\n  } else {\n    float distance = duration * 0.0343 / 2;\n    Serial.print(\"Distance: \");\n    Serial.print(distance);\n    Serial.println(\" cm\");\n  }\n\n  delay(200);\n}",
      task: "Measure an object at three different distances. Move it closer and check that the number gets smaller.",
      hint: "TRIG is OUTPUT and ECHO is INPUT. Use pulseIn(echoPin, HIGH, 30000) to avoid waiting forever.",
      checks: [
        {
          label: "Trigger pin is output",
          fail: "Configure trigPin as OUTPUT.",
          pattern: /pinMode\s*\(\s*trigPin\s*,\s*OUTPUT\s*\)/
        }
        ,
        {
          label: "Echo pin is input",
          fail: "Configure echoPin as INPUT.",
          pattern: /pinMode\s*\(\s*echoPin\s*,\s*INPUT\s*\)/
        }
        ,
        {
          label: "Echo pulse is measured",
          fail: "Use pulseIn() on echoPin.",
          pattern: /pulseIn\s*\(\s*echoPin\s*,\s*HIGH/
        }
        ,
        {
          label: "Distance formula divides by two",
          fail: "Use the round-trip correction.",
          pattern: /0\.0343\s*\/\s*2/
        }
        ,
        {
          label: "Serial monitor is enabled",
          fail: "Start Serial at 9600.",
          pattern: /Serial\.begin\s*\(\s*9600\s*\)\s*;/
        }
      ]
    }
    ,
    {
      title: "2. Make a Distance Warning",
      explanation: "Now turn the distance into an action. If an object is closer than 15 cm, turn on a warning LED and print ALERT. Otherwise keep the LED off.",
      notes: {
        intro: "Mission: make a mini parking assistant that warns when something gets too close.",
        sections: [
          {
            title: "Choose a safe threshold",
            text: "The threshold is the distance where the warning begins. This project uses 15 cm.",
            points: [
              "distance < 15 means the object is close.",
              "Change the threshold to suit your experiment."
            ]
          }
          ,
          {
            title: "Add an LED",
            text: "Connect an LED with a 220Ω–330Ω resistor to pin 6 and GND.",
            points: [
              "Turn the LED on when the object is close.",
              "Turn it off when the area is clear."
            ]
          }
        ],
        diagram: { file: "session6-lesson2.svg", alt: "Lesson wiring and connection diagram" }
      },
      code: "const int trigPin = 9;\nconst int echoPin = 10;\nconst int warningLED = 6;\n\nvoid setup() {\n  pinMode(trigPin, OUTPUT);\n  pinMode(echoPin, INPUT);\n  pinMode(warningLED, OUTPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  digitalWrite(trigPin, LOW);\n  delayMicroseconds(2);\n  digitalWrite(trigPin, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(trigPin, LOW);\n\n  long duration = pulseIn(echoPin, HIGH, 30000);\n  if (duration == 0) {\n    digitalWrite(warningLED, LOW);\n    Serial.println(\"No echo\");\n  } else {\n    float distance = duration * 0.0343 / 2;\n    if (distance < 15) {\n      digitalWrite(warningLED, HIGH);\n      Serial.println(\"ALERT - TOO CLOSE\");\n    } else {\n      digitalWrite(warningLED, LOW);\n      Serial.println(\"SAFE\");\n    }\n  }\n  delay(150);\n}",
      task: "Change the warning distance from 15 cm to 25 cm. Test the LED at different distances.",
      hint: "Find the if condition that compares distance with 15 and change it to 25.",
      checks: [
        {
          label: "Warning LED is configured",
          fail: "Set warningLED as OUTPUT.",
          pattern: /pinMode\s*\(\s*warningLED\s*,\s*OUTPUT\s*\)/
        }
        ,
        {
          label: "Close-distance threshold is 25 cm",
          fail: "Change the comparison to distance < 25.",
          pattern: /distance\s*<\s*25/
        }
        ,
        {
          label: "Warning LED turns on",
          fail: "Turn warningLED HIGH when close.",
          pattern: /digitalWrite\s*\(\s*warningLED\s*,\s*HIGH\s*\)/
        }
        ,
        {
          label: "Safe state turns LED off",
          fail: "Turn warningLED LOW when safe.",
          pattern: /digitalWrite\s*\(\s*warningLED\s*,\s*LOW\s*\)/
        }
      ]
    }
  ]
});
