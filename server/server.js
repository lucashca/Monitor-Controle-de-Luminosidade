const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');
const http = require("http");
const fs = require('fs');

const hostname = "localhost"
const port = 8000

const serialFrequency = 9600

const serial = new SerialPort("COM3",{
    baudRate: serialFrequency,
});

const parser = serial.pipe(new Readline({ delimiter: '\n' }));


var dataBalanca = 0;
var dataAngulo = 0;



serial.on('open',()=>{''
    console.log("Conexão aberta");
});

function setData(data){
    if(data.toString()!=""){
        str = data.split(":");
        
        if(str[0] == "angulo"){dataAngulo = str[1]}
        if(str[0] == "massa"){
            dataBalanca = str[1];
            console.log("Balanca "+str[1]);
        
        }

    }
       
}


parser.on('data', data =>{
    console.log('Data from arduino:', data);
    setData(data);
});



function onRequest(request,response){
    if (request.url == "/balanca") {
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
        });
        console.log("balanca "+dataBalanca)
        response.end(dataBalanca)
    }
    if (request.url == "/angulo") {
        response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
        });
        response.end(dataAngulo)
    }

    
   
    
}

http.createServer(onRequest).listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}/`);
});


