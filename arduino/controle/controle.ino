
int ledPin_qc = 7; //Led no pino 7
int ledPin_qs = 6;
int ledPin_co = 5;
int ledPin_sl = 4;

int ldrPin_qc = 0; //LDR no pino analígico 8
int ldrPin_qs = 1;
int ldrPin_co = 2;
int ldrPin_sl = 3;

double ldrValor_qc = 0; //Valor lido do LDR
int ldrValor_co = 0;
int ldrValor_qs = 0;
int ldrValor_sl = 0;

double setPoint_qc = 500;
int setPoint_qs = 500;
int setPoint_co = 500;
int setPoint_sl = 500;

double ledPower_qc = 0;
int ledPower_qs = 0;
int ledPower_co = 0;
int ledPower_sl = 0;

int counter = 0;
int amostras = 5;

double variacao = 0.01;

int getLedPower(int sensorValue,int ledPowerValue, int setPoitValue);
String getValue(String data, char separator, int index);

float StrToFloat(String str);

String cmd ="";


void setup() {
 pinMode(ledPin_qc,OUTPUT); //define a porta 7 como saída
 pinMode(ledPin_qs,OUTPUT); //define a porta 7 como saída
 pinMode(ledPin_co,OUTPUT);
 pinMode(ledPin_sl,OUTPUT);
 Serial.begin(9600); //Inicia a comunicação serial
 
 ldrValor_qc = analogRead(ldrPin_qc);
 myPID.SetMode(AUTOMATIC);
 
}
 
void loop() {
 ///ler o valor do LDR
 ldrValor_qc = ldrValor_qc + analogRead(ldrPin_qc); //O valor lido será entre 0 e 1023
 ldrValor_qs = ldrValor_qs + analogRead(ldrPin_qs);  
 ldrValor_co = ldrValor_co + analogRead(ldrPin_co);
 ldrValor_sl = ldrValor_sl + analogRead(ldrPin_sl);

  counter = counter + 1;
 
 if (Serial.available()) {
        String cmd = Serial.readStringUntil('\n');
        String var = getValue(cmd,':',0);
        String value = getValue(cmd,':',1);
        
        if(var.equals("amostras")){
          
          amostras = value.toInt();
          counter = 1;
        }
        if(var.equals("variacao")){
          char floatbuf[32]; // make this at least big enough for the whole string
          value.toCharArray(floatbuf, sizeof(floatbuf));
          variacao = atof(floatbuf);
         

        }
        if(var.equals("setPoint_qc")){
          char floatbuf[32]; // make this at least big enough for the whole string
          value.toCharArray(floatbuf, sizeof(floatbuf));
          setPoint_qc = (double)atof(floatbuf);
         
        }
        if(var.equals("setPoint_qs")){
          setPoint_qs = value.toInt();
        }
        if(var.equals("setPoint_co")){
          setPoint_co = value.toInt();
         
        }
        if(var.equals("setPoint_sl")){
          setPoint_sl = value.toInt();
        }
               
    }
 if(counter%amostras == 0){
   ldrValor_qc = ldrValor_qc/amostras;
   ldrValor_qs = ldrValor_qs/amostras;
   ldrValor_co = ldrValor_co/amostras;
   ldrValor_sl = ldrValor_sl/amostras;
   
 

  //ledPower_qc = getLedPower(ldrValor_qc,ledPower_qc,setPoint_qc,variacao);
  ledPower_qs = getLedPower(ldrValor_qs,ledPower_qs,setPoint_qs,variacao);
  ledPower_co = getLedPower(ldrValor_co,ledPower_co,setPoint_co,variacao);
  ledPower_sl = getLedPower(ldrValor_sl,ledPower_sl,setPoint_sl,variacao);
  
  myPID.Compute();
  
  analogWrite(ledPin_qc, ledPower_qc);         
  analogWrite(ledPin_qs, ledPower_qs);         
  analogWrite(ledPin_co, ledPower_co);         
  analogWrite(ledPin_sl, ledPower_sl);         
  
  /*
  float percentLed_qc = (float)(ledPower_qc)*100/255;
  float percentLed_qs = (float)(ledPower_qs)*100/255;
  float percentLed_co = (float)(ledPower_co)*100/255;
  float percentLed_sl = (float)(ledPower_sl)*100/255;
  */
  float percentLed_qc = (float)(ledPower_qc);
  float percentLed_qs = (float)(ledPower_qs);
  float percentLed_co = (float)(ledPower_co);
  float percentLed_sl = (float)(ledPower_sl);
   
 
 
 /*    
 Serial.print("setPoint_qs:");
 Serial.println(setPoint_qs);
 
 Serial.print("ldrValor_qs:");
 Serial.println(ldrValor_qs);
 
 Serial.print("ledPower_qs:");
 Serial.println(percentLed_qs);
 
 */
 
  
  

 Serial.print("setPoint_qc:");
 Serial.println(setPoint_qc);
 
 Serial.print("setPoint_qs:");
 Serial.println(setPoint_qs);
 
 Serial.print("setPoint_co:");
 Serial.println(setPoint_co);
 
 Serial.print("setPoint_sl:");
 Serial.println(setPoint_sl);
  
 Serial.print("ldrValor_qc:");
 Serial.println(ldrValor_qc);
 
 Serial.print("ledPower_qc:");
 Serial.println(percentLed_qc);
 
 Serial.print("ldrValor_qs:");
 Serial.println(ldrValor_qs);
 
 Serial.print("ledPower_qs:");
 Serial.println(percentLed_qs);
 
 Serial.print("ldrValor_co:");
 Serial.println(ldrValor_co);
 
 Serial.print("ledPower_co:");
 Serial.println(percentLed_co);
 
 Serial.print("ldrValor_sl:");
 Serial.println(ldrValor_sl);
 
 Serial.print("ledPower_sl:");
 Serial.println(percentLed_sl);
 
   ldrValor_qc = 0;
   ldrValor_qs = 0;
   ldrValor_co = 0;
   ldrValor_sl = 0;
   
 } 
 //imprime o valor lido do LDR no monitor serial
 /*
 Serial.print("\nQC - Ldr: ");
 Serial.print(ldrValor_qc);
 Serial.print(" Led: ");
 Serial.print(ledPower_qc);
 Serial.print(" QS - Ldr: ");
 Serial.print(ldrValor_qs);
 Serial.print(" Led: ");
 Serial.print(ledPower_qs);
 Serial.print(" CO - Ldr: ");
 Serial.print(ldrValor_co);
 Serial.print(" Led: ");
 Serial.print(ledPower_co);
 Serial.print(" SL - Ldr: ");
 Serial.print(ldrValor_sl);
 Serial.print(" Led: ");
 
 Serial.print(ledPower_sl);
 */
 delay(5);
}

