import { FAVICON_PATH } from "../core/common.mjs";
import { MyDiv, MyForm, MyH1, MyImage, MyInput } from "../core/HTMLComponents.mjs";
import {create} from "../core/maker.mjs";



export function LoginPage(){
    return MyDiv({className: 'login_page'}, 
        MyImage({src: '/assets/images/favicon.png', alt: 'Page Logo', width: 150, height: 50}),
        MyH1('Login'),
        LoginForm(),
    );
}

function LoginForm(){
    return (
            MyForm(
                {method: 'post', action: '/login', className: 'login_form'},
                MyInput({type: 'email',  placeholder: 'User email', id: 'i_email', required: true}),
                MyInput({type: 'password', placeholder: 'password', id: 'i_pass', required: true}),
                MyInput({type: 'submit', value: 'Login'}),
            )
        ); 
}
















