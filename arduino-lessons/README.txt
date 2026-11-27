ARDUINO ADVENTURE LAB — COURSE UPDATE

Open index.html through localhost or HTTPS in Chrome/Edge.

Course map:
1. First Steps with LEDs — built-in blink and PWM fade
2. Joystick & Serial Explorer — X/Y/button input, Serial Monitor, direction decisions
3. Traffic Light Engineer — three LEDs and pedestrian crossing button
4. IR Sensor Detective — one obstacle sensor and a three-sensor line detector
5. Servo Motion Maker — angle control and sweep
6. Ultrasonic Distance Explorer — HC-SR04 distance and warning LED
7. Stepper Motor Builder — 28BYJ-48 + ULN2003 and serial commands

Hardware safety:
- Use a 220–330 ohm resistor with each external LED.
- Never power servo or stepper motors from Arduino I/O pins.
- Use a suitable external motor supply and connect its GND to Arduino GND.
- Check module pin labels and voltage requirements before wiring.
- IR output polarity and joystick centre values vary; test your modules.
- Stepper lesson assumes a 28BYJ-48 with ULN2003 driver.
- Code checks are pattern checks; they cannot verify physical wiring.


LESSON DIAGRAMS
All 14 lessons include an individual SVG diagram in the assets/ folder. Keep the assets folder beside index.html. SVG images remain sharp when zoomed.


SESSION 1 TEACHING UPGRADE
Session 1 now contains three guided lessons: built-in LED blink, heartbeat rhythm, and PWM fade.
Each lesson includes expanded mini-lectures, a teacher demonstration plan, a student challenge, code checks, and an interactive quick knowledge check.
The new heartbeat timing diagram is assets/session1-heartbeat.svg.


LIVE LED BLINK PREVIEW
The interactive built-in LED simulator appears only in Lesson 1: Blink the Built-in LED.
Students can start, pause, resume and reset the simulation and adjust ON/OFF times independently.
This is a browser simulation and does not control the physical Arduino board.
