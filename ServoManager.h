#ifndef SERVOMANAGER_H
#define SERVOMANAGER_H

#include <Servo.h>
#include <Arduino.h>

class ServoManager {
public:
    ServoManager(int pin1, int pin2, int pin3, int pin4);
    void moveToInitialPosition();
    void testServo(int servoNumber, int targetAngle);
    void executePickSequence();
    int getServoAngle(int servoNumber);

private:
    Servo servomotor1, servomotor2, servomotor3, servomotor4;
    void initializePositions();
    void moveServosSmoothly(Servo &servo, int targetAngle);
};

#endif
