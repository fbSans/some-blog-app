import { CountPage } from './components/counter.mjs';
import {HomePage} from'./components/home.mjs';
import { PageRoute, PageRouter } from './components/page-router.mjs';
import {LoginPage} from'./components/login.mjs';

export default function App(){
    // return LoginPage();
    return PageRouter(
        PageRoute('login', LoginPage()),
        PageRoute('count', CountPage(2, 1)),
        PageRoute('*', HomePage()),
    );
}