import * as http from 'http';
import * as migrations from "./data-access/migrations.mjs"
import { router } from './routes/api.mjs';
import { parseCookie } from './server-core/common.mjs';
import {config} from "dotenv"
import { redisClient } from './server-core/redis.mjs';

config({quiet: true});
const PORT = 9090
const HOST = "localhost"
const server = http.createServer();


migrations.migrate();
server.on('request', (req, res) => {
    console.log(`${new Date().toLocaleString()}    HTTP ${req.method} ${req.url}`);
    const cookies = parseCookie(req);
    const method = req.method;
    const {found, handler, pattern_result} =  router.match(method as any, req.url as string)
    if(!found) console.log('using default handler');
    const handlerInfo = {
        pattern_result,
        cookies,
    };
    handler(req, res, handlerInfo);
});

server.on('error', (err) => {
    console.log(err)
});

server.listen(PORT, HOST, 10, ()=> {
    console.log(`Listening on http://${HOST}:${PORT}...`)
});






