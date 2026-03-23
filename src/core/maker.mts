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


//For manual values handling
//Not ideal, but works
//Motivated by the need of cleaning input fields simultaneosly.
export function values_manager(){
    const values: any[] = [];
    return {
        add(element: any){
            values.push(element)
            return element;
        },
        cleanAll(){
            for(const value of values){
                if('value' in value){
                    value.value = '';
                }
            }
        }
    };
}