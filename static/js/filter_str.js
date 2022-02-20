'use strict'

async function go_() {
    var char_ = document.getElementById('char_').value;
    var index_ = document.getElementById('index_').value;
    var text_ = document.getElementById('text_').value;
    var index_arr = index_.split(',');
    var input_ = text_.split(/\r|\n/);
    var ele = document.getElementById('tb_');
    ele.value = '';
    input_.forEach(f => {
        var arr_row = f.split(char_);
        var str = '';
        var arr = [];
        for (var i of index_arr) {
            arr.push(arr_row[i - 1] || '');
        }
        str += arr.join(char_) + "\n";
        ele.value += str;
    });
}