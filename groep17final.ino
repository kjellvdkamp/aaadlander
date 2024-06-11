#include <HX711.h>
#include <RF24.h>
#include <Servo.h>

// HX711 Load Cell
uint8_t dataPin  = 8;
uint8_t clockPin = 7;

HX711 scale;

// NRF24L01 Radio
#define RF24_CE 9
#define RF24_CSN 10
RF24 radio(RF24_CE, RF24_CSN);
const uint64_t rfAddress = 0x4141414434LL;
const uint8_t rfChannel = 101;

// Define the RF24 payload size
#define RF24_PAYLOAD_SIZE 32
uint8_t txData[RF24_PAYLOAD_SIZE];
uint8_t rxData[RF24_PAYLOAD_SIZE];

// Servo Motors
Servo servomotor1;
Servo servomotor2;
Servo servomotor3;
Servo servomotor4;

void setup() {
  Serial.begin(115200);
  scale.begin(dataPin, clockPin);
  scale.set_scale();
  scale.tare();
  radio.begin();
  radio.setPALevel(RF24_PA_HIGH);
  radio.setChannel(rfChannel);
  radio.setRetries(15, 15);
  radio.openWritingPipe(rfAddress);
  radio.openReadingPipe(1, rfAddress);
  radio.stopListening();
  servomotor1.attach(2);
  servomotor1.write(0);
  servomotor2.attach(3);
  servomotor2.write(0);
  servomotor3.attach(4);
  servomotor3.write(0);
  servomotor4.attach(5);
  servomotor4.write(0);
  
  resetPosition();
}

void loop() {
  if (radio.available()) {
    uint8_t data;
    radio.read(&data, sizeof(data));
    switch (data) {
      case 0x01:
        testServo1and2();
        break;
      case 0x02:
        pickSequence();
        break;
      case 0x03:
        resetPosition();
        break;
      case 0x04:
        calibrateLoadCell();
        break;
      case 0x05:
        testServo3();
        break;
      case 0x06:
        testServo4();
        break;
    }
  }

  sendData();
}

void testServo1and2() {
  moveServosSmoothly(servomotor1, 0);
  moveServosSmoothly(servomotor2, 0);
  moveServosSmoothly(servomotor3, 0);
  moveServosSmoothly(servomotor4, 0);
  moveServosSmoothly(servomotor1, 30);
  moveServosSmoothly(servomotor2, 30);
  moveServosSmoothly(servomotor1, 0);
  moveServosSmoothly(servomotor2, 0);
  Serial.println("Servo 1 and 2 tested: moved to 30 degrees.");
}

void pickSequence() {
    scale.tare();
    servomotor1.write(0);
    servomotor2.write(0);
    servomotor3.write(0);
    servomotor4.write(0);
    moveServosSmoothly(servomotor1, 87);
    moveServosSmoothly(servomotor2, 87);
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
    moveServosSmoothly(servomotor3, 75);
    moveServosSmoothly(servomotor4, 0);
    moveServosSmoothly(servomotor3, 82);
    moveServosSmoothly(servomotor3, 0);
    moveServosSmoothly(servomotor4, 0);
    resetPosition();
}

void resetPosition() {
  moveServosSmoothly(servomotor1, 0);
  moveServosSmoothly(servomotor2, 0);
  moveServosSmoothly(servomotor3, 65);
  moveServosSmoothly(servomotor4, 90);
  moveServosSmoothly(servomotor3, 75);
}

void calibrateLoadCell() {
  moveServosSmoothly(servomotor1, 0);
  moveServosSmoothly(servomotor2, 0);
  moveServosSmoothly(servomotor3, 0);
  moveServosSmoothly(servomotor4, 0);

  Serial.println("Calibrating load cell...");
  scale.tare(); // Reset the scale to zero
  Serial.println("Taring complete. Place a known weight on the scale...");

  // Wait for the user to place the weight
  delay(5000); // Wait for 5 seconds to place the weight

  float knownWeight = 69.55; // Replace with your known weight in grams

  scale.calibrate_scale(knownWeight, 5);

  Serial.print("Calibration complete. Scale factor: ");
  Serial.println(scale.get_scale(), 6);
}

void testServo3() {
  moveServosSmoothly(servomotor3, 70);
  delay(1000);
  moveServosSmoothly(servomotor3, 40);
  delay(1000);
  moveServosSmoothly(servomotor3, 70);
}

void testServo4() {
  moveServosSmoothly(servomotor4, 60);
  delay(1000);
  moveServosSmoothly(servomotor4, 90);
}

void moveServosSmoothly(Servo &servo, int targetAngle) {
    int currentAngle = servo.read();
    if (currentAngle < targetAngle) {
        for (int angle = currentAngle; angle <= targetAngle; angle++) {
            servo.write(angle);
            delay(35);
        }
    } else {
        for (int angle = currentAngle; angle >= targetAngle; angle--) {
            servo.write(angle);
            delay(35);
        }
    }
    // Debugging statement to print the current and target angles
    Serial.print("Moving servo to ");
    Serial.println(targetAngle);
}

int getServoAngle(int servoNumber) {
    int angle = 0;
    switch (servoNumber) {
        case 1: angle = servomotor1.read(); break;
        case 2: angle = servomotor2.read(); break;
        case 3: angle = servomotor3.read(); break;
        case 4: angle = servomotor4.read(); break;
        default: Serial.println("Invalid servo number."); return -1;
    }
    Serial.print("Servo ");
    Serial.print(servoNumber);
    Serial.print(" angle: ");
    Serial.println(angle);
    return angle;
}

void sendData() {
  static const unsigned long sendInterval = 2000;
  static unsigned long lastSendTime = 0;
  unsigned long currentTime = millis();

  if (currentTime - lastSendTime >= sendInterval) {
    lastSendTime = currentTime;

    if (scale.get_units()) { // Update the scale's data
      float weight = scale.get_units(10);
      Serial.print("Weight: ");
      Serial.println(weight);

      uint8_t cursor = 0;
      int16_t weightScaled = static_cast<int16_t>(weight * 100); // Scale to 2 decimal places
    txData[cursor++] = (weightScaled >> 8) & 0xFF;
    txData[cursor++] = weightScaled & 0xFF;
    txData[cursor++] = getServoAngle(1);
    txData[cursor++] = getServoAngle(2);
    txData[cursor++] = getServoAngle(3);
    txData[cursor++] = getServoAngle(4);

      while (cursor < RF24_PAYLOAD_SIZE) {
        txData[cursor++] = 0;
      }

      Serial.print("txData: ");
      for (size_t i = 0; i < cursor; ++i) {
        if (i!= 0) Serial.print(" ");
        printHex2(txData[i]);
      }
      Serial.println();

      radio.stopListening();
      if (!radio.write(txData, RF24_PAYLOAD_SIZE)) {
        Serial.println("Transmission error!");
      }
      radio.startListening();
    } else {
      Serial.println("Error: Failed to get data from the load cell");
    }
  }
}

void printHex2(uint8_t val) {
  if (val < 0x10) {
    Serial.print("0");
  }
  Serial.print(val, HEX);
}