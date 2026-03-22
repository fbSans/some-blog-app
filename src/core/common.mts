import * as path from "path"
import { readFile} from "fs/promises";

export const DB_NAME = "app.sqlite";
export const NR_ROUTE_ITEM = 'number_route'

export const BASE_DIR = path.resolve('.');
export const ASSETS_PATH = path.resolve(BASE_DIR, "assets/")
export const IMAGES_PATH = path.resolve(ASSETS_PATH, "images")
export const FAVICON_PATH = path.resolve(IMAGES_PATH, "favicon.png")
export const DB_DIR = path.resolve(BASE_DIR, "database")
export const DB_PATH = path.resolve(DB_DIR, DB_NAME)
export const SRC_PATH = path.resolve(BASE_DIR, 'src');
export const BUILD_PATH = path.resolve(BASE_DIR, 'build');
export const PUBLIC_PATH = path.resolve(BASE_DIR, 'public');

export const PASSWORD_MIN_SIZE = 8;
export const NAME_REGEX = /^[_a-zA-Z0-9]{2,20}$/    
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = RegExp(`^(?=.*\\d)(?=.*[A-Za-z]).{${PASSWORD_MIN_SIZE},}$`);


type allowed_extension_t = ".txt" | ".html" | ".htm" | ".css" | ".js" | ".mjs" | ".png" | ".ico"

export const allowed_dirs = [
    ASSETS_PATH, BUILD_PATH, PUBLIC_PATH,
];

export const allowed_extensions =  {
    ".txt": "text/plain",
    ".html": "text/html",
    ".htm": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".png": "image/png",
    ".ico": "image/png",
    ".json": "application/json"
};

const text_formats = [
    "text/.*",
    'application/javascript',
    'application/json',
];

export function getValue(o: object, k: string){
    return Object.getOwnPropertyDescriptor(o, k)?.value;
}


export function hasOwnProp (o: Object, p: string): boolean {
    return Object.getOwnPropertyDescriptor(o, p) != undefined;
}

export function truthyProps(o: Object){
    const result: {[key: string]: any} = {};
    for(const [entry,value] of Object.entries(o)) {
        if(!value) continue;
        result[entry] = value;
    }
    return result;
}

export function aggregateResult(results: {[key: string]: any}, key: string, error: any){
    if(!results[key]) {
        results[key] = error;
        return;
    } 
    if(!(results[key] instanceof Array)){
        results[key] = [results[key], error]
        return;
    }
    results[key].push(error);
}

//replace with a better one maybe on javascript api
export function IsTextFormat(mime_type: string){
    return !!text_formats.find((v) => mime_type.match(v));
}

export function resolvePath(filepath: string) {
    let resolved_path: string;
    if(!filepath.startsWith(BASE_DIR)){
        resolved_path = path.resolve(path.join(BASE_DIR, filepath));
    } else {
        resolved_path = path.resolve(filepath);
    }

    if(!allowed_dirs.find((d) => resolved_path.startsWith(d))) {
        resolved_path = path.resolve(path.join(PUBLIC_PATH, filepath))
        if(!resolved_path.startsWith(PUBLIC_PATH)) 
            return null;
    }
    return resolved_path;
}

/** This function will normalize the filepath */
export let loadFileAsBuffer = async (filepath: string) => {
    const resolved_path = resolvePath(filepath);
    if(!resolved_path) return {buffer: [], status: false, content_type: 'text/plain', message: "anauthorized dir"};    

    const filename = path.basename(resolved_path);
    const ext = path.extname(filename);
    

    if(!hasOwnProp(allowed_extensions, ext)){
        return {buffer: [], status: false, content_type: "text/plain", message: "forbidden extension"};
    };
    
    const content_type = allowed_extensions[ext as allowed_extension_t]
    
    const result = await (async () => {
        return await readFile(resolved_path)
        .then((buffer) => {
            return {buffer, status: true, content_type, message: "sucessful"};
        })
        .catch((e) => {
            return {buffer: [], status: false, content_type, message: `failed to read file: ${e}`}
        });
    })();

    return result;
}