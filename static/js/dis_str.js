'use strict'

async function go_() {
    var text_ = document.getElementById('text_').value;
    var input_ = text_.split(/\r|\n/);
    var ele = document.getElementById('tb_');
    input_ = input_.filter((v, i, a) => a.indexOf(v) === i);
    ele.value = input_.join("\n");
}