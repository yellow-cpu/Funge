

#define RELAY 2

int i = 0;

void setup()
{
  pinMode(RELAY, OUTPUT);
}

void loop()
{
  if (i == 1)
  {
    digitalWrite(RELAY, HIGH);
    i = 0;
  } else {
     digitalWrite(RELAY, LOW);
     i=1;
  }
    delay(3000);
}


