import { MyDiv, MyH1, MyLi, MyP, MyUl, MyA, MyH2, MyAside, MySection, MyInput, MyButton, MyLabel, MyBr, MyForm } from "../client-core/HTMLComponents.mjs";

export function HomePage(){
    const counterInput = MyInput({value: 0}) as HTMLInputElement;
    const counterButton = MyButton('Visit counter');
    counterButton.onclick = ()=>{
        window.location = `/number/${counterInput.value}` as string & Location;
    }
    return MyDiv(
        {className: 'home-page'},
        MyH1('Welcome to this unfinished page'),
        MyP('This is just concepts on web development being tested'),
        MyP('A small blog site will be created here.'),
        MyP('From the current implementation of the page routing, hash urls do not work for internal page navigation.'),
        MyP('Next step is to add authorization model and session'),
        MyAside(
            {className: 'navigation'},
            MyH2('Navigation'),
            MyUl(
                MyLi(MyA('Sign in', {href: '#login'})),
                MyLi(MyA('About', {href: '#about'})),
                MyLi(MyA('Contacts', {href: '#contacts'})),
                MyLi(MyA('GitHub', {href: 'https://github.com/fbSans'})),
            )
        ),
        // MySection(
        //     {className: 'home-section'},
        //     MyH2('Count Page', {id: 'count'}),
        //     MyLabel('Enter a value'),
        //     MyBr(),
        //     counterInput,
        //     MyBr(),
        //     counterButton,
        // ),
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

