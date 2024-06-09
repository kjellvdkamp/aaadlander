#include "ServoManager.h"

ServoManager::ServoManager(int pin1, int pin2, int pin3, int pin4) {
    servomotor1.attach(pin1);
    servomotor2.attach(pin2);
    servomotor3.attach(pin3);
    servomotor4.attach(pin4);
    initializePositions();
}

void ServoManager::moveToInitialPosition() {
    servomotor1.write(0);
    servomotor2.write(0);
    servomotor3.write(70);
    servomotor4.write(90);
}

void ServoManager::testServo(int servoNumber, int targetAngle) {
    switch (servoNumber) {
        case 1: moveServosSmoothly(servomotor1, targetAngle); break;
        case 2: moveServosSmoothly(servomotor2, targetAngle); break;
        case 3: moveServosSmoothly(servomotor3, targetAngle); break;
        case 4: moveServosSmoothly(servomotor4, targetAngle); break;
        default: Serial.println("Invalid servo number.");
    }
}

void ServoManager::executePickSequence() {
    moveServosSmoothly(servomotor1, 0);
    moveServosSmoothly(servomotor2, 0);
    moveServosSmoothly(servomotor3, 0);
    moveServosSmoothly(servomotor4, 0);
    moveServosSmoothly(servomotor1, 93);
    moveServosSmoothly(servomotor2, 93);
    moveServosSmoothly(servomotor3, 0);
    moveServosSmoothly(servomotor4, 90);
    moveServosSmoothly(servomotor1, 80);
    moveServosSmoothly(servomotor2, 80);
    moveServosSmoothly(servomotor1, 70);
    moveServosSmoothly(servomotor2, 70);
    moveServosSmoothly(servomotor3, 10);
    moveServosSmoothly(servomotor1, 60);
    moveServosSmoothly(servomotor2, 60);
    moveServosSmoothly(servomotor3, 20);
    moveServosSmoothly(servomotor1, 50);
    moveServosSmoothly(servomotor2, 50);
    moveServosSmoothly(servomotor3, 30);
    moveServosSmoothly(servomotor1, 40);
    moveServosSmoothly(servomotor2, 40);
    moveServosSmoothly(servomotor3, 40);
    moveServosSmoothly(servomotor1, 30);
    moveServosSmoothly(servomotor2, 30);
    moveServosSmoothly(servomotor3, 50);
    moveServosSmoothly(servomotor1, 20);
    moveServosSmoothly(servomotor2, 20);
    moveServosSmoothly(servomotor1, 10);
    moveServosSmoothly(servomotor2, 10);
    moveServosSmoothly(servomotor3, 55);
    moveServosSmoothly(servomotor1, 0);
    moveServosSmoothly(servomotor2, 0);
    moveServosSmoothly(servomotor3, 80);
    moveServosSmoothly(servomotor4, 0);
    moveServosSmoothly(servomotor3, 75);
    moveServosSmoothly(servomotor4, 90);
    moveServosSmoothly(servomotor3, 0);
}

int ServoManager::getServoAngle(int servoNumber) {
    switch (servoNumber) {
        case 1: return servomotor1.read();
        case 2: return servomotor2.read();
        case 3: return servomotor3.read();
        case 4: return servomotor4.read();
        default: Serial.println("Invalid servo number."); return -1;
    }
}

void ServoManager::initializePositions() {
    servomotor1.write(0);
    servomotor2.write(0);
    servomotor3.write(70);
    servomotor4.write(90);
}

void ServoManager::moveServosSmoothly(Servo &servo, int targetAngle) {
    int currentAngle = servo.read();
    if (currentAngle < targetAngle) {
        for (int angle = currentAngle; angle <= targetAngle; angle++) {
            servo.write(angle);
            delay(50);
        }
    } else {
        for (int angle = currentAngle; angle >= targetAngle; angle--) {
            servo.write(angle);
            delay(50);
        }
    }
}
