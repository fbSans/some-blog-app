import { MyA, MyDiv, MyForm, MyH1, MyImg, MyInput, MyP } from "../core/HTMLComponents.mjs";
import {create, values_manager} from "../core/maker.mjs";



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

function LoginForm(){
    const vals = values_manager(); 
    function onSubmit(e: SubmitEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        
        const data = JSON.stringify({ email: form['email'].value , password: form['pass'].value});
        (async () =>{
            const response = await fetch('/login', {
                method: 'POST',
                body: data,
            });

            const status_out = document.getElementById('status_out');
            const resData = await response.json()
            if(response.status === 200) {
                window.alert('Logged in sucessfully')
                vals.cleanAll();
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
                vals.add(MyInput({type: 'email',  placeholder: 'email', name: 'email', id: 'email', required: true})),
                vals.add(MyInput({type: 'password', placeholder: 'password', name: 'pass', id: 'pass', required: true})),
                vals.add(MyInput({type: 'submit', value: 'Login'})),
            )
    ); 
}

function RegisterForm() {
    const vals = values_manager();
    function onSubmit(e: SubmitEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        
        const data = JSON.stringify({name: form['username'].value, email: form['email'].value , password: form['pass'].value});
        (async () =>{
            const response = await fetch('/register', {
                method: 'POST',
                body: data,
            });

            const status_out = document.getElementById('status_out');
            const resData = await response.json()
            if(response.status === 200) {
                window.alert('User registered sucessfully')
                vals.cleanAll();
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
                vals.add(MyInput({type: 'text',  placeholder: 'Name', name: 'username', id: 'username', required: true})),
                vals.add(MyInput({type: 'email',  placeholder: 'Email', name: 'email', id: 'email', required: true})),
                vals.add(MyInput({type: 'password', placeholder: 'password', name: 'pass', id: 'pass', required: true})),
                MyInput({type: 'submit', value: 'Register'}),
            )
    );
}
















