'use strict'
init_menu();
/* menu */
async function menu_get_template() {
    return await fetch(`/api/menu` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function menu_get_current_menu(id) {
    return await fetch(`/api/menu/${id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function init_menu() {
    var menu = document.getElementById('main_menu');
    var cr_url = location.href;
    if (menu) {
        menu.innerHTML = '';
        var cr_user = get_cr_user();
        var lst_menu = await menu_get_current_menu(cr_user.id);
        var lst_parent = lst_menu.filter(f => { return f.par_id == 0 });
        lst_parent.forEach(fe => {
            fe.childs = lst_menu.filter(ft => { return ft.par_id == fe.id })
        });
        lst_parent.forEach(item => {
            var str_chile = '';
            if (item.childs.length > 0) {
                str_chile = '<ul class="list-group ul-parent">';
                item.childs.forEach(fec => {
                    str_chile += `<li class="list-group-item"><a href="/home/${fec.action}"><i class="fa fa-arrow-circle-o-right" aria-hidden="true"> ${fec.name}</i></a></li>`
                });
                str_chile += '</ul>';
            }
            menu.innerHTML += ` <li class="list-group-item ${item.childs.length > 0?'has-child':''}">${item.action.length == 0 ? `<a href="#"><i class="fa fa-hand-o-right" aria-hidden="true"> ${item.name} </i><i class="left-arrow-style">${item.childs.length > 0?'>':''}</i></a>` : `<a href="/home/${item.action}"><i class="fa fa-hand-o-right" aria-hidden="true"> ${item.name}</i></a>`}
            ${str_chile}
        </li>`
        });
        menu.innerHTML += `<li class="list-group-item"><a href="#" id="current_username"><i class="fa fa-user" aria-hidden="true"> ${cr_user.username} </i></a> <a aria-current="page" onclick="acc_logout()" href="#">(Đăng xuất)</a>
    </li>`
    }
}

async function add_menu_user(data, user_id) {
    return await fetch(`/api/menu_user/${user_id}`, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log('Error:', error);
        });
}