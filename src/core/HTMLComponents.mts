import {create} from "./maker.mjs";

export function MyForm(...args: any[]){
    return create('form', ...args);
}

export function MyInput(attrs: {[key: string]: any}){
    return create('input', attrs);
}

export function MyImage(attrs: {[key: string]: any}){
    return create('img', attrs);
}

export function MyDiv(...args: any[]){
    return create('div', ...args);
}

export function MyH1(...args: any[]){
    return create('h1', ...args)
}