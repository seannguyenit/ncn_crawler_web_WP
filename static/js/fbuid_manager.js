'use strict'


async function fbuid_get_all() {
    return await fetch(`/api/fbuid` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.warn(error);
            return undefined;
        });
}

async function fbuid_get_detail(id) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/fbuid/${id}` /*, options */)
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

async function fbuid_get_by_acc(acc) {
    // var cr_u = get_cr_user();
    return await fetch(`/api/fbuid/check/${acc}` /*, options */)
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


async function fbuid_save(url, data, meth) {
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

async function fbuid_saveBigdata(url, data, meth) {
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

async function fbuid_checkAccount(url, data, meth) {
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


async function fbuid_del(id) {
    var url = `/api/fbuid/${id}`;
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