'use strict'


async function slot_get_all() {
    return await fetch(`/api/slot` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function slot_get_detail(id) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/slot/${id}` /*, options */)
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

async function slot_save(url, data, meth) {
    return await fetch(url, {
        method: meth, // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
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


async function slot_del(id) {
    var url = `/api/slot/${id}`;
    var meth = 'DELETE';
    return await fetch(url, {
        method: meth, // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data != undefined) {
                return data || {};
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

