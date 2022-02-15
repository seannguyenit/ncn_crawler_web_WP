'use strict'

const r_url = "https://arthurtech.xyz/";
// const r_url = "/proxy/";

async function get_content(url) {
    try {

        return await fetch(r_url + url).then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(async function (html) {
            var domain_ = get_domain(url);

            // Convert the HTML string into a document object
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, 'text/html');
            await remove_href(doc);
            await remove_script(doc);
            await change_src_image(doc);
            var og_title = doc.querySelector('[property="og:title"]');
            var title = (og_title) ? doc.querySelector('[property="og:title"]').content : null;
            if (!title) {
                var sub_title = doc.title;
                if (sub_title.indexOf(' - ') > -1) {
                    sub_title = sub_title.split(' - ').slice(0, sub_title.split(' - ').length - 1)[0];
                }
                if (sub_title.indexOf(' – ') > -1) {
                    sub_title = sub_title.split(' – ').slice(0, sub_title.split(' – ').length - 1)[0];
                }
                if (sub_title.indexOf(' | ') > -1) {
                    sub_title = sub_title.split(' | ').slice(0, sub_title.split(' | ').length - 1)[0];
                }
                title = sub_title;
            }

            var og_img = doc.querySelector('[property="og:image"]');
            var thumbnail = (og_img) ? og_img.content : null;
            var body_ = '';
            var converted_ = [];
            var content_ = '';
            var arr_domain = ['postshare', 'dispatch', 'issuepos', 'popularne', 'jastrzabpost'];

            if (check_body_old_type(doc)) {
                arr_domain.push(domain_);
            }

            if (arr_domain.indexOf(domain_) != -1) {
                body_ = await get_main_intelligent(doc, domain_);
                converted_ = await get_all_media(body_);
                body_.innerHTML = body_.innerHTML.replaceAll('&nbsp;', ' ').replaceAll('&amp;', ' ').replaceAll('&lt;', ' ').replaceAll("\n", "").replaceAll("\t", "");
                await remove_head_after(body_)
                content_ = body_.innerHTML
            } else {
                body_ = await get_main_intelligent_new(doc);
                converted_ = await get_all_media_new(body_, 'https://' + doc.domain);
                content_ = body_.innerText;
                content_ = '<div>' + content_ + '</div>'
                if (converted_) {
                    for (var i of converted_) {
                        if ((i) && (!i.is_del) && ((i.media_id || 0) > 0)) {
                            content_ = insert_img_to_text(content_, i);
                        }
                    }
                }
            }
            var media_id = 0;
            content_ = content_.replaceAll(domain_, document.getElementById('input_domain').value.split('.')[0]);
            if (converted_.length > 0) {
                if (thumbnail) {
                    var img_thumb = await upload_and_replace_url(thumbnail);
                    if (img_thumb.media_id) {
                        media_id = img_thumb.media_id;
                    }
                    // else {
                    //     var sl_mde = converted_.find(f => { return (f) && f.media_id });
                    //     if (sl_mde) {
                    //         media_id = converted_.find(f => { return (f) && f.media_id }).media_id || 0;
                    //     }
                    // }
                } else {
                    var sl_mde = converted_.find(f => { return (f) && f.media_id });
                    if (sl_mde) {
                        media_id = converted_.find(f => { return (f) && f.media_id }).media_id || 0;
                    }
                }

            }
            return { title: title, content: content_, media: (media_id || 0) };

        }).catch(function (err) {
            // There was an error
            console.log('Something went wrong.', err);
            // return { error: 1 };
        });
    } catch (error) {
        console.log('stop by cors !');
    }
    // return { error: 1 };
}


