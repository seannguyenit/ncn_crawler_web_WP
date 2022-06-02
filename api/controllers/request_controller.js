'use strict'

const axios = require('axios');
const fs = require('fs');

module.exports = {
    get: async (url) => {
        return axios.get(url);
    },
    // get_blob_img: async (url) => {
    //     return axios.get(url, {
    //         responseType: 'blob'  /* or responseType: 'arraybuffer'  */         
    //  }).then(response => {
    //     return new File([response.data], 'abc.jpg');       
    // });
    // },
    download_file: (file_url, save_path, completed, reject) => {
        downloadImage(file_url, save_path).then((value) => {
            completed(value);
        }, (value) => {
            reject(value);
        });
    },
    post: async (url, data) => {
        // maxBodyLength: Infinity;
        var ins = axios.create({
            maxBodyLength: Infinity,
            headers: data.getHeaders()
        });
        return ins.post(url, data).then(function (response) {
            // console.log(response);
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
                return error;
            });
    },
    post_with_header: async (url, data, options) => {
        // maxBodyLength: Infinity;
        // var ins = axios.create({
        //     maxBodyLength: Infinity,
        //     headers: header
        // });
        return axios.post(url, data, options).then(function (response) {
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
                return error;
            });
    }
}

async function downloadImage(url, path) {
    const writer = fs.createWriteStream(path)

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}
