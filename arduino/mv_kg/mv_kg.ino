const int analogInPin = A0;  // Entrada analogica do potenciometro

int sensorValue = 0;        // leitura do potenciometro
int outputValue = 0;        // leitura da saida PWM (analogica)
const int variacao = 5;
const int tara = 150;
int cont = 0;
const int numAmostras = 200;
float mediaMassa  = 0.0;
int taraUser = 0;
int tara2 = 50;
float massa = 0.0;

bool toggle = false;
void setup() {
  // inicializa a comunicacao serial:
  Serial.begin(9600);
}

void loop() {
 
  

  
  // put your main code here, to run repeatedly:
  sensorValue = analogRead(analogInPin);            
  // mapeia o resultado da entrada analogica dentro do intervalo de 0 a 255:
  
  // muda o valor da saida analogica:

  // imprime o resultado no monitor serial:
  //Serial.print(sensorValue);     

  
  delay(5);
 
  massa = (sensorValue - tara)*12.714 - tara2;
  if(cont <= numAmostras){
     if(massa < 0){
      massa = 0;
      }
     mediaMassa = mediaMassa + massa;
     cont++;
     if (cont == numAmostras) {
      mediaMassa = mediaMassa/numAmostras;         
      Serial.print("massa:"); 
      Serial.println(mediaMassa); 
      cont = 0;
      }
    }

  
}