async function get_all_media(body_) {
    var media_ = [];
    Array.prototype.forEach.call(body_.querySelectorAll('img'), f => {
        if (f.src.includes('assets') || f.src.includes('facebook') || f.src.includes('gif')) {
            f.parentElement.removeChild(f);
        } else {
            media_.push(f);
        }
    });
    var hostname = window.location.hostname;
    var converted_ = [];
    for (let img_ of media_) {
        if (!img_.src.includes('google')) {
            let w = await waitingForNext(3000);
            if (img_.src.indexOf(hostname) == -1) {
                img_.removeAttribute('srcset');
                for (var att of img_.attributes) {
                    if (att != 'alt' && att != 'src' && att != 'class') {
                        img_.removeAttribute(att);
                    }
                }
                var convert_img = await upload_and_replace_url(img_.src);
                if (convert_img) {
                    if (convert_img.converted_url) {
                        img_.src = convert_img.converted_url;
                    } else {
                        img_.src = "";
                        img_.style.display = 'none';
                    }
                } else {
                    img_.parentNode.removeChild(img_);
                }
                converted_.push(convert_img);
            } else {
                img_.parentNode.removeChild(img_);
            }
        } else {
            converted_.push(convert_img);
        }
    }
    return converted_;
}

async function get_all_media_new(body_, full_domain_) {
    var media_ = body_.querySelectorAll('img');
    media_ = Array.prototype.filter.call(media_, f => { return !f.src.includes('assets') && !f.src.includes('facebook') && !f.src.includes('gif') });
    Array.prototype.forEach.call(media_, f => {
        if (!f.src.includes('http')) {
            f.src = full_domain_ + f.src;
        }
    });
    console.log(media_);
    // var media_ = Array.prototype.filter.call(body_.querySelectorAll('img'), ft => { return ft.width > 150 });
    var hostname = window.location.hostname;
    var converted_ = [];
    for (let img_ of media_) {
        var convert_img = {};
        await check_and_replace_src_img(img_);
        let w = await waitingForNext(3000);
        if (img_.src.indexOf(hostname) == -1) {
            img_.removeAttribute('srcset');
            if (img_.src.includes('google')) {
                convert_img.converted_url = img_.src;
                convert_img.media_id = 999999999;
            } else {
                convert_img = await upload_and_replace_url(img_.src);
                if (convert_img) {
                    if (convert_img.converted_url) {
                        img_.src = convert_img.converted_url;
                    } else {
                        img_.src = "";
                        img_.style.display = 'none';
                    }
                    convert_img.text = (img_.alt || get_closet_bottom_text(img_));
                } else {
                    convert_img.is_del = 1;
                }
            }
        } else {
            convert_img.is_del = 1;
        }
        converted_.push(convert_img);
    }
    return converted_;
}

async function check_and_replace_src_img(img) {
    var arr_type = ['.jpg', '.png', '.jpeg'];
    if (arr_type.findIndex(f => { return img.src.includes(f) }) != -1) {
        return;
    }
    var t = img.outerHTML;
    var src_found = '';
    for (let item of arr_type) {
        if (t.includes(item)) {
            var start_index = t.indexOf(item);
            var count = start_index;
            while (count != 0) {
                var text = '';
                var type_length = item.length;
                for (let c = 0; c < type_length; c++) {
                    text += t[count + c];
                }
                text += ((t[count + 4]) || '');
                if (text.includes('http')) {
                    src_found = t.substring(count, start_index + item.length);
                    img.src = src_found;
                    return;
                }
                count--;
            }
        }
    }
}

function insert_img_to_text(content_, img) {
    if (img.text.length > 0 && content_.indexOf(img.text) != -1) {
        content_ = content_.replace(img.text, `<img src="${img.converted_url}"></img>`);
    } else {
        content_ += `<img src="${img.converted_url}"></img>`;
    }
    return content_;
}

function get_closet_bottom_text(element) {
    if (!element) return '';
    var f_ele = element.parentElement;
    var text = '';
    var count = 0;
    while (text.length == 0 && count < 11) {
        text = f_ele.innerText;
        f_ele = f_ele.parentElement
        count++;
    }
    return text;
}

/**
 * 
 * @param {*} file_url 
 * @returns return {media_id, root_url, converted_url, thumbnail}
 */