float StrToFloat(String str)
{
     char carray[str.length() + 1]; 

     str.toCharArray(carray, sizeof(carray));

    return atof(carray);
}

String getValue(String data, char separator, int index)
{
    int found = 0;
    int strIndex[] = { 0, -1 };
    int maxIndex = data.length() - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt(i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i+1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}

int getLedPower(int sensorValue, int ledPowerValue, int setPoitValue,float taxa){
  float maximum = 1 + taxa;
  float minimum = 1 - taxa;
 
  int maxLedPower = 255;
  int minLedPower = 0;
  int maxPoint = setPoitValue*maximum;
  int minPoint = setPoitValue*minimum;
  int dif = sensorValue - setPoitValue;
  
   int ledIncrement = 1;
  if(dif < 0){
    dif = dif*(-1);
  }
   
  if(dif < 1024){
    ledIncrement = 30;
  }
  if(dif < 500){
    ledIncrement = 15;
  }  
  if(dif < 300){
    ledIncrement = 10;
  }  
  if(dif < 100){
    ledIncrement = 5;
  }  
  if(dif < 40){
    ledIncrement = 1;
  }  
  
    /*
 Serial.print("dif:");
 Serial.print(dif);
 Serial.print(" = ");
 Serial.print(sensorValue);
 Serial.print(" - ");
 Serial.println(setPoitValue);

 
 Serial.print("ledIncrement:");
 Serial.println(ledIncrement);
 */
 
  if (sensorValue > maxPoint ){    
    ledPowerValue = ledPowerValue + ledIncrement;
    if(ledPowerValue > maxLedPower){
      ledPowerValue = maxLedPower;
    } 
  }
  if (sensorValue < minPoint){
     ledPowerValue = ledPowerValue - ledIncrement;
     if(ledPowerValue < minLedPower){
       ledPowerValue = minLedPower;
     }
  }
  return ledPowerValue;
  
}
