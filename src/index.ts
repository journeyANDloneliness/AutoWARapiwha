import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import  http from 'http';

const app = express()


app.use(cors())
const port = 3000

import Database from "@replit/database"
const db = new Database()


let serverBerjalan=false

let toResolve=[]
let toResolve2=(a)=>{}
let resolveJawabPesan={}
let kirimkanPesanIntern=()=>{}
export const jalankanServer=async ()=>{
  app.use(bodyParser.json());
app.post('/', async function(req, res) {
    console.log(req.body)
    let dataJson =  req.body
    toResolve.forEach((v,i)=>{
      if(dataJson.chat.id == v.nomer || !v.nomer)
      v.resolve({pesan:dataJson.text,dari:dataJson.from, ke:dataJson.to,
                                  database:db, ...dataJson })
    })
    toResolve = toResolve.filter(v=>v.nomer != dataJson.chat.id && v.nomer)
    let abaikan=false
    let reaksi=false
    let repl=await new Promise(function(resolve){
      resolveJawabPesan[dataJson.chat.id]=(msg, b,c)=>{
        abaikan=false
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
		let server
    /* let server=app.listen(port, () => {
      // Code.....
      serverBerjalan=true
    })*/

	return{server,app}

}
export const expressApp = jalankanServer()
export const dapatkanPesan=async (nomer)=>{
  //if(!serverBerjalan) await jalankanServer()
  return new Promise((resolve)=>{
    toResolve.push({resolve,nomer})
  })
}
export const jawabPesan = async(pesan, opsi,nomor)=>{
  //if(!serverBerjalan)await jalankanServer()
  resolveJawabPesan[nomor]?.({pesan,opsi})
}
export const reaksiPesan = async(pesan,opsi, nomor)=>{
  //if(!serverBerjalan)await jalankanServer()
  resolveJawabPesan[nomor]?.({pesan,opsi},false,true)
}

export const abaikanPesan = async(pesan, opsi, nomor)=>{
  //if(!serverBerjalan)await jalankanServer()
  resolveJawabPesan[nomor]?.({pesan, opsi}, true)
}

export const kirimkanPesan= async (kepada,pesan, opsi)=>{
  if(!socketBerjalan)await runSocket()
  
  let msg=JSON.stringify({kepada,pesan, abaikan:false,opsi})
  ws.send(msg);
  
}