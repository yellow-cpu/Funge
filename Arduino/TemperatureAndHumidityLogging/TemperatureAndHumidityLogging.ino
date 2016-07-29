#include <aws_iot_mqtt.h>
#include <aws_iot_version.h>
#include "aws_iot_config.h"
#include "DHT.h"
#include <math.h>

#define DHTPIN A0     // what pin we're connected to

// Uncomment whatever type you're using!
//#define DHTTYPE DHT11   // DHT 11 
#define DHTTYPE DHT22   // DHT 22  (AM2302)
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

// Connect pin 1 (on the left) of the sensor to +5V
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

DHT dht(DHTPIN, DHTTYPE);

aws_iot_mqtt_client myClient;
char JSON_buf[100];
char float_buf[5];

float desiredTemp = 70.0;

bool success_connect = false;

bool print_log(char* src, int code) {
  bool ret = true;
  if(code == 0) {
    Serial.print("[LOG] command: ");
    Serial.print(src);
    Serial.println(" completed.");
    ret = true;
  }
  else {
    Serial.print("[ERR] command: ");
    Serial.print(src);
    Serial.print(" code: ");
    Serial.println(code);
    ret = false;
  }
  return ret;
}

void msg_callback_delta(char* src, unsigned int len, Message_status_t messageStatus) {
  String data = String(src);
  int st = data.indexOf("\"state\":") + strlen("\"state\":");
  int ed = data.indexOf(",\"metadata\":");
  String delta = data.substring(st, ed);
  st = delta.indexOf("\"temperature\":") + strlen("\"temperature\":");
  ed = delta.indexOf("}");
  String delta_data = delta.substring(st, ed);
  desiredTemp = delta_data.toFloat();
}

void setup() {
  Serial.begin(115200);
  delay(2000);
  //while(!Serial);

  char curr_version[80];
  sprintf(curr_version, "AWS IoT SDK Version(dev) %d.%d.%d-%s\n", VERSION_MAJOR, VERSION_MINOR, VERSION_PATCH, VERSION_TAG);
  Serial.println(curr_version);

  if(print_log("setup", myClient.setup(AWS_IOT_CLIENT_ID))) {
    if(print_log("config", myClient.config(AWS_IOT_MQTT_HOST, AWS_IOT_MQTT_PORT, AWS_IOT_ROOT_CA_PATH, AWS_IOT_PRIVATE_KEY_PATH, AWS_IOT_CERTIFICATE_PATH))) {
      if(print_log("connect", myClient.connect())) {
        success_connect = true;
        print_log("shadow init", myClient.shadow_init(AWS_IOT_MY_THING_NAME));
        print_log("register thing shadow delta function", myClient.shadow_register_delta_func(AWS_IOT_MY_THING_NAME, msg_callback_delta));
        dht.begin();
      }
    }
  }
}

void loop() {
  if(success_connect) {
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
    float h = dht.readHumidity();
    float t = dht.readTemperature();

    if (isnan(t) || isnan(h)) 
    {
        Serial.println("Failed to read from DHT");
    } 
    else 
    {
        Serial.print("Humidity: "); 
        Serial.print(h);
        Serial.print(" %\t");
        Serial.print("Temperature: "); 
        Serial.print(t);
        Serial.println(" *C");

        dtostrf(t, 4, 1, float_buf);
        float_buf[4] = '\0';
        sprintf(JSON_buf, "{\"state\":{\"reported\":{\"temperature\":%s}}}", float_buf);
        print_log("shadow update", myClient.shadow_update(AWS_IOT_MY_THING_NAME, JSON_buf, strlen(JSON_buf), NULL, 5));
        if(myClient.yield()) {
          Serial.println("Yield failed.");
        }
    }
    
    delay(5000); // Update every 60000 ms
  }
}
