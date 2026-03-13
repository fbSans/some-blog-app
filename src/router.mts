import * as http from "http"


export type Method = 'GET' | 'POST'
export type RequestHandler =  (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>) => void
export type URIPatthern = RegExp | string;


type Routes = Map<URIPatthern, RequestHandler>


export interface Router {
    methodRoutes: {method: Method, routes: {uri: string, handler: RequestHandler}}
    register: (method: Method, pattern: string, handler: RequestHandler) => void;
    match: (method: Method, uri: string) => {found: boolean, handler: RequestHandler},
    defaultHandler: RequestHandler,
    setDefaultRoute: (handler: RequestHandler) => void, 
    get: (uri: string, handler: RequestHandler) => void,
    post: (uri: string, handler: RequestHandler) => void,
}

export const makeRouter = () => {
    let routes: {
        'GET': Routes,
        'POST': Routes,
    };

    routes = {
        'GET': new Map(),
        'POST': new Map(),
    }


    return {
        // routeIndex: new Map(), 
        defaultHandler(_req, res) {
            res.writeHead(404)
            res.end();
        },
        register(method, pattern, handler) {
            if(!routes[method].get(pattern)) {
                routes[method].set(pattern, handler);
            }
        },
        match(method, uri){
            const uri_patterns = routes[method].keys();
            
            let pattern = undefined;
            while(pattern = uri_patterns.next()){
                if(!pattern) continue;
                if(!pattern.value) continue;
                if(RegExp(`^${pattern.value}$`).test(uri)) break; //this maching is not well tested yet
            }

            if(!pattern) return {found: false, handler: this.defaultHandler};
            let handler = routes[method].get(pattern.value);
            if(!handler) return {found: false, handler: this.defaultHandler};
            return {found: true, handler};
        },
        setDefaultRoute(handler){
            this.defaultHandler = handler
        },
        get(uri, handler) {
            this.register('GET', uri, handler);
        },
        post(uri, handler) {
            this.register('POST', uri, handler);
        },
    } as Router
};

