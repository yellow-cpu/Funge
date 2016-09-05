#define MOISTURE_PIN A2
int sensorValue = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.print("sensor = " );
  sensorValue = analogRead(MOISTURE_PIN);
  Serial.println(MOISTURE_PIN);
  delay(3000);

}
