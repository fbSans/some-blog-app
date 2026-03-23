import {FAVICON_PATH, loadFileAsBuffer, allowed_extensions, NR_ROUTE_ITEM, IsTextFormat, NAME_REGEX, EMAIL_REGEX, PASSWORD_REGEX, aggregateResult, checkSession} from "../server-core/common.mjs"
import {makeRouter} from "../server-core/router.mjs"
import * as counts from "../data-access/counts.mjs"
import * as user from "../data-access/user.mjs"
import * as post from "../data-access/post.mjs"
import * as database from "../server-core/database.mjs"
import { IncomingMessage, ServerResponse } from "http";
import { redisClient } from "../server-core/redis.mjs"
import * as crypto from "crypto";
import { json } from "stream/consumers"
import { User } from "../data-access/user.mjs"


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


//Need this to authenticate

router.post('/login', (req, res) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString(); // Convert buffer to string
    });


    req.on('end', async () => {;
        const parsedBody = JSON.parse(body);
        const email = parsedBody['email'] as string;
        const password = parsedBody['password'] as string;
        //Run validations
        const results: {[key: string]: any} = {};
        
        //Input validation
        if(!EMAIL_REGEX.test(email)) aggregateResult(results, 'error', 'invalid credentials') 
        if(!PASSWORD_REGEX.test(password)) aggregateResult(results, 'error', 'invalid credentials') 
        if(Object.getOwnPropertyNames(results).length > 0) {
            res.writeHead(400).end(JSON.stringify(results));
            return;
        }

        
        //Check DB
        const {result, message} = await user.check_pass(db, {email, password} as user.User);
        if(!result){
            aggregateResult(results, 'error', message);
            res.writeHead(404).end(JSON.stringify(results));
            console.log(result)
            return;
        }
        
        //If ivalid inform, and redirect to login page
        const userData = user.byEmail(db, email) as User;
        
        
        const redis = await redisClient();
        const sessionId = crypto.randomBytes(16).toString('hex');
        await redis.set(sessionId, JSON.stringify({id: userData.id, valid: true}) , {expiration: {type: 'EX', value: 3600}});
        await redis.close();

        res.setHeader('Set-Cookie', `session_id=${sessionId}; HttpOnly; Path=/;`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        aggregateResult(results, 'user', JSON.stringify(userData));
        res.end(JSON.stringify(results));
    });
})

router.post('/register', (req, res, info) => {
    // const id = checkSession(res, info.cookies)
    // if(!id) return;
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString(); // Convert buffer to string
    });


    req.on('end', async () => {
        const parsedBody = JSON.parse(body);
        const name = parsedBody['name'] as string;
        const email = parsedBody['email'] as string;
        const password = parsedBody['password'] as string;
        //Run validations
        const results: {[key: string]: any} = {};
        

        //Input validation
        if(!NAME_REGEX.test(name)) aggregateResult(results, 'error', 'name: invalid name format') 
        if(!EMAIL_REGEX.test(email)) aggregateResult(results, 'error', 'email: invalid email format') 
        if(!PASSWORD_REGEX.test(password)) aggregateResult(results, 'error', 'password: invalid password format') 
        if(Object.getOwnPropertyNames(results).length > 0) {
            res.writeHead(400).end(JSON.stringify(results));
            return;
        }

        //Check DB
        if(await user.email_taken(db, email)) {
            aggregateResult(results, 'error', 'email: email already in use');
            res.writeHead(400).end(JSON.stringify(results));
            return;
        }
        
        const {changes, message} = await user.new_user(db, {name: name, email, password})
        if(changes <= 0) {
            aggregateResult(results, 'error', 'system: failed to add new user');
            res.writeHead(500).end(JSON.stringify(results));
            return;
        }
        //If correct send login data
         aggregateResult(results, 'message', 'user registered sucessfully')
        //If ivalid inform, and redirect to login page
        
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(results));
    });
})

//Then managing the posts
router.get('/admin_info', async (req, res, info) => {
    const id = await checkSession(res, info.cookies);
    if(!id) return;

    const data = {
        users: user.all(db).map((u)=> ({
            id: u.id,
            name: u.name,
            email: u.email,
            created_at: u.created_at,
            updated_at: u.updated_at,
            deleted_at: u.deleted_at,
        })),
        posts: post.all(db),
    }

    res.writeHead(200, {"content-type": "application/json"}).end(JSON.stringify(data));
})

router.put('/user', async (req, res, info) => {
    const id = await checkSession(res, info.cookies);
    if(!id) return;

    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString(); // Convert buffer to string
    });
    req.on('end', async () => {
        const parsedBody = JSON.parse(body);
        let id = parsedBody['id'];
        let name = parsedBody['name'];
        let email = parsedBody['email'];
        let password = parsedBody['password'];

        name = name ? name : undefined;
        email = email ? email : undefined;
        password = password ? password : undefined;

        const  update = name || email || password;
        if(!update) {
            res.writeHead(200, {"content-type": "application/json"}).end(JSON.stringify({message: 'no change'}));
        }


        //Input validation
        const results: {[key: string]: any} = {};
        if(name && !NAME_REGEX.test(name)) aggregateResult(results, 'error', 'name: invalid name format') 
        if(email && !EMAIL_REGEX.test(email)) aggregateResult(results, 'error', 'email: invalid email format') 
        if(password && !PASSWORD_REGEX.test(password)) aggregateResult(results, 'error', 'password: invalid password format')
        if(!isFinite(id)) aggregateResult(results, 'error', 'id: id must be number')     
        if(Object.getOwnPropertyNames(results).length > 0) {
            res.writeHead(400).end(JSON.stringify(results));
            return;
        }

       
        const {changes, message} = await user.update(db, {id, name, email, password});
        if(changes < 0){
            aggregateResult(results, 'error', 'system: could not change password');
            res.writeHead(500).end(JSON.stringify(results));
            return;
        }
        const data = user.find(db, id);
        if(!data) res.writeHead(500).end();

        res.writeHead(200, {message: 'update sucessfull'}).end(JSON.stringify({user: data}));
    })
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





