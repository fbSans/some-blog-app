import * as http from "http"
import { URLPattern } from "urlpattern-polyfill"



export type Method = 'GET' | 'POST'
export type HandlerInfo = {pattern_result: URLPatternResult | null}
export type RequestHandler =  (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage>, info: HandlerInfo) => void


// type Routes = Map<URIPatthern, RequestHandler>
type Routes = {[pattern: string]: RequestHandler | null}



export interface Router {
    methodRoutes: {method: Method, routes: {uri: string, handler: RequestHandler}}
    register: (method: Method, pattern: string, handler: RequestHandler) => void;
    match: (method: Method, uri: string) => {found: boolean, handler: RequestHandler, pattern_result: URLPatternResult|null},
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
        'GET': {},
        'POST': {},
    }


    return {
        // routeIndex: new Map(), 
        defaultHandler(_req, res, _info) {
            res.writeHead(404)
            res.end();
        },
        register(method, pattern, handler) {
            if(!(pattern in routes[method])) {
                routes[method][pattern] = handler;
            }
        },
        match(method, uri){
            const method_routes = routes[method];
            
            for(let pattern in method_routes){
                const pattern_result = (new URLPattern({pathname: pattern})).exec({pathname: uri})
                if(pattern_result) { 
                    return {found: true, handler: method_routes[pattern], pattern_result}
                } 
            }
           
            return {found: false, handler: this.defaultHandler, pattern_result: null};
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

