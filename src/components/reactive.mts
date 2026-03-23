import { MyButton, MySpan, MyDiv, MyBr } from "../core/HTMLComponents.mjs";
import { makeState } from "../core/maker.mjs";

export function Counter(){
    const [count, setCount] = makeState(0);
    
    return MyDiv(
        MySpan({id: "span"}, count),
        MyBr(),
        MyButton({id: "button", onclick: () => {setCount(count().value + 1)}}, "Click me"),
    )
}