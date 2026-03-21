import { CountPage } from './components/counter.mjs';
import {HomePage} from'./components/home.mjs';
import { PageRoute, PageRouter } from './core/page-router.mjs';
import {LoginPage, RegisterPage} from'./components/login.mjs';

export default function App(){
    // return LoginPage();
    return PageRouter(
        PageRoute('login', LoginPage()),
        PageRoute('register', RegisterPage()),
        PageRoute('count', CountPage(2, 1)),
        PageRoute('*', HomePage()),
    );
}