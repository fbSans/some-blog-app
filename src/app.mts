import { CountPage } from './components/counter.mjs';
import {HomePage} from'./components/home.mjs';
import { PageRoute, PageRouter } from './core/page-router.mjs';
import {LoginPage, RegisterPage} from'./components/login.mjs';
import { AdminPage } from './components/admin.mjs';
import { Counter } from './components/reactive.mjs';

export default function App(){
    // return LoginPage();
    return PageRouter(
        PageRoute('login', LoginPage()),
        PageRoute('register', RegisterPage()),
        PageRoute('admin', AdminPage()),
        PageRoute('count', CountPage(2, 1)),
        PageRoute('*', HomePage()),
    );
}