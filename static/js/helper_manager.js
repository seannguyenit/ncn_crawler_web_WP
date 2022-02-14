//smoothy_ui_table();
/**
 * 
 * @param {*} params 
 * @param {*} method 
 * @param {*} class_lists 
 * @returns 
 */
function button_action_tool(params, method, class_lists, name) {
    var ele = document.createElement('button');
    ele.classList = class_lists.join(' ');
    ele.setAttribute("onclick", `${method}(${params})`);
    ele.innerText = name;
    return ele.outerHTML;
}

function convert_from_bool_to_values(params, true_vl, false_vl) {
    if (params == true || params == 1) {
        return true_vl;
    } else {
        return false_vl;
    }
}


function smoothy_ui_table() {
    document.querySelectorAll('td').forEach((item) => {
        if (item.innerText == 'null' || item.innerText == 'undefined') { item.innerText = '' }
    });
}
function validate_() {
    var i = Array.prototype.findIndex.call(document.querySelectorAll('[required]'), (f) => { return (!f.value || f.value.length == 0) });
    if (i != -1) {
        alert('Chưa điền đủ thông tin !');
        return false;
    } else {
        return true;
    }
}