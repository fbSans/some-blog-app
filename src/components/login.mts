import { MyA, MyDiv, MyForm, MyH1, MyImg, MyInput, MyP } from "../core/HTMLComponents.mjs";
import {create, makeState, StateSetter,} from "../core/maker.mjs";



export function LoginPage(){
    return MyDiv({id: 'login_page'}, 
        MyImg({src: '/assets/images/favicon.png', alt: 'Page Logo', width: 150, height: 50}),
        MyH1('Login'),
        LoginForm(),
        MyP({id: 'status_out'}),
        MyDiv({className: 'form_links'}, MyA('home', {href: '#home'}),MyA('sign up?', {href: '#register'})),
    );
}

export function RegisterPage(){
    return MyDiv({id: 'register_page'}, 
        MyImg({src: '/assets/images/favicon.png', alt: 'Page Logo',}),
        MyH1('Register account'),
        RegisterForm(),
        MyP({id: 'status_out'}),
        MyDiv({className: 'form_links'}, MyA('home', {href: '#home'}), MyA('sign in?', {href: '#login'})),
    );
}

function onValueChange(e: Event, setValue: StateSetter<string>){
    setValue((e.target as any).value)
}

function LoginForm(){
    const [email, setEmail] = makeState('');
    const [password, setPassword] = makeState('')

    function onSubmit(e: SubmitEvent) {
        e.preventDefault();
        const data = JSON.stringify({ email: email().value , password: password().value});
        (async () =>{
            const response = await fetch('/login', {
                method: 'POST',
                body: data,
            });

            const status_out = document.getElementById('status_out');
            const resData = await response.json()
            if(response.status === 200) {
                setEmail('');
                setPassword('');
                if(status_out) status_out.innerText = "";
                window.location.assign('#home')
            } else if(status_out) {
                if(resData.error instanceof Array){
                    status_out.innerText = resData.error[0];
                } else if ( typeof resData.error === 'string') {
                    status_out.innerText = resData.error;
                }
            }
        })();
    }
    
    return (
        MyForm(
            {method: 'post', id: 'login_form', onsubmit: onSubmit},
            MyInput({type: 'email', name: 'email', placeholder: 'email', value: email, required: true, onchange: (e: Event) => onValueChange(e, setEmail)}),
            MyInput({type: 'password', name: 'password', placeholder: 'password', value: password, required: true,onchange: (e: Event) => onValueChange(e, setPassword)}),
            MyInput({type: 'submit', value: 'Login'}),
        )
    ); 
}

function RegisterForm() {
    const [username, setUsername] = makeState('');
    const [email, setEmail] = makeState('');
    const [password, setPassword] = makeState('')

    function onSubmit(e: SubmitEvent) {
        e.preventDefault();
        const data = JSON.stringify({name: username().value, email: email().value , password: password().value});
        (async () =>{
            const response = await fetch('/register', {
                method: 'POST',
                body: data,
            });

            const status_out = document.getElementById('status_out');
            const resData = await response.json()
            if(response.status === 200) {
                setUsername('');
                setEmail('');
                setPassword('');
                window.location.assign('#home')
            } else if(status_out) {
                if(resData.error instanceof Array){
                    status_out.innerText = resData.error[0];
                } else if ( typeof resData.error === 'string') {
                    status_out.innerText = resData.error;
                }
            }
        })();
    }
    return (
        MyForm(
            {method: 'post', action: '/register', id: 'register_form', onsubmit: onSubmit},
            MyInput({type: 'text',     placeholder: 'username', value: username, required: true, onchange: (e: Event) => onValueChange(e, setUsername)}),
            MyInput({type: 'email',    placeholder: 'email',    value: email,    required: true, onchange: (e: Event) => onValueChange(e, setEmail)}),
            MyInput({type: 'password', placeholder: 'password', value: password, required: true, onchange: (e: Event) => onValueChange(e, setPassword)}),
            MyInput({type: 'submit',   value: 'Register'}),
        )
    );
}
















