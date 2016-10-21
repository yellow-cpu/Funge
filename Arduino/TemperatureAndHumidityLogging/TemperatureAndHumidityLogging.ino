#include <aws_iot_mqtt.h>
#include <aws_iot_version.h>
#include "aws_iot_config.h"
#include "DHT.h"
#include <math.h>


#define DHTPIN A0     // what pin we're connected to
#define RED_PIN 3
#define GREEN_PIN 5
#define BLUE_PIN 6
#define PUMP_PIN 2
#define MOISTURE_PIN A2

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
char JSON_buf[150];
char JSON_buf_red[5];
char JSON_buf_green[5];
char JSON_buf_blue[5];
char JSON_buf_fan[5];
char JSON_buf_pump[5];
char float_buf[5];
char float_buf2[5];

float desiredTemp = 70.0;

int red = 0, green = 0, blue = 0;
int pumpOn = 0, fanSpeed = 0;

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
IoT_Error_t redResult, greenResult, blueResult, pumpResult, fanResult;

void msg_callback_delta(char* src, unsigned int len, Message_status_t flag) {
  if(flag == STATUS_NORMAL) {
    // Get the whole delta section
    print_log("getDeltaKeyValue", myClient.getDeltaValueByKey(src, "", JSON_buf, 100));
    print_log("getDeltaKeyValueRed", redResult = myClient.getDeltaValueByKey(src, "red", JSON_buf_red, 100));
    print_log("getDeltaKeyValueGreen", greenResult = myClient.getDeltaValueByKey(src, "green", JSON_buf_green, 100));
    print_log("getDeltaKeyValueBlue", blueResult = myClient.getDeltaValueByKey(src, "blue", JSON_buf_blue, 100));
    print_log("getDeltaKeyValuePump", pumpResult = myClient.getDeltaValueByKey(src, "pumpTime", JSON_buf_pump, 100));
    print_log("getDeltaKeyValueFan", fanResult = myClient.getDeltaValueByKey(src, "fanSpeed", JSON_buf_fan, 100));
    
    if (redResult == NONE_ERROR)
      red = atoi(JSON_buf_red);
    if (greenResult == NONE_ERROR)
      green = atoi(JSON_buf_green);
    if (blueResult == NONE_ERROR)
      blue = atoi(JSON_buf_blue);
    if (pumpResult == NONE_ERROR) {
      pumpOn = atoi(JSON_buf_pump);
      Serial.println(pumpOn);
      if (pumpOn >= 1)
        digitalWrite(PUMP_PIN, HIGH);
      else digitalWrite(PUMP_PIN, LOW);
    }
    if (fanResult == NONE_ERROR)
      fanSpeed = atoi(JSON_buf_fan);

    
    
    String payload = "{\"state\":{\"reported\":";
    payload += JSON_buf;
    payload += "}}";
    payload.toCharArray(JSON_buf, 100);
    print_log("update thing shadow", myClient.shadow_update(AWS_IOT_MY_THING_NAME, JSON_buf, strlen(JSON_buf), NULL, 5));
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  
  //while(!Serial);

  char curr_version[80];
  sprintf(curr_version, "AWS IoT SDK Version(dev) %d.%d.%d-%s\n", VERSION_MAJOR, VERSION_MINOR, VERSION_PATCH, VERSION_TAG);

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
  analogWrite(RED_PIN, red);
  analogWrite(GREEN_PIN, green);
  analogWrite(BLUE_PIN, blue);

  if(success_connect) {
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    int moisture = analogRead(MOISTURE_PIN);

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
        dtostrf(h, 4, 1, float_buf2);

        float_buf[4] = '\0';

        sprintf(JSON_buf, "{\"state\":{\"reported\":{\"temperature\":%s, \"humidity\":%s, \"moisture\":%d}}}", float_buf, float_buf2, moisture);
        print_log("shadow update", myClient.shadow_update(AWS_IOT_MY_THING_NAME, JSON_buf, strlen(JSON_buf), NULL, 5));
        if(myClient.yield()) {
          Serial.println("Yield failed.");
        }
    }
    
    delay(4000); // Update every 4000 ms
  }
}
