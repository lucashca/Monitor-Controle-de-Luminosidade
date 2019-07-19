const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');
const low = require ( "lowdb" );
const FileSync = require ( 'lowdb/adapters/FileSync' );
const  express  = require ( 'express' );
const  bodyParser  = require ( 'body-parser' );
const math = require('math');

const app = express();
const serialFrequency = 9600
const adapter = new FileSync('db.json');
const db = low(adapter);


var deviceConected = false;
//  analisar o aplicativo / x-www-form-urlencoded
app.use (bodyParser.urlencoded ({extended : false }));
//  analisar o aplicativo / json
app.use (bodyParser.json());



db.defaults({ dados: []})
  .write()


var data = new Map();
var devices = [];
var serial;
var parser;

function getConnectedArduinoDevices(){
  SerialPort.list(function(err, ports) {
    console.log(ports);
    let cont = 0;
    ports.forEach((port)=>{
      let manufacturer = port['manufacturer'];
      let comName = '';
      if(typeof manufacturer !== 'undefined' && manufacturer.includes('arduino')){
        comName= port.comName.toString();
        devices.push({comName:comName,manufacturer:manufacturer})
        console.log(devices);
        cont += 1;
      }
    })
    if(cont > 0 ){
      console.log("Found ",cont," devices!")
    }else{
      console.log("Can't find arduino device!");
    }
  })
}



function setData(dados){
  if(dados.toString()!=""){
      let str = dados.split(":");
      let key = str[0];
      let dado = str[1];
      data.set(key,dado);
  }
     
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
getConnectedArduinoDevices();

function conectToArduino(comPort){


  serial = new SerialPort(comPort,{
    baudRate: serialFrequency,
  });
  
  parser = serial.pipe(new Readline({ delimiter: '\n' }));
  
  serial.on('open',()=>{''
      console.log("Conexão aberta");
      deviceConected = true;
  });
  
  parser.on('data', data =>{
    setData(data);
  });
  
  
}



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', function (req, res) {
  res.send('Hello World!');
  

});


app.post('/getMedidas', function (req, res) {
  console.log("getMedidas is requested!")
  let medidas = db.get('dados').value()
  
  if(deviceConected){
    res.send(medidas);
  }else{
    res.status(400).send({
    message: 'Arduino not conected!'
   });
  }
});

app.get('/getLdr', function (req, res) {
  console.log("getLdr is requested");
  let a = getRandomInt(0,1024);
  res.send(""+a);
});

app.post('/getDevices', function (req, res) {
  console.log("getDevices is requested!")
  console.log("Devices ",devices);
  
  res.send(devices);
});


app.post('/sendCmdToArduino', function (req, res) {
  console.log("sendCmdToArduino is requested!")
  cmd = req.body.cmd;
  console.log(cmd);
  serial.write(cmd,function(err, results) {
    console.log("Erro"+err);
    console.log("Acerto"+results);

  });
});

app.post('/setComPort', function (req, res) {
  console.log("setComPort is requested!")
  console.log(req.body.comPort)
  comPort = req.body.comPort
  console.log(comPort)
  
  conectToArduino(comPort);
  msg = "Arduino conected in ",comPort;
  res.send({msg:msg, comPort:comPort});
});

app.post('/getData', function (req, res) {
  key = req.body.key
  dado = data.get(key);
  console.log("Enviando :" ,{ key: key, data: dado});
  if(key == 'ldr'){
    res.send({data: getRandomInt(0,1023)});
  }else{      
    res.send({data: dado});
      
  }
  });


app.post('/balanca', function (req, res) {
  console.log("getMedidas is requested!")
  let medidas = db.get('dados').value()
  res.send(medidas);
});


app.post('/addMedidas', function (req, res) {
 
  medida = req.body.medida
  title = req.body.title
  unidade = req.body.unidade
  
  console.log("Adicionando medida:" ,{ medida: medida, title: title,unidade:unidade});

  db.get('dados')
  .push({ medida: medida, title: title,unidade:unidade})
  .write()
  res.send({ medida: medida, title: title,unidade:unidade});
  
});



app.listen(3000, function () {
  console.log('Server is lissting on port 3000');
});




