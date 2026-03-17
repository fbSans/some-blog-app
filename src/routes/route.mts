import {FAVICON_PATH, loadFileAsBuffer, allowed_extensions, NR_ROUTE_ITEM, IsTextFormat} from "../core/common.mjs"
import {makeRouter} from "../core/router.mjs"
import * as counts from "../dao/counts.mjs"
import * as database from "../core/database.mjs"
import { IncomingMessage, ServerResponse } from "http";

export const router = makeRouter();
const db = database.get_db();

function serveIndexHTML(res: ServerResponse<IncomingMessage>){
    loadFileAsBuffer("index.html").then((v) => {
         if(v.status){
             res.writeHead(200, {
                 "content-type": allowed_extensions[".html"]
             }).end(v.buffer)
         } else {
             res.writeHead(500).end();
         }
    })
}

router.get('/', (_req, res)=>{
    serveIndexHTML(res);
});

router.get('/number/:number', (req, res, info) => {
    counts.incr_item_count(db, NR_ROUTE_ITEM);
    const visit_count = counts.get_item_count(db, NR_ROUTE_ITEM)
    const number = Number(info.pattern_result?.pathname.groups["number"] as string);
    res.write(`
        <html>
            <head>
                <title>Visit with number ${number}</title>
                <link rel="stylesheet" href="/index.css" type="text/css">
            </head>
            <body>
                <h1>Something of a test</h1>
                <h2>Some stupid poem</h2>
                <p class="poem">${number} was sent</p>
                <p class="poem">${number} was recieved</p>
                <p class="poem">${number} is ${number % 2 == 0 ? 'even': 'odd'}</p>
                <p class="poem">But ${number} x 3 = ${number * 3}, which is odd if you think about it</p>
                <p class="poem">This route was used <span class="count">${visit_count}</span> ${visit_count === 1 ? "time":"times"}, we watching you!</p>
                <p><strong>The end</strong></p>
            </body>
        </html>
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
        if(v.status){
            res.writeHead(200, {
                "content-type": v.content_type,
            });
            if(IsTextFormat(v.content_type)){
                res.write(v.buffer.toString());
            } else {
                res.write(v.buffer);
            }
        }else {
            console.log(v.message)
            res.writeHead(404);
        }
    }).catch((err) => {
        console.log(err)
    }).finally(()=> {
        res.end();
    });
})

//Need this to authenticate
//TODO: Learn how to read form data
router.post('/login', (req, res) => {

    serveIndexHTML(res);
})

//Then managing the posts





