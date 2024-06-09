#include "LoadCellManager.h"

LoadCellManager::LoadCellManager(int dout, int sck, int calValAddress)
    : calValAddress(calValAddress), tareCompleted(false) {
    loadCell.begin(dout, sck);
    loadCell.set_scale();
    loadCell.tare();

    // Load calibration factor from EEPROM
    EEPROM.get(calValAddress, calibrationFactor);
    if (calibrationFactor == 0 || calibrationFactor == 0xFFFFFFFF) {
        calibrationFactor = 1.0; // Default calibration factor
    }
    loadCell.set_scale(calibrationFactor);
}

void LoadCellManager::calibrate(float knownMass, float precision) {
    loadCell.set_scale(); // Reset scale to default
    loadCell.tare(); // Tare the scale

    // Wait for stable reading
    Serial.print("Calibrating load cell... ");
    while (loadCell.get_units(10) > precision) {
        delay(500);
        Serial.print(".");
    }
    Serial.println();

    float reading = loadCell.get_units(10);
    calibrationFactor = reading / knownMass;
    loadCell.set_scale(calibrationFactor);

    // Save calibration factor to EEPROM
    EEPROM.put(calValAddress, calibrationFactor);
    Serial.print("Calibration factor set to: ");
    Serial.println(calibrationFactor);
}

void LoadCellManager::tare() {
    loadCell.tare();
    tareCompleted = true;
}

float LoadCellManager::getWeight() {
    return loadCell.get_units(10); // Average over 10 readings
}

bool LoadCellManager::getTareStatus() {
    return tareCompleted;
}
