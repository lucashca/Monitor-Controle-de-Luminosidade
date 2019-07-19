int ledPin_qc = 7; //Led no pino 7
int ledPin_qs = 6;
int ledPin_co = 5;
int ledPin_sl = 4;

int ldrPin_qc = 0; //LDR no pino analígico 8
int ldrPin_qs = 1;
int ldrPin_co = 2;
int ldrPin_sl = 3;

int ldrValor_qc = 0; //Valor lido do LDR
int ldrValor_co = 0;
int ldrValor_qs = 0;
int ldrValor_sl = 0;

int setPoint_qc = 5;
int setPoint_qs = 5;
int setPoint_co = 5;
int setPoint_sl = 5;

double lastErro_qc[1] = {0};
double lastErro_qs[1] = {0};
double lastErro_co[1] = {0};
double lastErro_sl[1] = {0};

int ledPower_qc = 0;
int ledPower_qs = 0;
int ledPower_co = 0;
int ledPower_sl = 0;

int counter = 0;
int amostras = 20;

double lumens_constante = 30;
double variacao = 0.01;

int getLedPower(float sensorValue, int ledPowerValue, float setPoitValue,float taxa,double lastErro[]);
String getValue(String data, char separator, int index);


float StrToFloat(String str);

String cmd ="";


void setup() {
 pinMode(ledPin_qc,OUTPUT); //define a porta 7 como saída
 pinMode(ledPin_qs,OUTPUT); //define a porta 7 como saída
 pinMode(ledPin_co,OUTPUT);
 pinMode(ledPin_sl,OUTPUT);
 Serial.begin(9600); //Inicia a comunicação serial
}
 
void loop() {
 ///ler o valor do LDR

 ldrValor_qc = ldrValor_qc + analogRead(ldrPin_qc); //O valor lido será entre 0 e 1023
 ldrValor_qs = ldrValor_qs + analogRead(ldrPin_qs);  
 ldrValor_co = ldrValor_co + analogRead(ldrPin_co);
 ldrValor_sl = ldrValor_sl + analogRead(ldrPin_sl);
 /*
 ldrValor_qc = ldrValor_qc + (1023 - analogRead(ldrPin_qc))/lumens_constante; //O valor lido será entre 0 e 1023
 ldrValor_qs = ldrValor_qs + (1023 - analogRead(ldrPin_qs))/lumens_constante;  
 ldrValor_co = ldrValor_co + (1023 - analogRead(ldrPin_co))/lumens_constante;
 ldrValor_sl = ldrValor_sl + (1023 - analogRead(ldrPin_sl))/lumens_constante;
*/


  



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
           setPoint_qc = value.toInt();
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
   ldrValor_qc = (float) ldrValor_qc/amostras;
   ldrValor_qs = (float) ldrValor_qs/amostras;
   ldrValor_co = (float) ldrValor_co/amostras;
   ldrValor_sl = (float) ldrValor_sl/amostras;
   
 

  ledPower_qc = getLedPower(ldrValor_qc,ledPower_qc,setPoint_qc,variacao,lastErro_qc);
  ledPower_qs = getLedPower(ldrValor_qs,ledPower_qs,setPoint_qs,variacao,lastErro_qs);
  ledPower_co = getLedPower(ldrValor_co,ledPower_co,setPoint_co,variacao,lastErro_co);
  ledPower_sl = getLedPower(ldrValor_sl,ledPower_sl,setPoint_sl,variacao,lastErro_sl);
  
   
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
 /**/
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


int getLedPower(float sensorValue, int ledPowerValue, float setPoitValue,float taxa,double lastErro[]){
  float maximum = 1 + taxa;
  float minimum = 1 - taxa;
 
  int maxLedPower = 255;
  int minLedPower = 0;
  int maxPoint = setPoitValue*maximum;
  int minPoint = setPoitValue*minimum;
  int oldledPowerValue = ledPowerValue;
  double error = setPoitValue - sensorValue;
  
  double lError = lastErro[0];
   lastErro[0] = error;
  
   double dif = error;
   int ledIncrement = 1;
  if(dif < 0){
    dif = dif*(-1);
  }
  
  if(dif < 1023){
    ledIncrement = 255;
  } 
  if(dif < 950){
    ledIncrement = 230;
  } 
 if(dif < 800){
    ledIncrement = 210;
  } 
 if(dif < 700){
    ledIncrement = 210;
  } 
 if(dif < 600){
    ledIncrement = 190;
  } 
 if(dif < 500){
    ledIncrement = 170;
  } 
 if(dif < 400){
    ledIncrement = 150;
  } 
 if(dif < 300){
    ledIncrement = 100;
  } 
 if(dif < 200){
    ledIncrement = 20;
  } 
 if(dif < 100){
    ledIncrement = 15;
 }
 if(dif < 80){
    ledIncrement = 10;
  }  
 if(dif < 60){
    ledIncrement = 5;
  } 
  if(dif < 40){
    ledIncrement = 1;
  }
  
 if(dif < 60 && setPoitValue < 500){
    ledIncrement = 15;
  } 
  if(dif < 40 && setPoitValue < 500){
    ledIncrement = 10;
  }
  if(dif < 20 && setPoitValue < 500){
    ledIncrement = 5;
  }
  if(dif < 15 && setPoitValue < 500){
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
 

 if(error < 0 && lError < 0){
     Serial.println("Entrout < < ");
   ledPowerValue = ledPowerValue + ledIncrement;
    if(ledPowerValue > maxLedPower){
      ledPowerValue = maxLedPower;
    } 
 }
  if(error > 0 && lError > 0){
   ledPowerValue = ledPowerValue - ledIncrement;
    if(ledPowerValue < minLedPower){
      ledPowerValue = minLedPower;
    } 
 }
  if(error < 0 && lError > 0){
    if(ledIncrement > 10) ledIncrement = 1;
   ledPowerValue = ledPowerValue + ledIncrement;
    if(ledPowerValue > maxLedPower){
      ledPowerValue = maxLedPower;
    } 
 }
  if(error > 0 && lError < 0){
     if(ledIncrement > 10) ledIncrement = 1;
   ledPowerValue = ledPowerValue - ledIncrement;
    if(ledPowerValue < minLedPower){
      ledPowerValue = minLedPower;
    } 
 }
 
 if(sensorValue < maxPoint && sensorValue > minPoint){
   ledPowerValue = oldledPowerValue;
 }
 
 /*
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
  */
  

    
  Serial.println(ledIncrement);
    
  Serial.println(ledPowerValue);
  return ledPowerValue;
  
}
