import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import WebSocket from 'ws';
import  http from 'http';

const app = express()
let ws=null

let socketBerjalan=false
export const runSocket =async ()=>{
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });
  socketBerjalan = true
  await wss.on('connection', (w) => {
    
    console.log('Client connected');
    ws=w
    w.send('anda terhubung dengan server!'); // send a message to the client
  });
}

app.use(cors())
const port = 3000

import Database from "@replit/database"
const db = new Database()

//app.use(bodyParser.text());

export default (toDo)=>{
app.post('/', function(req, res) {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', async () => {
    
      var decodedData =
        decodeURIComponent(data.replaceAll("+"," "));
 
      let dataJson = JSON.parse(decodedData.slice(5));
      console.log(dataJson)
      if (dataJson.event==="INBOX"){
        let response = {autoreply:""}
        response.autoreply = toDo({pesan:dataJson.text,dari:dataJson.from, ke:dataJson.to,
                                  database:db})
        res.json(response)
      }
  
  })

  
});
      


app.listen(port, () => {
  // Code.....
})
}

export const AutoWA2 = (toDo)=>{
app.use(bodyParser.json());
app.post('/', function(req, res) {
    console.log(req.body)
    let dataJson =  req.body
      if (dataJson.event==="INBOX"){
        let response = {autoreply:{pesan:""}}
        response.autoreply.pesan = toDo({pesan:dataJson.text,dari:dataJson.from, ke:dataJson.to,
                                  database:db})
        res.json(response)
      }
  


  
});
  app.listen(port, () => {
  // Code.....
})

}
let serverBerjalan=false

let toResolve=[]
let toResolve2=(a)=>{}
let resolveJawabPesan=(a,b=false,c=false)=>{}
let kirimkanPesanIntern=()=>{}
export const jalankanServer=async ()=>{
  app.use(bodyParser.json());
app.post('/', async function(req, res) {
    console.log(req.body)
    let dataJson =  req.body
    toResolve.forEach((v,i)=>{
      if(dataJson.contact.number == v.nomer || !v.nomer)
      v.resolve({pesan:dataJson.text,dari:dataJson.from, ke:dataJson.to,
                                  database:db, ...dataJson })
    })
    toResolve = toResolve.filter(v=>v.nomer != dataJson.contact.number && v.nomer)
    let abaikan=false
    let reaksi=false
    let repl=await new Promise(function(resolve){
      resolveJawabPesan= (msg, b,c)=>{
        abaikan=b
        reaksi=c 
        resolve(msg)
      }
      setTimeout(()=>{
        abaikan=true
        resolve({pesan:"waktu habis untuk memperoses pesan ini!"})
      },20000)
    })
    res.json({autoreply: repl, abaikan, reaksi})
})
    return app.listen(port, () => {
      // Code.....
      serverBerjalan=true
    })

}
jalankanServer()
export const dapatkanPesan=async (nomer)=>{
  //if(!serverBerjalan) await jalankanServer()
  return new Promise((resolve)=>{
    toResolve.push({resolve,nomer})
  })
}
export const jawabPesan = async(pesan, opsi)=>{
  //if(!serverBerjalan)await jalankanServer()
  resolveJawabPesan({pesan,opsi})
}
export const reaksiPesan = async(pesan,opsi)=>{
  //if(!serverBerjalan)await jalankanServer()
  resolveJawabPesan({pesan,opsi},false,true)
}

export const abaikanPesan = async(pesan, opsi)=>{
  //if(!serverBerjalan)await jalankanServer()
  resolveJawabPesan({pesan, opsi}, true)
}

export const kirimkanPesan= async (kepada,pesan, opsi)=>{
  if(!socketBerjalan)await runSocket()
  
  let msg=JSON.stringify({kepada,pesan, abaikan:false,opsi})
  ws.send(msg);
  
}