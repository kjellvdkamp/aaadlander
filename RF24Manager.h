#ifndef RF24MANAGER_H
#define RF24MANAGER_H

#include <RF24.h>
#include <Arduino.h>

#define RF24_PAYLOAD_SIZE 32  // Define the payload size

class RF24Manager {
public:
    RF24Manager(int cePin, int csnPin, uint8_t channel, uint64_t address);
    void sendData(uint8_t *data, size_t size);
    bool receiveData(uint8_t *data, size_t size);

private:
    RF24 radio;
};

#endif
