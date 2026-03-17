import { MyDiv, MyForm, MyH1, MyImg, MyInput } from "../core/HTMLComponents.mjs";
import {create} from "../core/maker.mjs";



export function LoginPage(){
    return MyDiv({className: 'login_page'}, 
        MyImg({src: '/assets/images/favicon.png', alt: 'Page Logo', width: 150, height: 50}),
        MyH1('Login'),
        LoginForm(),
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
















