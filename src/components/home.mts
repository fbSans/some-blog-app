import { MyDiv, MyH1, MyLi, MyP, MyUl, MyA, MyH2, MyAside, MySection, MyInput, MyButton, MyLabel, MyBr, MyForm } from "../core/HTMLComponents.mjs";

export function HomePage(){
    const counterInput = MyInput({value: 0}) as HTMLInputElement;
    const counterButton = MyButton('Visit counter');
    counterButton.onclick = ()=>{
        window.location = `/number/${counterInput.value}` as string & Location;
    }
    return MyDiv(
        {className: 'home-page'},
        MyH1('Welcome'),
        MyP('My name is Name'),
        MyP('This is a short presentation page'),
        MyAside(
            {className: 'navigation'},
            MyH2('Navigation'),
            MyUl(
                MyLi(MyA('Count page', {href: '/number/1'})),
                MyLi(MyA('About', {href: '#about'})),
                MyLi(MyA('Contacts', {href: '#contacts'})),
                MyLi(MyA('GitHub', {href: 'https://github.com/fbSans'})),
            )
        ),
        MySection(
            {className: 'home-section'},
            MyH2('Count Page', {id: 'count'}),
            MyLabel('Enter a value'),
            MyBr(),
            counterInput,
            MyBr(),
            counterButton,
        ),
        MySection(
            {className: 'home-section'},
            MyH2('Contacts', {id: 'contacts'}),
            MyUl(
                MyLi('whatsapp: 84xxxxxxxx'),
            )
        ),
        MySection(
            {className: 'home-section'},
            MyH2('About', {id: 'about'}),
            MyP('Nothing to talk about')
        )
    );
}

