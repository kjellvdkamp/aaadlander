#ifndef LOADCELLMANAGER_H
#define LOADCELLMANAGER_H

#include <HX711.h>
#include <EEPROM.h>

class LoadCellManager {
public:
    LoadCellManager(int dout, int sck, int calValAddress);
    void calibrate(float knownMass, float precision);
    void tare();
    float getWeight();
    bool getTareStatus();

private:
    HX711 loadCell;
    int calValAddress;
    float calibrationFactor;
    bool tareCompleted;
};

#endif
