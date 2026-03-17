export function create(tagName: string, ...args: any[]) {
    const element = document.createElement(tagName);
    for(const arg of args) {
        if(arg instanceof Array) {
            const child = create(arg[0], ...arg.slice(1));
            element.appendChild(child);
        } else if (arg instanceof Node) {
            element.append(arg);
        } else if (typeof arg === 'object'){
            Object.assign(element, arg);
        } else {
            element.appendChild(document.createTextNode(arg));
        }
    }
    return element;
}