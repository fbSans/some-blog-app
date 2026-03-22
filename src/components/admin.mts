import EventEmitter from "events";
import { MyButton, MyDiv, MyForm, MyH2, MyInput, MyLabel, MyLi, MySection, MySpan, MyTable, MyTBody, MyTd, MyTh, MyTHead, MyTr, MyUl } from "../core/HTMLComponents.mjs";
import { User } from "../dao/user.mjs";
declare const root: HTMLElement;

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

    function UserDetailsButton(user: User) {
        function onClick() {
            root.appendChild(UserDetails(user));
        }
        return MyButton('Details', {onclick: onClick});
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

function UserDetails(user: User){
    async function onUserUpdate(e: SubmitEvent){
        e.preventDefault();
        const form = e.target as HTMLElement;
        if(!('password' in form) || (form['password'] as HTMLInputElement).value.length <= 0) return;
        
        const body = JSON.stringify({
            id: user.id,
            password: (form['password'] as HTMLInputElement).value
        })

        const response = await fetch('/user', {
            method: 'PUT',
            body,
        });

        if(response.body){
            console.log(await response.json())
        }
    }

    const result =  MyDiv(
        {className: "user_details"},
        MyH2('User details'),
        MyForm(
            {className: 'user_details_form', onsubmit: onUserUpdate},
            MyLabel(MySpan({className: 'field'}, 'name: '), MySpan(user.name)),
            MyLabel(MySpan({className: 'field'}, 'email: '), MySpan(user.email)),
            MyLabel(MySpan({className: 'field'}, 'created: '), MySpan(user.created_at)),
            MyLabel(MySpan({className: 'field'}, 'last update: '), MySpan(user.updated_at)),
            MyLabel(MySpan({className: 'field'}, 'deleted:'), MySpan(!!user.deleted_at)),
            MyLabel(MySpan({className: 'field'}, 'change password:'), MyInput({type: "password", name: "password"})),
            MySpan(
                {className: "button_set"},
                MyButton("Update", {type: "submit"}),
                MyButton("Close", {onclick: () => root.removeChild(result)})
            )
        ),
    );

    return result;
}

