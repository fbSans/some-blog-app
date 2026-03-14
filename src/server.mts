import * as http from 'http';
import {FAVICON_PATH, loadFileAsBuffer, allowed_extensions, NR_ROUTE_ITEM} from "./common.mjs"
import {makeRouter} from "./router.mjs"
import * as database from "./database.mjs"

const PORT = 9090
const HOST = "localhost"
const server = http.createServer();

database.migrate();
const db = database.get_db();

const router = makeRouter();

router.get('/', (_req, res)=>{
    loadFileAsBuffer("index.html").then((v) => {
         if(v.status){
             res.writeHead(200, {
                 "content-type": allowed_extensions[".html"]
             }).end(v.buffer)
         } else {
             res.writeHead(500).end();
         }
    })
});

router.get('/number/:number', (req, res, info) => {
    database.incr_item_count(db, NR_ROUTE_ITEM);
    const visit_count = database.get_item_count(db, NR_ROUTE_ITEM)
    const number = Number(info.pattern_result?.pathname.groups["number"] as string);
    res.write(`
        <h1>Something of a test</h1>
        <h2>Some stupid poem</h2>
        <p>${number} was sent</p>
        <p>${number} was recieved</p>
        <p>${number} is ${number % 2 == 0 ? 'even': 'odd'}</p>
        <p>But ${number} x 3 = ${number * 3}, which is odd if you think about it</p>
        <p>This route was used ${visit_count} ${visit_count === 1 ? "time":"times"}, we watching you!</p>
        <p><strong>The end</strong></p>
    `);
    res.end();
});

router.get('/favicon.ico', (_req, res) => {
    loadFileAsBuffer(FAVICON_PATH).then((v) => {
        if(v.status){
            res.writeHead(200, {"content-type": "image/png"})
            res.write(v.buffer);
        } else {
            res.writeHead(500)
        }
    }).catch((err) => {
        // console.log(`Error: ${err}`);
    }).finally(()=>{
        res.end();
    });          
})

// File Handling is the default behavior
/*path is allways normalized inside */
router.get("/.*", (req, res) => {
    if(!req.url){ return res.writeHead(400).end()}
    loadFileAsBuffer(req.url)
    .then((v) => {
        res.writeHead(200, {
            "content-type": v.content_type,
        });
        res.write(v.buffer.toString());
        console.log(v.content_type);
    }).catch((err) => {
        console.error(err);
    }).finally(()=> {
        res.end();
    });
})


server.on('request', (req, res) => {
    console.log(`${new Date().toLocaleString()}    HTTP ${req.method} ${req.url}`);
    const method = req.method;
    const {found, handler, pattern_result} =  router.match(method as any, req.url as string)
    if(!found) console.log('using default handler');
    const handlerInfo = {
        pattern_result,
    };
    handler(req, res, handlerInfo);
});

server.on('error', (err) => {
    console.log(err)
});

server.listen(PORT, HOST, 10, ()=> {
    console.log(`Listening on http://${HOST}:${PORT}...`)
});






