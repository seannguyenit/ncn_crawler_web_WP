'use strict'

load_data_saved();

function bt_add_click() {
    var domain = document.getElementById('input_domain').value;
    var user = document.getElementById('input_user').value;
    var pass = document.getElementById('input_pass').value;
    var obj = { domain: domain, user: user, pass: pass, time: (new Date()).getTime() };
    add_data(obj);
    load_data_list();
}

function bt_del_click(domain) {
    delete_data(domain);
    load_data_list();
}

function load_data_saved(element = null) {
    load_data_list();
    var dat = get_data();
    if (!element) {
        if (dat && dat.length > 0) {
            document.getElementById('input_domain').value = dat[0].domain;
            document.getElementById('input_user').value = dat[0].user;
            document.getElementById('input_pass').value = dat[0].pass;
        }
    } else {
        var domain = element.dataset.domain;
        if (dat) {
            var d = dat.find(f => { return f.domain == domain });
            if (d) {
                document.getElementById('input_domain').value = d.domain;
                document.getElementById('input_user').value = d.user;
                document.getElementById('input_pass').value = d.pass;
            }
        }
    }
}

function load_data_list() {
    var place = document.getElementById('table_user');
    place.innerHTML = '';
    var dat = get_data();
    if (dat) {
        dat.forEach(item => {
            place.innerHTML += `<tr>
                <td>${dat.indexOf(item) + 1}</td>
                <td>${item.domain}</td>
                <td>${item.user}</td>
                <td> <button data-domain="${item.domain}" onclick="load_data_saved(this)" class="btn btn-sm btn-primary">Load</button> <button data-domain="${item.domain}" onclick="bt_del_click(this)" class="btn btn-sm btn-warning">Delete</button></td>
            </tr>`
        });

    }
}

function add_data(obj) {

    var cr_d = get_data();
    if (cr_d) {
        if (cr_d.indexOf(obj) != -1) {
            var rc = cr_d.find(f => { return f.domain == obj.domain });
            if (rc) {
                rc.user = obj.user;
                rc.pass = obj.pass;
            }
            set_data(cr_d);
        } else {
            cr_d.push(obj);
            set_data(cr_d);
        }
    } else {
        set_data(obj);
    }

}

function delete_data(element) {
    var domain = element.dataset.domain;
    if (domain.length > 0) {
        var cr_d = get_data();
        if (cr_d) {
            cr_d = cr_d.filter(f => { return f.domain != domain });
            set_data(cr_d);
        }
    }
}

function get_data() {
    var str_js = window.localStorage.getItem('up_wp');
    if (str_js && str_js.length > 0) {
        return (JSON.parse(str_js)).sort((a, b) => { Number(a.time) - Number(b.time) });
    } else {
        return [];
    }
}

function set_data(obj) {
    window.localStorage.setItem('up_wp', JSON.stringify(obj));
}