import EventEmitter from "events";
import { MyButton, MyDiv, MyH2, MySection, MySpan, MyTable, MyTBody, MyTd, MyTh, MyTHead, MyTr } from "../core/HTMLComponents.mjs";
import { User } from "../dao/user.mjs";


export function AdminPage(){
    let data = undefined;
    (async () => {
        const response = await fetch('/admin_info');
        data = await response.json() //will store this a sort of a state
        dispatchEvent(new CustomEvent('dataready', {bubbles: false, cancelable: true, detail: data}));
    })();
    return MyDiv(
        {id: 'admin_page'},
        UserManager(),
    );
}

function UserManager() {
    const countDisplay = MySpan();
    window.addEventListener('dataready', (e) => {
        if(!('detail' in e)) return;
        const data = e.detail as Object;
        if(!('users' in data)) return;
        if(!(data.users instanceof Array)) return;
        countDisplay.innerText = data.users.length.toString();
    })
    return MySection(
        {className: 'admin_section', id: 'user_admin_section'},
        MyH2("Users"),
        MyDiv({id: "user_admin_stats"}, 
            MySpan({className: 'stat'}, "User count: ", countDisplay),
        ),
        UserSummaryList(),
    );
}

function UserSummaryList() {
    const tbody = MyTBody();

    const result =  MyTable({id: 'admin-user-list'},
        MyTHead(
            MyTr(
                MyTh({className: 'id'}, 'ID'),
                MyTh('Name'),
                MyTh('Email'),
                MyTh('Action')
            )
        ),
        tbody
    );

    function UserDetailsButton(_user: User) {
        return MyButton('Details (no action)');
    }

    window.addEventListener('dataready', (e)=>{
        if(!('detail' in e)) return;
        const data = e.detail as Object;
        if(!('users' in data)) return;
        
        const users = data.users as User[];
        for(const user of users){
            tbody.appendChild(MyTr(
                {key: user.id},
                MyTd({className: 'id'}, user.id),
                MyTd(user.name),
                MyTd(user.email),
                MyTd(UserDetailsButton(user)),
            ))
        }
    })

    return result;
}

