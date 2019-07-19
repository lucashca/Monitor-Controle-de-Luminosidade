import { Component, OnInit, ViewChild , ElementRef ,AfterViewInit} from '@angular/core';
import {ArduinoService} from './arduino.service';
import {Chart} from 'chart.js';
import * as CanvasJS from '../assets/scripts/canvasjs.min';

import { from } from 'rxjs';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit ,AfterViewInit{



  @ViewChild('tabGroup') tabGroup;

  @ViewChild('canvas_qc') canvas_qc: ElementRef;
  @ViewChild('canvas_qs') canvas_qs: ElementRef;
  @ViewChild('canvas_sl') canvas_sl: ElementRef;
  @ViewChild('canvas_co') canvas_co: ElementRef;

  @ViewChild('canvas_qc_solo') canvas_qc_solo: ElementRef;
  @ViewChild('canvas_qs_solo') canvas_qs_solo: ElementRef;
  @ViewChild('canvas_sl_solo') canvas_sl_solo: ElementRef;
  @ViewChild('canvas_co_solo') canvas_co_solo: ElementRef;

  lumens_constante = 30;
  chart_qc = [];
  chart_qs = [];
  chart_sl = [];
  chart_co = [];
  chart_qc_solo = [];
  chart_qs_solo = [];
  chart_sl_solo = [];
  chart_co_solo = [];

  setPointqc;
  setPointqs;
  setPointco;
  setPointsl;
  
  makeConversion = false;

  setPoint_qc = 0;
  setPoint_qs = 0;
  setPoint_co = 0;
  setPoint_sl = 0;
  
  variacao = 0.01;
  variacaoOld = 0;
  
  taxaAtual = 0;
  sensorPrecision = 10;
  sensorPrecisionOld = 0;

  
  larguraGrafo = 30;
   
  title = 'arduinoWebInterfaceAngular';
  massa: any = 0;
  angulo: any = 0;
  placa = 'Arduino Mega 2560';
  porta = 'COM 8';
  frequencia = 9600;
  pieChart = [];
  myChart: any;


  frequenciaAtualizacaodeDaods = 0.3;

  ang = 0;

  ipAddress:any;

  tabs = []; // create an empty array
  key = [];

  arduinoMsg = "";
  medidasLabels: any = new Array();;
  medidasValues: any =  new Array();
  arduinoError = false;
  devices: any = [];
  showPainel = false;
  defaultSetPoint = 600;

  houseDataSet = [];
  timeDataSet = [];
  startSlice = 0;
  endSlice = 0;
  activeTab = 0;

  setPoints = [];
  

  countStartchart = 0;

  cadastroMedida = {tabTitle:"",title:"",medida:"",unidade:""};

  constructor(private arduinoService: ArduinoService, private elementRef: ElementRef) {

  }


  convertToLms(val){

    let res = (1024 - val)/this.lumens_constante;
    let str = ""+res.toFixed(1);
    if(!this.makeConversion){
      return val;
    }
    return parseFloat(str);
}
  convertToMv(val){
    let res =  1024 - val*this.lumens_constante;
    let str = ""+res.toFixed(1);
    if(!this.makeConversion){
      return val;
    }
    return parseFloat(str);;
  }

  ngOnInit(): void {
    
    this.getMedidas();

    this.createTabs();
 
    this.createMedidaValues();

    this.getDevices();

    
    this.createHouseDataSet();

    this.getAllSetPoints();    
  
 
  }


  async getAllSetPoints(){

        this.getSetPoint('setPoint_qc');
        this.getSetPoint('setPoint_qs');
        this.getSetPoint('setPoint_co');
        this.getSetPoint('setPoint_sl');
      

       
  }

  limpaMemoria(){
  this.houseDataSet = [];
  this.timeDataSet = [];
  
    this.chart_qc = [];
    this.chart_qs = [];
    this.chart_sl = [];
    this.chart_co = [];
    this.chart_qc_solo = [];
    this.chart_qs_solo = [];
    this.chart_sl_solo = [];
    this.chart_co_solo = [];
    this.setPoint_qc = 0;
    this.setPoint_qs = 0;
    this.setPoint_co = 0;
    this.setPoint_sl = 0;

  this.createHouseDataSet();

  this.getAllSetPoints();  
  
  }

  createHouseDataSet(){
    this.houseDataSet.push({name:"LedPower",dataSet:[]})
    this.houseDataSet.push({name:"LdrValue",dataSet:[]})


    this.houseDataSet[0].dataSet.push({name:"ledPower_qc",dataSet:[]})
    this.houseDataSet[0].dataSet.push({name:"ledPower_qs",dataSet:[]})
    this.houseDataSet[0].dataSet.push({name:"ledPower_co",dataSet:[]})
    this.houseDataSet[0].dataSet.push({name:"ledPower_sl",dataSet:[]})
    
    let s = [];
    let s1 = [];
    let s2 = [];
    s = this.createSetpointArr(s,this.defaultSetPoint,this.larguraGrafo);
    s2 = this.createSetpointArr(s2,this.defaultSetPoint*1.05,this.larguraGrafo);
    s1 = this.createSetpointArr(s1,this.defaultSetPoint*0.95,this.larguraGrafo);
    
    this.houseDataSet[1].dataSet.push({name:"ldrValor_qc",setPoint:s,minPoint:s1,maxPoint:s2,dataSet:[]})
    this.houseDataSet[1].dataSet.push({name:"ldrValor_qs",setPoint:s,minPoint:s1,maxPoint:s2,dataSet:[]})
    this.houseDataSet[1].dataSet.push({name:"ldrValor_co",setPoint:s,minPoint:s1,maxPoint:s2,dataSet:[]})
    this.houseDataSet[1].dataSet.push({name:"ldrValor_sl",setPoint:s,minPoint:s1,maxPoint:s2,dataSet:[]})
  }
  createSetpointArr(arr,set,tam){

    arr = [];
    for(let i = 0; i < tam; i++){
      arr[i] = set;
    }
    return arr;
  }

  addSetpoint(){

    this.setPoint_qc;
    this.setPoint_qs;
    this.setPoint_co;
    this.setPoint_sl;

    let vMax = (1 + this.variacao);
    let vMin = (1 - this.variacao);
    
    this.houseDataSet[1].dataSet[0].setPoint.push(this.setPoint_qc);
    this.houseDataSet[1].dataSet[1].setPoint.push(this.setPoint_qs);
    this.houseDataSet[1].dataSet[2].setPoint.push(this.setPoint_co);
    this.houseDataSet[1].dataSet[3].setPoint.push(this.setPoint_sl);

    this.houseDataSet[1].dataSet[0].minPoint.push(this.setPoint_qc*vMin);
    this.houseDataSet[1].dataSet[1].minPoint.push(this.setPoint_qs*vMin);
    this.houseDataSet[1].dataSet[2].minPoint.push(this.setPoint_co*vMin);
    this.houseDataSet[1].dataSet[3].minPoint.push(this.setPoint_sl*vMin);

    this.houseDataSet[1].dataSet[0].maxPoint.push(this.setPoint_qc*vMax);
    this.houseDataSet[1].dataSet[1].maxPoint.push(this.setPoint_qs*vMax);
    this.houseDataSet[1].dataSet[2].maxPoint.push(this.setPoint_co*vMax);
    this.houseDataSet[1].dataSet[3].maxPoint.push(this.setPoint_sl*vMax);


    console.log("adicionando");
  }

  removeSetpoint(){
    console.log("Removendo");
    this.houseDataSet[1].dataSet[0].setPoint.pop();
    this.houseDataSet[1].dataSet[1].setPoint.pop();
    this.houseDataSet[1].dataSet[2].setPoint.pop();
    this.houseDataSet[1].dataSet[3].setPoint.pop();

    this.houseDataSet[1].dataSet[0].minPoint.pop();
    this.houseDataSet[1].dataSet[1].minPoint.pop();
    this.houseDataSet[1].dataSet[2].minPoint.pop();
    this.houseDataSet[1].dataSet[3].minPoint.pop();

    this.houseDataSet[1].dataSet[0].maxPoint.pop();
    this.houseDataSet[1].dataSet[1].maxPoint.pop();
    this.houseDataSet[1].dataSet[2].maxPoint.pop();
    this.houseDataSet[1].dataSet[3].maxPoint.pop();
  }


  atualizaSetPoint(){

    let vMax = (1 + this.variacao);
    let vMin = (1 - this.variacao);
    let qc = 0;
    let qs = 0;
    let co = 0;
    let sl = 0;
    try{
       qc = this.convertToLms(parseInt(this.setPoints['setPoint_qc'].data));
       qs = this.convertToLms(parseInt(this.setPoints['setPoint_qs'].data));
       co = this.convertToLms(parseInt(this.setPoints['setPoint_co'].data));
       sl = this.convertToLms(parseInt(this.setPoints['setPoint_sl'].data));
    
    }
    catch{

    }
   
    let qc_ar = [];
    let qs_ar = [];
    let co_ar = [];
    let sl_ar = [];

    let cond = false;

    if(this.taxaAtual != this.variacao){
      cond = true;
      this.taxaAtual = this.variacao;
    }
    
    if(cond || this.setPoint_qc == 0 && this.setPoint_qs == 0 && this.setPoint_co == 0 && this.setPoint_sl == 0){
        this.setPoint_qc = qc;
        this.setPoint_qs = qs;
        this.setPoint_co = co;
        this.setPoint_sl = sl;

        qc_ar = this.createSetpointArr(qc_ar,qc,this.larguraGrafo);
        qs_ar = this.createSetpointArr(qs_ar,qs,this.larguraGrafo);
        co_ar = this.createSetpointArr(co_ar,co,this.larguraGrafo);
        sl_ar = this.createSetpointArr(sl_ar,sl,this.larguraGrafo);

        this.houseDataSet[1].dataSet[0].setPoint = qc_ar;
        this.houseDataSet[1].dataSet[1].setPoint = qs_ar;
        this.houseDataSet[1].dataSet[2].setPoint = co_ar;
        this.houseDataSet[1].dataSet[3].setPoint = sl_ar;

        qc_ar = this.createSetpointArr(qc_ar,qc*vMin,this.larguraGrafo);
        qs_ar = this.createSetpointArr(qs_ar,qs*vMin,this.larguraGrafo);
        co_ar = this.createSetpointArr(co_ar,co*vMin,this.larguraGrafo);
        sl_ar = this.createSetpointArr(sl_ar,sl*vMin,this.larguraGrafo);

        this.houseDataSet[1].dataSet[0].minPoint = qc_ar;
        this.houseDataSet[1].dataSet[1].minPoint = qs_ar;
        this.houseDataSet[1].dataSet[2].minPoint = co_ar;
        this.houseDataSet[1].dataSet[3].minPoint = sl_ar;


        qc_ar = this.createSetpointArr(qc_ar,qc*vMax,this.larguraGrafo);
        qs_ar = this.createSetpointArr(qs_ar,qs*vMax,this.larguraGrafo);
        co_ar = this.createSetpointArr(co_ar,co*vMax,this.larguraGrafo);
        sl_ar = this.createSetpointArr(sl_ar,sl*vMax,this.larguraGrafo);

        this.houseDataSet[1].dataSet[0].maxPoint = qc_ar;
        this.houseDataSet[1].dataSet[1].maxPoint = qs_ar;
        this.houseDataSet[1].dataSet[2].maxPoint = co_ar;
        this.houseDataSet[1].dataSet[3].maxPoint = sl_ar;

    }

    if(this.setPoint_qc != qc){
      this.setPoint_qc = qc;
      qc_ar = this.createSetpointArr(qc_ar,qc,this.larguraGrafo);
      this.houseDataSet[1].dataSet[0].setPoint = qc_ar;
      qc_ar = this.createSetpointArr(qc_ar,qc*vMin,this.larguraGrafo);
      this.houseDataSet[1].dataSet[0].minPoint = qc_ar;
      qc_ar = this.createSetpointArr(qc_ar,qc*vMax,this.larguraGrafo);
      this.houseDataSet[1].dataSet[0].maxPoint = qc_ar;
    }
    if(this.setPoint_qs != qs){
      this.setPoint_qs = qs;
      qc_ar = this.createSetpointArr(qc_ar,qs,this.larguraGrafo);
      this.houseDataSet[1].dataSet[1].setPoint = qc_ar;
      qc_ar = this.createSetpointArr(qc_ar,qs*vMin,this.larguraGrafo);
      this.houseDataSet[1].dataSet[1].minPoint = qc_ar;
      qc_ar = this.createSetpointArr(qc_ar,qs*vMax,this.larguraGrafo);
      this.houseDataSet[1].dataSet[1].maxPoint = qc_ar;
        
        
    }
    if(this.setPoint_co != co){
      this.setPoint_co = co;
      qc_ar = this.createSetpointArr(qc_ar,co,this.larguraGrafo);
      this.houseDataSet[1].dataSet[2].setPoint = qc_ar;
      qc_ar = this.createSetpointArr(qc_ar,co*vMin,this.larguraGrafo);
      this.houseDataSet[1].dataSet[2].minPoint = qc_ar;
      qc_ar = this.createSetpointArr(qc_ar,co*vMax,this.larguraGrafo);
      this.houseDataSet[1].dataSet[2].maxPoint = qc_ar;
            
    }
    if(this.setPoint_sl != sl){
      this.setPoint_sl = sl;
      qc_ar = this.createSetpointArr(qc_ar,sl,this.larguraGrafo);
      this.houseDataSet[1].dataSet[3].setPoint = qc_ar;
      qc_ar = this.createSetpointArr(qc_ar,sl*vMin,this.larguraGrafo);
      this.houseDataSet[1].dataSet[3].minPoint = qc_ar;
      qc_ar = this.createSetpointArr(qc_ar,sl*vMax,this.larguraGrafo);
      this.houseDataSet[1].dataSet[3].maxPoint = qc_ar;
    }

  }

  async houseMonitor() {
    let t = 0;
    let tempoTotal;
    while (!this.arduinoError) {
      const value =  await this.resolveAfterXSeconds(this.frequenciaAtualizacaodeDaods) as number;

  
      t++;
      tempoTotal = t* this.frequenciaAtualizacaodeDaods;
      this.countStartchart++;
      if(this.countStartchart > 1*this.frequenciaAtualizacaodeDaods){
        this.printCharts();
      }
     
      
      if(tempoTotal%120==0){
        //this.limpaMemoria();
      }

      if(this.houseDataSet[1].dataSet[0].setPoint.length < this.larguraGrafo){
        this.addSetpoint();
      }
      if(this.houseDataSet[1].dataSet[0].setPoint.length > this.larguraGrafo){
        this.removeSetpoint();
      }
      if(tempoTotal%1==0){
        this.arduinoMsg = '';
        this.getAllSetPoints();
        this.atualizaSetPoint();

      }
      for(let h in this.houseDataSet){
        for(let d in this.houseDataSet[h].dataSet){
          this.getHouseData(this.houseDataSet[h].dataSet[d].name,h,d);
        }    
      }
        let d = new Date();
        let tm = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        this.timeDataSet.push(tm);
        if(this.timeDataSet.length > this.larguraGrafo){
          this.timeDataSet = this.timeDataSet.slice(1 ,this.larguraGrafo+1);
        }
       
    }
  }

  async onClickConfirm(){
    console.log("Send cmd to arduino");

    if(this.setPointqc != this.setPoint_qc && this.setPointqc != undefined){
      const value =  await this.resolveAfterXSeconds(2) as number;
      this.sendCmdToArduino('setPoint_qc:'+this.convertToMv(this.setPointqc));
      this.setPoint_qc = this.setPointqc;
    }
    if(this.setPointqs != this.setPoint_qs && this.setPointqs != undefined){
      const value =  await this.resolveAfterXSeconds(2) as number;
      this.sendCmdToArduino('setPoint_qs:'+this.convertToMv(this.setPointqs));
      this.setPoint_qs = this.setPointqs;
    }
    if(this.setPointco != this.setPoint_co && this.setPointco != undefined){
      const value =  await this.resolveAfterXSeconds(2) as number;
      this.sendCmdToArduino('setPoint_co:'+this.convertToMv(this.setPointco));
      this.setPoint_co = this.setPointco;
    }
    if(this.setPointsl != this.setPoint_sl && this.setPointsl != undefined){
      const value =  await this.resolveAfterXSeconds(2) as number;
      this.sendCmdToArduino('setPoint_sl:'+this.convertToMv(this.setPointsl));
      this.setPoint_sl = this.setPointsl;
    }
  }
  onClickConfirmFaixa(){
      if(this.sensorPrecision > 0 && this.sensorPrecision!= this.sensorPrecisionOld){
        this.sensorPrecisionOld = this.sensorPrecision;
        
        this.sendCmdToArduino('amostras:'+this.sensorPrecision);
    
      }
      if(this.variacao >= 0 && this.variacao != this.variacaoOld){
        this.variacaoOld = this.variacao;
        this.sendCmdToArduino('variacao:'+this.variacao.toString().trim());
      }
  }

  getSetPoint(key){
    return this.arduinoService.getData(key).subscribe(
      (data) => {
        this.setPoints[key] = data;
       
       },
       err => console.error('Observer got an error: ' + err),
       () => {
        
       }
      );
  }
  getHouseData(key,h,d){
    return this.arduinoService.getData(key).subscribe(
      (data) => {
        this.medidasValues[key] = data;
       
       },
       err => console.error('Observer got an error: ' + err),
       () => {
        if(h == 1){
          this.houseDataSet[h].dataSet[d].dataSet.push(this.convertToLms(this.medidasValues[key].data));  
        }else{
          this.houseDataSet[h].dataSet[d].dataSet.push(this.medidasValues[key].data);
        } 
        if(this.houseDataSet[h].dataSet[d].dataSet.length > this.larguraGrafo){
          this.houseDataSet[h].dataSet[d].dataSet = this.houseDataSet[h].dataSet[d].dataSet.slice(1,this.larguraGrafo+1);
        }
        

        

        
       }
      );
  }

  sendCmdToArduino(cmd){
    console.log(cmd);
    return this.arduinoService.sendCmdToArduino(cmd).subscribe(
      (data:any) => {
        
       },
       err => {
       
        },
       () => {
        console.log("Test");
       });;
  }

  printCharts(){
    if(this.activeTab == 0){
    
    
      this.createChart(
        this.canvas_qc.nativeElement.getContext('2d'),
        this.timeDataSet,
        this.houseDataSet[1].dataSet[0].dataSet,
        this.houseDataSet[1].dataSet[0].setPoint,
        this.houseDataSet[1].dataSet[0].minPoint,
        this.houseDataSet[1].dataSet[0].maxPoint
        );
        this.createChart(
          this.canvas_qs.nativeElement.getContext('2d'),
          this.timeDataSet,
          this.houseDataSet[1].dataSet[1].dataSet,
          this.houseDataSet[1].dataSet[1].setPoint,
          this.houseDataSet[1].dataSet[1].minPoint,
          this.houseDataSet[1].dataSet[1].maxPoint
        );
        
        this.createChart(
          this.canvas_co.nativeElement.getContext('2d'),
          this.timeDataSet,
          this.houseDataSet[1].dataSet[2].dataSet,
          this.houseDataSet[1].dataSet[2].setPoint,
          this.houseDataSet[1].dataSet[2].minPoint,
          this.houseDataSet[1].dataSet[2].maxPoint
        );
        this.createChart(
          this.canvas_sl.nativeElement.getContext('2d'),
          this.timeDataSet,
          this.houseDataSet[1].dataSet[3].dataSet,
          this.houseDataSet[1].dataSet[3].setPoint,
          this.houseDataSet[1].dataSet[3].minPoint,
          this.houseDataSet[1].dataSet[3].maxPoint
        );
    }
    if(this.activeTab == 1){
      
      this.createChart(
        this.canvas_qc_solo.nativeElement.getContext('2d'),
        this.timeDataSet,
        this.houseDataSet[1].dataSet[0].dataSet,
        this.houseDataSet[1].dataSet[0].setPoint,
        this.houseDataSet[1].dataSet[0].minPoint,
        this.houseDataSet[1].dataSet[0].maxPoint
        );
    }
    if(this.activeTab == 2){
     
      this.createChart(
        this.canvas_qs_solo.nativeElement.getContext('2d'),
        this.timeDataSet,
        this.houseDataSet[1].dataSet[1].dataSet,
        this.houseDataSet[1].dataSet[1].setPoint,
        this.houseDataSet[1].dataSet[1].minPoint,
        this.houseDataSet[1].dataSet[1].maxPoint
      );
    }
    if(this.activeTab == 3){
      this.createChart(
        this.canvas_co_solo.nativeElement.getContext('2d'),
        this.timeDataSet,
        this.houseDataSet[1].dataSet[2].dataSet,
        this.houseDataSet[1].dataSet[2].setPoint,
        this.houseDataSet[1].dataSet[2].minPoint,
        this.houseDataSet[1].dataSet[2].maxPoint
      );
  
     
    }
    if(this.activeTab == 4){
      this.createChart(
        this.canvas_sl_solo.nativeElement.getContext('2d'),
        this.timeDataSet,
        this.houseDataSet[1].dataSet[3].dataSet,
        this.houseDataSet[1].dataSet[3].setPoint,
        this.houseDataSet[1].dataSet[3].minPoint,
        this.houseDataSet[1].dataSet[3].maxPoint
      );
     
    }
  }



  ngAfterViewInit(){
    
  }
  createChart(ctx,x,y,setPoint,minPoint,maxPoint){
  
    this.chart_qc = new Chart(ctx,{ 
      type:'line',
      data:{
        labels:x,
        datasets:[
          {
            data:y ,
            borderColor: '#aabbff',
            fill: false
          },
          {
            data:setPoint ,
            borderColor: '#00ff00',
            fill: false
          },
          {
            data:minPoint ,
            borderColor: '#ffdd00',
            fill: false
          },
          {
            data:maxPoint ,
            borderColor: '#ff2200',
            fill: false
          },
        ]
      },
      options:{
        events: ['click'],
        animation: {
          duration: 0,
        },
        legend:{
          display:false
        },
        scales:{
          xAxes:[{
            display:true 
          }],
          yAxes:[{
            display:true
          }]
        }
      }
    
    
    });
  }
  cadastrarMedida(){

    console.log(this.cadastroMedida.medida);
    console.log(this.cadastroMedida.tabTitle);
    console.log(this.cadastroMedida.title);
    console.log(this.cadastroMedida.unidade);
    this.addMedida();
    alert("Medida cadastrada com sucesso!");
  }

  createMedidaValues(){
    for(let l of this.medidasLabels){
      this.medidasValues[l.medida] = 0;
    }
    this.showPainel = true;
  }

  createTabs() {

    this.key['balanca'] = 0;
    this.key['angulo'] = 1;
    this.key['detalhes'] = 2;

    this.tabs.push({
      key:   'balanca',
      isActive: true
    });
    this.tabs.push({
      key:   'angulo',
      isActive: true
    });
    this.tabs.push({
      key:   'detalhes',
      isActive: true
    });
  }

  onClickTab($event) {

    this.activeTab = $event.index;
    console.log(this.activeTab);
    this.createHouseDataSet();
    this.chart_qc = [];
    this.chart_qs = [];
    this.chart_sl = [];
    this.chart_co = [];
    this.countStartchart = 0;
    

  }
  onArduinoSelectChange(comName){
    this.arduinoService.setComPort(comName).subscribe(
      (data:any) => {
        this.arduinoMsg = data.msg + " " + data.comPort;
        this.porta = data.comPort;
        this.arduinoError = false;
        this.houseMonitor();
       },
       err => {
         this.arduinoError = true; 
         this.arduinoMsg = err.error.message 
        },
       () => {
        this.getMedidas();
       });
  }

  resolveAfterXSeconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, x * 1000);
    });
  }

  getMedidas() {
    console.log('getMedidas');
    return this.arduinoService.getMedidas().subscribe(
      (data) => {
        this.medidasLabels = data;
        this.houseMonitor();
        this.arduinoMsg = "Arduino conected";
       },
       err => {
         console.log(err.error.message); 
         this.arduinoError = true; 
         this.arduinoMsg = err.error.message 
        },
       () => {
        this.createMedidaValues();
       });
  }

  getDevices() {
    console.log('getDevices');
    return this.arduinoService.getDevices().subscribe(
      (data) => {
        this.devices = data;
       },
       err => console.error('Observer got an error: ' + err),
       () => this.createMedidaValues());
  }


  addMedida(){
    return this.arduinoService.addMedida(this.cadastroMedida).subscribe(
      (data) => {
       },
       err => console.error('Observer got an error: ' + err),
       () => this.getMedidas()
        );
  }





}
