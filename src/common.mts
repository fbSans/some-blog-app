import * as path from "path"
import { readFile} from "fs/promises";

export const BASE_DIR = path.resolve('.');
export const ASSETS_PATH = path.resolve(BASE_DIR, "assets/")
export const IMAGES_PATH = path.resolve(ASSETS_PATH, "images")
export const FAVICON_PATH = path.resolve(IMAGES_PATH, "favicon.png")

type allowed_extension_t = ".txt" | ".html" | ".htm" | ".css" | ".js" | ".mjs" | ".png" | ".ico"


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

export function getValue(o: object, k: string){
    return Object.getOwnPropertyDescriptor(o, k)?.value;
}


export function hasOwnProp (o: Object, p: string): boolean {
    return Object.getOwnPropertyDescriptor(o, p) != undefined;
}

/** This function will normalize the filepath */
export let loadFileAsBuffer = async (filepath: string) => {
    const normalized_path = path.resolve(".", filepath);
    const filename = path.basename(normalized_path);
    const ext = path.extname(filename);
    
    
    if(!hasOwnProp(allowed_extensions, ext)){
        return {buffer: [], status: false, content_type: "text/plain", message: "forbidden extension"};
    };
    
    const content_type = allowed_extensions[ext as allowed_extension_t]
    if(!normalized_path.startsWith(BASE_DIR)) return {buffer: [], status: false, content_type, message: "anauthorized dir"};

    const result = await (async () => {
        return await readFile(normalized_path)
        .then((buffer) => {
            return {buffer, status: true, content_type, message: "sucessful"};
        })
        .catch((e) => {
            return {buffer: [], status: false, content_type, message: `failed to read file: ${e}`}
        });
    })();

    return result;
}