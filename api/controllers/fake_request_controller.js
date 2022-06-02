'use strict'

const util = require('util')
const axi = require('./request_controller')
var formidable = require('formidable');
const fs = require('fs');
const FormData = require('form-data');

module.exports = {
    get_url: (req, res) => {
        var url = req.body.url;
        axi.get(url).then((r) => {
            res.json({ result: r.data });
        });
    },
    // get_blob_image: (req, res) => {
    //     var url = req.body.url;
    //     axi.get_blob_img(url).then((r) => {
    //         res.json(r.data);
    //     });
    // },
    post_image: async (req, res) => {
        var url_image = req.body.url_image;
        var url_post = req.body.url_post;
        var key = req.body.key;
        try {
            await post_image_run(url_image, url_post, key, (r) => {
                res.json({ rs: r });
            }, () => {
                res.json({ ok: 0, error: 'fail' })
            });
        } catch (error) {
            res.json({ ok: 0, error: error })
        }
    }
}

async function post_image_run(url_image, url_post, key, finished, fail) {
    var root_path = 'lib/temp_file/';
    var new_name = (new Date()).getTime();
    var save_path = `${root_path + new_name}.jpg`;
    try {
        return await axi.download_file(url_image, save_path, async () => {
            var rs = await save_file_then_post_link({ filepath: save_path, originalFilename: `${new_name}.jpg` }, url_post, key);
            fs.unlinkSync(save_path);
            finished(rs);
        }, () => { return null });
    } catch (error) {
        console.log(error);
    }
    fs.unlinkSync(save_path);
    fail();
}

async function save_file_then_post_link(file, url, key) {
    // var form = new formidable.IncomingForm();
    // form.parse(req, function (err, fields, files) {
    const fData = new FormData();
    var f = fs.createReadStream(file.filepath);
    // fs.unlinkSync(file.filepath);
    fData.append('file', f, {
        filename: file.originalFilename
    });
    const options = {
        maxBodyLength: Infinity,
        headers: {
            "Content-Disposition": `attachment; filename=${file.originalFilename}`,
            "Authorization": key,
            'Content-Type': 'multipart/form-data',
            ...fData.getHeaders()
        }
    }
    return await axi.post_with_header(url, fData, options);
    // });
}

async function call_image_to_get_blob(url) {
    // let response = await fetch(url_).then(r => r.blob());
    let response = await axi.get(url);
    return response.blob();
}
