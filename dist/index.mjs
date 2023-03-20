import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import WebSocket from 'ws';
import http from 'http';
import Database from '@replit/database';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const app = express();
let ws = null;
let socketBerjalan = false;
const runSocket = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });
    socketBerjalan = true;
    yield wss.on('connection', (w) => {
        console.log('Client connected');
        ws = w;
        w.send('anda terhubung dengan server!'); // send a message to the client
    });
});
app.use(cors());
const port = 3000;
const db = new Database();
//app.use(bodyParser.text());
const index = (toDo) => {
    app.post('/', function (req, res) {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => __awaiter(this, void 0, void 0, function* () {
            var decodedData = decodeURIComponent(data.replaceAll("+", " "));
            let dataJson = JSON.parse(decodedData.slice(5));
            console.log(dataJson);
            if (dataJson.event === "INBOX") {
                let response = { autoreply: "" };
                response.autoreply = toDo({ pesan: dataJson.text, dari: dataJson.from, ke: dataJson.to,
                    database: db });
                res.json(response);
            }
        }));
    });
    app.listen(port, () => {
        // Code.....
    });
};
const AutoWA2 = (toDo) => {
    app.use(bodyParser.json());
    app.post('/', function (req, res) {
        console.log(req.body);
        let dataJson = req.body;
        if (dataJson.event === "INBOX") {
            let response = { autoreply: { pesan: "" } };
            response.autoreply.pesan = toDo({ pesan: dataJson.text, dari: dataJson.from, ke: dataJson.to,
                database: db });
            res.json(response);
        }
    });
    app.listen(port, () => {
        // Code.....
    });
};
let toResolve = [];
let resolveJawabPesan = (a, b = false, c = false) => { };
const jalankanServer = () => __awaiter(void 0, void 0, void 0, function* () {
    app.use(bodyParser.json());
    app.post('/', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            let dataJson = req.body;
            toResolve.forEach((v, i) => {
                if (dataJson.contact.number == v.nomer || !v.nomer)
                    v.resolve(Object.assign({ pesan: dataJson.text, dari: dataJson.from, ke: dataJson.to, database: db }, dataJson));
            });
            toResolve = toResolve.filter(v => v.nomer != dataJson.contact.number && v.nomer);
            let abaikan = false;
            let reaksi = false;
            let repl = yield new Promise(function (resolve) {
                resolveJawabPesan = (msg, b, c) => {
                    abaikan = b;
                    reaksi = c;
                    resolve(msg);
                };
                setTimeout(() => {
                    abaikan = true;
                    resolve({ pesan: "waktu habis untuk memperoses pesan ini!" });
                }, 20000);
            });
            res.json({ autoreply: repl, abaikan, reaksi });
        });
    });
    return app.listen(port, () => {
    });
});
jalankanServer();
const dapatkanPesan = (nomer) => __awaiter(void 0, void 0, void 0, function* () {
    //if(!serverBerjalan) await jalankanServer()
    return new Promise((resolve) => {
        toResolve.push({ resolve, nomer });
    });
});
const jawabPesan = (pesan, opsi) => __awaiter(void 0, void 0, void 0, function* () {
    //if(!serverBerjalan)await jalankanServer()
    resolveJawabPesan({ pesan, opsi });
});
const reaksiPesan = (pesan, opsi) => __awaiter(void 0, void 0, void 0, function* () {
    //if(!serverBerjalan)await jalankanServer()
    resolveJawabPesan({ pesan, opsi }, false, true);
});
const abaikanPesan = (pesan, opsi) => __awaiter(void 0, void 0, void 0, function* () {
    //if(!serverBerjalan)await jalankanServer()
    resolveJawabPesan({ pesan, opsi }, true);
});
const kirimkanPesan = (kepada, pesan, opsi) => __awaiter(void 0, void 0, void 0, function* () {
    if (!socketBerjalan)
        yield runSocket();
    let msg = JSON.stringify({ kepada, pesan, abaikan: false, opsi });
    ws.send(msg);
});

export { AutoWA2, abaikanPesan, dapatkanPesan, index as default, jalankanServer, jawabPesan, kirimkanPesan, reaksiPesan, runSocket };
