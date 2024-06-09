#include "ServoManager.h"
#include "RF24Manager.h"
#include "LoadCellManager.h"


// Define the RF24 payload size
#define RF24_PAYLOAD_SIZE 32

// Pin definitions
const int HX711_dout = 8;
const int HX711_sck = 7;
const int knownMass = 100;
const int calVal_eepromAddress = 0;
const uint8_t rf24_channel = 101;
const uint64_t address = 0x4141414434LL;

ServoManager servoManager(2, 3, 4, 5);
RF24Manager rf24Manager(9, 10, rf24_channel, address);
LoadCellManager loadCellManager(HX711_dout, HX711_sck, calVal_eepromAddress);

uint8_t txData[RF24_PAYLOAD_SIZE];
uint8_t rxData[RF24_PAYLOAD_SIZE];
unsigned long previousMillis = 0;
unsigned long currentMillis;
const unsigned long sampleTime = 1000;
unsigned long t = 0;

void setup() {
    Serial.begin(9600);

    char addressStr[17];
    sprintf(addressStr, "%016llX", address);
    Serial.println("nRF24 Application ARO" + String(rf24_channel) + ", Module" + String(addressStr) + " Started!\n");

    servoManager.moveToInitialPosition();
    
}

void loop() {
    currentMillis = millis();
    if (currentMillis - previousMillis >= sampleTime) {
        sendData();
        previousMillis = currentMillis;
    }

    if (rf24Manager.receiveData(rxData, RF24_PAYLOAD_SIZE)) {
        processReceivedData();
    }

    static boolean newDataReady = 0;
    const int serialPrintInterval = 0;

    if (loadCellManager.getWeight()) {
        newDataReady = true;
    }

    if (newDataReady) {
        if (millis() > t + serialPrintInterval) {
            float weight = loadCellManager.getWeight();
            Serial.print("Load_cell output val: ");
            Serial.println(weight);
            newDataReady = 0;
            t = millis();
        }
    }

    if (loadCellManager.getTareStatus() == true) {
        Serial.println("Tare complete");
    }
}

void sendData() {
    static const unsigned long sendInterval = 5000;
    static unsigned long lastSendTime = 0;
    unsigned long currentTime = millis();

    if (currentTime - lastSendTime >= sendInterval) {
        lastSendTime = currentTime;
        float weight = loadCellManager.getWeight();

        uint8_t cursor = 0;
        txData[cursor++] = (uint16_t(weight) >> 8) & 0xFF;
        txData[cursor++] = uint16_t(weight) & 0xFF;
        txData[cursor++] = servoManager.getServoAngle(1);
        txData[cursor++] = servoManager.getServoAngle(2);
        txData[cursor++] = servoManager.getServoAngle(3);
        txData[cursor++] = servoManager.getServoAngle(4);

        while (cursor < RF24_PAYLOAD_SIZE) {
            txData[cursor++] = 0;
        }

        Serial.print("txData: ");
        for (size_t i = 0; i < cursor; ++i) {
            if (i != 0) Serial.print(" ");
            printHex2(txData[i]);
        }
        Serial.println();

        rf24Manager.sendData(txData, sizeof(txData));
    }
}

void processReceivedData() {
    uint8_t command = rxData[0];

    switch (command) {
        case 0x01:
            servoManager.testServo(1, 30);
            servoManager.testServo(2, 30);
            servoManager.testServo(1, 0);
            servoManager.testServo(2, 0);
            Serial.println("Servo 1 and 2 tested: moved to 30 degrees.");
            break;
        case 0x02:
            servoManager.executePickSequence();
            Serial.println("Pick sequence executed.");
            break;
        case 0x03:
            servoManager.moveToInitialPosition();
            Serial.println("Arm moved to initial position.");
            break;
        case 0x04:
            loadCellManager.calibrate(100, 0.1);
            Serial.println("Calibration of HX711 sensor started.");
            break;
        case 0x05:
            servoManager.testServo(3, 30);
            servoManager.testServo(3, 0);
            Serial.println("Servo 3 tested: moved to 30 degrees.");
            break;
        case 0x06:
            servoManager.testServo(4, 30);
            servoManager.testServo(4, 0);
            Serial.println("Servo 4 tested: moved to 30 degrees.");
            break;
        default:
            Serial.println("Unknown command received.");
    }
}

void printHex2(uint8_t val) {
    if (val < 0x10) {
        Serial.print("0");
    }
    Serial.print(val, HEX);
}
