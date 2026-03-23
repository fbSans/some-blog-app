
export type StateGetter<T> = () => {__maker_state: any, value: T, __event_name: string}
export type StateSetter<T> = (newState: T) => void;


export function makeState<T>(initialState: T): [StateGetter<T>, StateSetter<T>] {
    let internal_state = initialState;
    const prefix: string =  "on__maker_eventname_"
    let counter = 0;

    const __event_name = `${prefix}${counter}`;
    
    const state_getter =  function() {
        return {__maker_state: 1, value: internal_state, __event_name}
    }

    const state_setter = (newState: T) => {
        internal_state = newState;
        dispatchEvent(new CustomEvent(__event_name, {bubbles: false, cancelable: true}));
    }

    state_getter.__maker_state = 1;

    return [
        state_getter,
        state_setter
    ]
}

function reactive<T>(func: Function, updater: (arg: T) => void){
    const result = func();
    if(result.__maker_state) {
        const event_name = result.__event_name as string;
        updater(result.value);
        
        window.addEventListener(event_name, () => {
            const result = func();
            updater(result.value);
        })
        return;
    } 
    updater(result);
}

//Inspired by: https://medium.com/@MichalMecinski/creating-reactive-html-templates-using-vanilla-javascript-8fcd133a2d61
//The `reactive` and `makeState` implementations are from my own authoring, based by description
//`create` is basically a copy paste with twiks to integrate to descriminate some functions from the State managing ones
export function create(tagName: string, ...args: any[]) {
    const element = document.createElement(tagName);
    for(const arg of args) {
        if(arg instanceof Array) {
            const child = create(arg[0], ...arg.slice(1));
            element.appendChild(child);
        } else if (arg instanceof Node) {
            element.append(arg);
        } else if (typeof arg === 'object'){
            for(const [key, value] of Object.entries(arg)) {
                if(typeof value ===  'function' && Object.hasOwn(value, '__maker_state')){
                    reactive(value, (value: any) => (element as any)[key] = value);
                } else {
                    (element as any)[key as string] =  value as any;
                }
            }
        } else if(typeof arg === 'function' && Object.hasOwn(arg, '__maker_state')){
            const textNode = document.createTextNode('');
            reactive(arg, (value: string) => {textNode.textContent = value})
            element.appendChild(textNode);
        }else {
            element.appendChild(document.createTextNode(arg));
        }
    }
    return element;
}

