import {create} from "./maker.mjs";

export function MyForm(...args: any[]){
    return create('form', ...args);
}

export function MyLabel(...args: any[]){
    return create('label', ...args);
}

export function MyInput(attrs: {[key: string]: any}){
    return create('input', attrs);
}

export function MyButton(...args: any[]){
    return create('button', ...args);
}

export function MyImg(attrs: {[key: string]: any}){
    return create('img', attrs);
}

export function MyDiv(...args: any[]){
    return create('div', ...args);
}

export function MySpan(...args: any[]){
    return create('div', ...args);
}

export function MyH1(...args: any[]){
    return create('h1', ...args);
}

export function MyH2(...args: any[]){
    return create('h2', ...args);
}

export function MyP(...args: any[]){
   return create('p', ...args); 
}

export function MyBr(...args: any[]){
    return create('br', ...args);
}
export function MyA(...args: any[]){
   return create('a', ...args); 
}

export function MyUl(...args: any[]){
   return create('ul', ...args); 
}

export function MyOl(...args: any[]){
   return create('ol', ...args); 
}

export function MyDl(...args: any[]){
   return create('dl', ...args); 
}

export function MyLi(...args: any[]){
   return create('li', ...args); 
}

export function MyDD(...args: any[]){
   return create('dd', ...args); 
}

export function MyDt(...args: any[]){
   return create('dt', ...args); 
}

export function MyAside(...args: any[]){
   return create('aside', ...args); 
}

export function MySection(...args: any[]){
   return create('section', ...args); 
}

export function MyArticle(...args: any[]){
   return create('article', ...args); 
}

export function MyHeader(...args: any[]){
   return create('header', ...args); 
}

export function MyFooter(...args: any[]){
   return create('footer', ...args); 
}

export function MyMain(...args: any[]){
   return create('main', ...args); 
}

export function MyStrong(...args: any[]){
    return create('strong', ...args);
}

export function MyPre(...args: any[]){
   return create('pre', ...args); 
}

export function MyTable(...args: any[]){
   return create('table', ...args); 
}

export function MyTh(...args: any[]){
   return create('th', ...args); 
}

export function MyTr(...args: any[]){
   return create('tr', ...args); 
}

export function MyTd(...args: any[]){
   return create('td', ...args); 
}
