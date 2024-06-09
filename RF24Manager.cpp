#include "RF24Manager.h"

RF24Manager::RF24Manager(int cePin, int csnPin, uint8_t channel, uint64_t address) 
    : radio(cePin, csnPin) {
    radio.begin();
    radio.setPALevel(RF24_PA_MIN);
    radio.setDataRate(RF24_1MBPS);
    radio.setChannel(channel);
    radio.setPayloadSize(RF24_PAYLOAD_SIZE);
    radio.openWritingPipe(address);
    radio.openReadingPipe(1, address);
    radio.startListening();
}

void RF24Manager::sendData(uint8_t *data, size_t size) {
    radio.stopListening();
    radio.write(data, size);
    radio.startListening();
}

bool RF24Manager::receiveData(uint8_t *data, size_t size) {
    if (radio.available()) {
        radio.read(data, size);
        return true;
    }
    return false;
}
