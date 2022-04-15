'use strict'

init_page_notice();

async function init_page_notice() {

    var cr_u = get_cr_user();
    if (cr_u && cr_u.is_admin == 1) {
        document.getElementById('bt_edit').style.display = "block";
    }

    var rs = await get_notice();
    if (rs) {
        $('#notice').text(rs.content)
    }
}

async function open_modal() {
    var notice_record = await get_notice();

    if (notice_record) {
        $('#content').val(notice_record.content || '')
        $('#modal_notice').modal('show');
    }

}
async function save_notice() {
    var content = $('#content').val();
    var rs = await save_notice_to_api(content);
    $('#modal_notice').modal('hide');
    init_page_notice();
}

async function save_notice_to_api(content) {
    return await fetch('/api/web_info/notice', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content })
    })
        .then(response => response.json())
        .then(data => {
            if (data != undefined) {
                return data;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function get_notice() {
    return await fetch(`/api/web_info/notice` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            if (data != undefined) {
                return data[0];
            }
        })
        .catch((error) => {
            console.warn(error);
        });
}