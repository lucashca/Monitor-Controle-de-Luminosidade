import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators/timeout';

@Injectable({
  providedIn: 'root'
})
export class ArduinoService {

  constructor(private http: HttpClient) { }

  urlServerArduino = 'http://localhost:3000/';

  getMedidas(){
    const urlMedidas = this.urlServerArduino + 'getMedidas';
    return this.http.post(urlMedidas, {});
  }

  sendCmdToArduino(cmd){
    const urlMedidas = this.urlServerArduino + 'sendCmdToArduino';
    return this.http.post(urlMedidas, {cmd:cmd}).pipe(timeout(1000 ));;
  }
  
  setComPort(comPort){
    const urlMedidas = this.urlServerArduino + 'setComPort';
    return this.http.post(urlMedidas,{comPort:comPort});
  }
  
  getData(key){
    const urlData = this.urlServerArduino + 'getData';
    return this.http.post(urlData, {key:key}).pipe(timeout(1000 ));
  }

  getDevices(){
    const urlData = this.urlServerArduino + 'getDevices';
    return this.http.post(urlData, {});
  }

  addMedida(medida){
    const urlData = this.urlServerArduino + 'addMedidas';
    return this.http.post(urlData, medida);
  }

  

  getBalancaData() {
    const urlBalanca = this.urlServerArduino + 'balanca';
    return this.http.get(urlBalanca);
  }
  getAnguloData() {
    const urlAngulo = this.urlServerArduino + 'angulo';
    return this.http.get(urlAngulo);
  }

}