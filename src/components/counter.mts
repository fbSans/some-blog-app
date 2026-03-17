import { MyP, MyH1, MySpan, MyDiv, MyH2, MyStrong } from "../core/HTMLComponents.mjs";

export function CountPage(value: number, count: number) {
    return MyDiv(    
        MyH1("Something of a test"), 
        MyH2("Some stupid poem"), 
        MyP({className: "poem"}, `${value} was sent<p>`),
        MyP({className: "poem"}, `${value} was recieved<p>`),
        MyP({className: "poem"}, `${value} is ${value % 2 == 0 ? 'even': 'odd'}`),
        MyP({className: "poem"}, `But ${value} x 3 = ${value * 3}, which is odd if you think about it`),
        MyP({className: "poem"}, `This route was used `, MySpan({className:"count"}, `${count}`), (count === 1 ? "time":"times") + `we watching you!`),
        MyP(MyStrong(`The end`))
    );
}