import { MyA, MyDiv, MyForm, MyH1, MyImg, MyInput } from "../core/HTMLComponents.mjs";
import {create} from "../core/maker.mjs";



export function LoginPage(){
    return MyDiv({id: 'login_page'}, 
        MyImg({src: '/assets/images/favicon.png', alt: 'Page Logo', width: 150, height: 50}),
        MyH1('Login'),
        LoginForm(),
        MyDiv(MyA('sign up?', {href: '#register'})),
    );
}

export function RegisterPage(){
        return MyDiv({id: 'register_page'}, 
            MyImg({src: '/assets/images/favicon.png', alt: 'Page Logo', width: 150, height: 50}),
            MyH1('Register account'),
            RegisterForm(),
            MyDiv(MyA('sign in?', {href: '#login'})),
        );
}

function LoginForm(){
    return (
            MyForm(
                {method: 'post', action: '/login', className: 'login_form'},
                MyInput({type: 'email',  placeholder: 'User email', name: 'email', id: 'email', required: true}),
                MyInput({type: 'password', placeholder: 'password', name: 'pass', id: 'pass', required: true}),
                MyInput({type: 'submit', value: 'Login'}),
            )
    ); 
}

function RegisterForm() {
    return (
            MyForm(
                {method: 'post', action: '/register', id: 'register_form'},
                MyInput({type: 'name',  placeholder: 'Username', name: 'username', id: 'username', required: true}),
                MyInput({type: 'email',  placeholder: 'Email', name: 'email', id: 'email', required: true}),
                MyInput({type: 'password', placeholder: 'password', name: 'pass', id: 'pass', required: true}),
                MyInput({type: 'submit', value: 'Login'}),
            )
    );
}
















