const int RED =  3;
const int GREEN =  5;
const int BLUE =  6;


int redState = LOW;
int red = 255;
int green = 0;
int blue = 0;
int count = 0;
int i = 0;

void setup() {
  // set the digital pin as output:
  pinMode(RED, OUTPUT);
  pinMode(GREEN, OUTPUT);
  pinMode(BLUE, OUTPUT);


}

void loop() {


analogWrite(RED, red);
analogWrite(GREEN, green);
analogWrite(BLUE, blue);
    //red = (red + 1) % 255;
    //green = sin(0.0174533*count) * 255;
    //blue = cos(0.0174533*count+10) * 255;
    red = random(256); 
    green = random(256); 
    blue = random(256); 
    
    if (i - random(2) > 4) {
      delay(200 + random(500));
    } else {
      delay(random(1000)/(random(200)+1));
    }
    
    
    
    
    count += 1;
    
    i = (i + 1) % 6;
}