async function upload_and_replace_url(file_url) {
    try {
        if (file_url.indexOf('http://') > -1) {
            file_url = file_url.replace('http://', '');
        }
        if (file_url.includes('?')) {
            file_url = file_url.split('?')[0];
        }
        var root_url = document.getElementById('input_domain').value;
        var host = `https://${root_url}/wp-json/wp/v2/media`;
        var user = document.getElementById('input_user').value;
        var pass = document.getElementById('input_pass').value;
        var file_name = file_url.split('/').at(-1);
        var file_ = await get_blob_from_url(r_url + file_url);
        const formData = new FormData();
        formData.append("file", file_, file_name);

        var au_str = `Basic ${encode_base64(user, pass)}`;
        var data_rs = await fetch(host, {
            body: formData,
            headers: {
                'Content-Disposition': `attachment; filename=${file_name}`,
                Authorization: au_str
            },
            method: "POST"
        })
            .then(response => response.json())
            .then(result => {
                return result;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        if (data_rs) {
            var thumb = data_rs.source_url;
            if (data_rs.media_details && data_rs.media_details.sizes && data_rs.media_details.sizes.thumbnail) {
                thumb = data_rs.media_details.sizes.thumbnail.source_url;
            }
            return { media_id: data_rs.id, root_url: file_url, converted_url: data_rs.source_url, thumbnail: thumb }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
    return null;
}

async function get_blob_from_url(url_) {
    let response = await fetch(url_).then(r => r.blob());
    return response;
}

async function get_content_by_plugin(url, index) {
    var temp_bt = document.getElementById('sp_ex');
    temp_bt.dataset.url = url;
    temp_bt.dataset.index = index;
    temp_bt.dataset.stt = "0";
    temp_bt.click();
    var count = 0;
    // console.time()
    while (document.getElementById('sp_ex').dataset.stt != "1" && count < 20) {
        let w = await waitingForNext(2000);
        count++;
    }
    // console.timeEnd()

    return JSON.parse(document.getElementById('sp_ex').dataset.js_data || '{error: 1}');

}
function check_body_old_type(doc) {
    var select_content_located = doc.body.querySelector('article');
    if (!select_content_located) {
        select_content_located = doc.body.querySelector('precontent')
    }
    if (!select_content_located) {
        select_content_located = doc.body.querySelector('pre')
    }
    // if (!select_content_located) {
    //     select_content_located = doc.body.querySelector('[class=ArticleContent]')
    // }
    // if (!select_content_located) {
    //     select_content_located = doc.body.querySelector('[class=article_body]')
    // }
    return (select_content_located);
}

/**
 * Nếu đổi thì đổi cả bên extentions
 * @param {*} doc 
 * @returns 
 */
async function get_main_intelligent(doc, domain_) {
    var select_content_located = doc.body.querySelector('article');
    if (!select_content_located) {
        select_content_located = doc.body.querySelector('precontent')
    }
    if (!select_content_located) {
        select_content_located = doc.body.querySelector('pre')
    }
    // if (!select_content_located) {
    //     select_content_located = doc.body.querySelector('[class=ArticleContent]')
    // }
    // if (!select_content_located) {
    //     select_content_located = doc.body.querySelector('[class=article_body]')
    // }
    //end find

    await remove_head(select_content_located);

    //special domain
    switch (domain_) {
        case 'issuepos':
            var _media = select_content_located.querySelectorAll('img');
            var bd = document.createElement('body');
            var d_ = document.createElement('div');
            _media.forEach(fr => {
                if (fr.src.indexOf(window.location.hostname) == -1) {
                    d_.appendChild(fr);
                }
            });
            bd.appendChild(d_);
            select_content_located = bd;
            break;
        case 'popularne':
            var ft = doc.getElementById('related-by-tags');
            ft.parentElement.removeChild(ft);
            select_content_located = doc.getElementById('DOM_DOCUMENT');
            break;
        case 'jastrzabpost':
            var ct = doc.getElementsByClassName('article-inner-content')[0];
            var glr = doc.getElementsByClassName('after-article-gallery')[0].querySelectorAll('img');
            var new_bd = document.createElement('body');
            new_bd.appendChild(ct)
            for (let pt of glr) {
                new_bd.appendChild(pt)
            }
            select_content_located = new_bd;
            break;
        default:
            break;
    }

    if (!select_content_located) {
        select_content_located = doc.body;
    }

    //&amp;
    return select_content_located;
}

async function get_main_intelligent_new(doc) {
    var select_content_located = doc.body;

    await remove_head(select_content_located);

    //&amp;
    return select_content_located;
}

async function change_src_image(element) {
    element.querySelectorAll('img').forEach(item => {
        if (!item.src.includes('http')) {
            for (let index = 0; index < item.attributes.length; index++) {
                var att = item.attributes[index].nodeValue;
                if (att.includes('http')) {
                    item.src = att;
                    break;
                }
            }
        }
        // if(item.dataset.original||item.dataset.src){
        //     item.src = (item.dataset.original||item.dataset.src);
        // }
    });
}


async function remove_href(element) {
    element.querySelectorAll('a').forEach(item => {
        item.removeAttribute("href");
    });
}

async function remove_script(element) {
    element.querySelectorAll('script').forEach(item => {
        item.parentNode.removeChild(item)
    });
}

async function remove_head(element) {
    element.querySelectorAll('header').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('link').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('style').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('nav').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('footer').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('form').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('button').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('input').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('select').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('ins').forEach(item => {
        item.parentNode.removeChild(item)
    });
    //remove all display none
    element.querySelectorAll('iframe').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('ul').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('i').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('aside').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('source').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('figcaption').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('[style]').forEach(item => {
        item.removeAttribute('style')
    });
    element.querySelectorAll('[class]').forEach(item => {
        item.removeAttribute('class')
    });
    //remove all blank div
    Array.prototype.filter.call(element.querySelectorAll('div'), f => { return f.children.length == 0 && f.innerText.length == 0 && f.innerHTML.length == 0 }).forEach(item => {
        item.parentNode.removeChild(item)
    });

    Array.prototype.filter.call(element.querySelectorAll('table'), f => { return f.innerText.length == 0 && f.innerHTML.length == 0 }).forEach(item => {
        item.parentNode.removeChild(item)
    });
    Array.prototype.filter.call(element.querySelectorAll('tr'), f => { return f.innerText.length == 0 && f.innerHTML.length == 0 }).forEach(item => {
        item.parentNode.removeChild(item)
    });
    remove_all_div_by_key('bottom', element);
    remove_all_div_by_key('head', element);
    remove_all_div_by_key('nav', element);
    remove_all_div_by_key('foot', element);
    remove_all_div_by_key('aside', element);
    remove_all_div_by_key('sm_dfp_ads', element);
    remove_all_div_by_key('gsb-wrapper', element);
    element.querySelectorAll('[loading="lazy"]').forEach(item => {
        item.removeAttribute('loading');
    });
}

async function remove_head_after(element) {
    //remove all blank div
    Array.prototype.filter.call(element.querySelectorAll('div'), f => { return f.children.length == 0 && f.innerText.length == 0 && f.innerHTML.length == 0 }).forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('div').forEach(item => {
        Array.prototype.forEach.call(item.attributes, attribute => item.removeAttribute(attribute.name))
        if (!item.querySelector('img') && item.innerText.length == 0) {
            item.parentNode.removeChild(item);
        }
    });
    element.querySelectorAll('p').forEach(item => {
        Array.prototype.forEach.call(item.attributes, attribute => item.removeAttribute(attribute.name))
        if (item.innerText.length == 0) {
            item.parentNode.removeChild(item);
        }
    });
    element.innerHTML = element.innerHTML.replaceAll('<noscript>', '').replaceAll('</noscript>', '');
    element.innerHTML = element.innerHTML.replaceAll('<div>', '<p>').replaceAll('</div>', '</p>');
    element.innerHTML = element.innerHTML.replaceAll('<picture', '<div').replaceAll('</picture', '</div');

}

// async function show_media(arr_media, root_url) {
//     if (!arr_media) return;
//     var par = document.getElementById('media_located');
//     par.innerHTML = '';
//     arr_media.forEach(ele => {
//         var src = ele.dataset.original || ele.dataset.src || ele.src;
//         src = src.replaceAll('http://localhost:3000/', root_url);
//         par.innerHTML += `<div class="col-md-12 d-flex p-1" style="border-bottom:solid 1px black ;height: 120px;">
//         <div class="col-md-2">
//             <img width="100" height="100" src="${src}" />
//         </div>
//         <div class="col-md-10 text-center">
//             <a target="_blank" href="${src}" style="margin: auto;word-wrap: normal;">${src}</a>
//         </div>
//     </div>`;
//     });
// }

function validate_all() {
    if (document.getElementById('input_link').value.length == 0) {
        alert('Chưa nhập links vào !');
        return false;
    }
    // if(document.getElementById('input_domain').value.length == 0){
    //     alert('Chưa nhập tên miền vào !');
    //     return false;
    // }
    // if(document.getElementById('input_user').value.length == 0){
    //     alert('Chưa nhập user vào !');
    //     return false;
    // }
    // if(document.getElementById('input_pass').value.length == 0){
    //     alert('Chưa nhập pass vào !');
    //     return false;
    // }
    return true;
}

/**
 * 
 * @param {domain} url 
 * @param {*} user 
 * @param {*} pass 
 * @param {*} title 
 * @param {*} content 
 * @returns 
 */
async function save_posts(url, user, pass, title, content, media) {
    var data = `title=${title}&content=${content}&status=publish&featured_media=${media}`;
    // data.excerpt = {};
    var au_str = `Basic ${encode_base64(user, pass)}`;
    var url = `https://${url}/wp-json/wp/v2/posts`
    return await fetch(url, {
        body: data,
        headers: {
            Authorization: au_str,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function encode_base64(user, code) {
    var string = `${user}:${code}`;
    // Create Base64 Object
    var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

    // Encode the String
    var encodedString = Base64.encode(string);
    // console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"

    // Decode the String
    // var decodedString = Base64.decode(encodedString);
    // console.log(decodedString); // Outputs: "Hello World!"

    return encodedString;

}

async function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}
async function waitingForNext(time) {
    // console.log('waiting...')
    let delayres = await delay(time);
}

function convert_image_type(src, width, height) {
    URL.revokeObjectURL(src);             // free up memory
    var c = document.createElement("canvas"),  // create a temp. canvas
        ctx = c.getContext("2d");
    c.width = width;                      // set size = image, draw
    c.height = height;
    ctx.drawImage(this, 0, 0);

    // convert to File object, NOTE: we're using binary mime-type for the final Blob/File
    var jpeg = c.toDataURL("image/jpeg", 0.75);  // mime=JPEG, quality=0.75
    return jpeg;
}

function remove_all_div_by_key(key, doc) {
    var st = doc.querySelectorAll('div');
    var st_f1 = Array.prototype.filter.call(st, f => { return (Array.prototype.findIndex.call(f.classList, fi => { return fi.includes(key) }) != -1) || (f.id.toString().includes(key)) });
    st_f1.forEach(item => {
        item.parentNode.removeChild(item);
    });
}

//test_data();
function test_data() {
    $('#input_domain').val('seoulnews24h.com');
    $('#input_user').val('admin');
    $('#input_pass').val('2aAO DAub v2om qJjG LNvF OPBG');

}


async function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}
async function waitingForNext(time) {
    // console.log('waiting...')
    let delayres = await delay(time);
}

function get_domain(url) {
    var str = url.replace('www.', '');
    return str.split('//')[1].split('.')[0];
}