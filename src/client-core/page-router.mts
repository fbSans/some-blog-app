import { MyDiv } from "../client-core/HTMLComponents.mjs";

type PageRoute = {url: string, element: HTMLElement}

export function PageRoute(url: string, element: HTMLElement){
    return {url, element}
}

// TODO: concile hash routes with in page hashes
export function PageRouter(...routes: PageRoute[]){
    const content = MyDiv();

    function use_hash(hash: string) {
        for(const route of routes){
            const pattern_result = (new URLPattern({pathname: route.url})).exec({pathname: hash})
            if(pattern_result) { 
                while(content.lastElementChild) content.removeChild(content.lastElementChild);
                content.appendChild(route.element);
                // window.location = route.url as string & Location;
                return;
            } 
        }
    }

    window.onhashchange = (e) => {
        const url_hash_result = RegExp(/(?:.*)#(.*)/).exec(e.newURL);
        let hash = null;
        if(url_hash_result)
            hash = url_hash_result[1];
        if(!hash) return;
        use_hash(hash);
    }

    window.onload = (e) => {
        use_hash(window.location.hash.substring(1));
    }
    
    return content;
}