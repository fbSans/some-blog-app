import * as http from 'http';
import {FAVICON_PATH, loadFileAsBuffer, allowed_extensions} from "./common.mjs"
import {makeRouter} from "./router.mjs"

const PORT = 9090
const HOST = "localhost"
const server = http.createServer();

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
})

router.get('/favicon.ico', (req, res) => {
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
router.get(".*", (req, res) => {
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
    const {found, handler} =  router.match(method as any, req.url as string)
    if(!found) console.log('using default handler');
    handler(req, res);
});

server.on('error', (err) => {
    console.log(err)
});

server.listen(PORT, HOST, 10, ()=> {
    console.log(`Listening on ${HOST}:${PORT}...`)
});






