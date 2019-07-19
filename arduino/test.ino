int ledPin_qc = 7; //Led no pino 7

int ldrPin_qc = 0; //LDR no pino analígico 8

int ldrValor_qc = 0; //Valor lido do LDR



double setPoint_qc = 500;

double ledPower_qc = 0;

double faixaTrabalho_qc[2] = {};

double compute(double input,double setPoint,double kp,double ki, double kd,double confiVals);

void calibarLed(int ledPin,int ldrPin, double faixaTrabalho);




unsigned long lastTime;
double errSum, lastErr;
double kp, ki, kd;

void setup() {
 pinMode(ledPin_qc,OUTPUT); //define a porta 7 como saída
 Serial.begin(9600); //Inicia a comunicação serial
 calibarLed(ledPin_qc,ldrPin_qc,faixaTrabalho_qc);
}
 
void loop() {
 ///ler o valor do LDR
 ldrValor_qc = analogRead(ldrPin_qc); //O valor lido será entre 0 e 1023
 
  Serial.print("Faixa de Trabalho QC");
  Serial.print(faixaTrabalho_qc[0]);
  Serial.print(" ");
  Serial.println(faixaTrabalho_qc[1]);
  
  double configVals[3] = {lastTime,lastErr,errSum};
  ledPower_qc = compute(ldrValor_qc,setPoint_qc,0.1,0.1,0.1,configVals);   
  
  lastTime = configVals[0];
  lastErr= configVals[1];
  errSum= configVals[2];
  
 delay(500);
}

void calibarLed(int ledPin,int ldrPin, double faixaTrabalho[]){

  int i;
  double sensor = 0;
  
  analogWrite(ledPin,255);
  delay(1000);
  for(i = 0; i< 10; i++){
    sensor = sensor + analogRead(ldrPin);
    double(100);
  }  
  faixaTrabalho[1] = (double)sensor/10;
  
  analogWrite(ledPin,0);
  delay(1000);
  sensor = 0;
  for(i = 0; i < 10; i++){
    sensor = sensor + analogRead(ldrPin);
    double(100);
  }  
  faixaTrabalho[0] = (double)sensor/10;
  
  
}
double compute(double input,double setPoint,double kp,double ki, double kd,double confiVals[])
{
   /*How long since we last calculated*/
   lastTime = confiVals[0];
   errSum = confiVals[2];
   
   
   
   double lastErro = confiVals[1];
   double lastOutput = confiVals[3];
   int incremento;
   
   unsigned long now = millis();
   double timeChange = (double)(now - lastTime);
  
   /*Compute all the working error variables*/
   double erroAtual = setPoint - input;
   errSum += (erroAtual * timeChange);
   double dErr = (erroAtual - lastErr) / timeChange;
  
  
   /*Compute PID Output*/
   double outPut = kp * erroAtual + ki * errSum + kd * dErr;
   
   Serial.print("Input ");
   Serial.print(input);
   Serial.print(" SetPoint ");
   Serial.print(setPoint);
  
   Serial.print(" Erro ");
   Serial.print(erroAtual);
 
   Serial.print(" Output ");
   Serial.println(outPut);
  
   
   
   
   if(erroAtual > 0 && lastErro > 0){
     
     outPut = lastOutput + incremento;
     
     if(outPut > 255){
       outPut = 255;
     }
         
   }
    
   if(erroAtual < 0 && lastErro < 0){
     
     outPut = lastOutput - incremento;
     
     if(outPut < 0){
       outPut = 0;
     }
         
   }
   
   if(erroAtual < 0 && lastErro > 0){
     
     outPut = lastOutput - incremento;
     
     if(outPut > 255){
       outPut = 255;
     }
         
   }
   
    if(erroAtual > 0 && lastErro < 0){
     
     outPut = lastOutput + incremento;
     
     if(outPut > 255){
       outPut = 255;
     }
         
   }
   
   
   
 
   
   confiVals[0] = now;
   confiVals[1] = erroAtual;
   confiVals[2] = errSum;
  
   
   
   
  
  
   return output;
   /*Remember some variables for next time*/
   
}
