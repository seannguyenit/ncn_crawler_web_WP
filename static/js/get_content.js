'use strict'
var is_test = 0;
// const r_url = "https://arthurtech.xyz/";
const r_url = "/api/fproxy";
// const r_url = "/proxy/";
const arr_type = ['.jpg', '.png', '.jpeg', '.img'];
const arr_black_type = ['.img'];

const arr_element_find = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'img', 'a', 'section', 'article', 'strong', 'small'];
const arr_white_attributes = ['src', 'alt'];

async function get_content(url) {
    try {

        return await fetch(
            r_url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            }
        ).then(function (response) {
            // The API call was successful!
            return response.json();
        }).then(async function (rs) {
            var html = rs.result;
            if (html.error) {
                return { error: html.error };
            }
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
                sub_title = remove_author_in_title(sub_title);
                title = sub_title;
            } else {
                title = remove_author_in_title(title);
            }

            var og_img = doc.querySelector('[property="og:image"]');
            var thumbnail = (og_img) ? og_img.content : null;
            if (!thumbnail) {
                var tg_div = Array.prototype.filter.call(doc.querySelectorAll('div'), f => {
                    return (Array.prototype.findIndex.call(f.classList, fi => {
                        return fi.includes('featured-image')
                    }) != -1) || (f.id.toString().includes('featured-image'))
                })[0];
                if (tg_div && (tg_div.querySelector('img') || tg_div.querySelector('image'))) {
                    thumbnail = (tg_div.querySelector('img') || tg_div.querySelector('image')).src;
                }
            }
            var body_ = '';
            var converted_ = [];
            var content_ = '';
            var arr_domain = ['postshare', 'dispatch', 'issuepos', 'popularne'];

            if (check_body_old_type(doc)) {
                arr_domain.push(domain_);
            }

            // if (arr_domain.indexOf(domain_) != -1) {
            body_ = await get_main_intelligent(doc, domain_);
            converted_ = await get_all_media(body_, (new URL(url)).origin);
            await remove_img_null(body_);
            body_.innerHTML = body_.innerHTML.replaceAll('&nbsp;', '').replaceAll('&amp;', '').replaceAll('&lt;', ' ').replaceAll("\n", "").replaceAll("\t", "").replaceAll("&quot;", "");
            await remove_head_after(body_)
            await remove_attributes(body_);
            content_ = body_.innerHTML
            // } else {
            //     body_ = await get_main_intelligent_new(doc);
            //     converted_ = await get_all_media_new(body_, 'https://' + doc.domain);
            //     await remove_img_null(body_);
            //     await remove_attributes(body_);
            //     content_ = body_.innerText.replaceAll("&quot;", "");
            //     content_ = '<p>' + content_ + '</p>'
            //     if (converted_) {
            //         for (var i of converted_) {
            //             if ((i) && (!i.is_del) && ((i.media_id || 0) > 0)) {
            //                 content_ = insert_img_to_text(content_, i);
            //             }
            //         }
            //     }
            // }
            var media_id = 0;
            var thumb_url = ""
            // content_ = content_.replaceAll(domain_, document.getElementById('input_domain').value.split('.')[0]);
            if (converted_.length > 0) {
                if (thumbnail) {
                    var img_thumb = await upload_and_replace_url(thumbnail);
                    if (img_thumb.media_id) {
                        media_id = img_thumb.media_id;
                        thumb_url = img_thumb.converted_url;
                    }
                } else {
                    var sl_mde = converted_.find(f => { return (f) && f.media_id });
                    if (sl_mde) {
                        media_id = converted_.find(f => { return (f) && f.media_id }).media_id || 0;
                        thumb_url = converted_.find(f => { return (f) && f.media_id }).converted_url || "";
                    }
                }

            } else {
                if (thumbnail) {
                    var img_thumb2 = await upload_and_replace_url(thumbnail);
                    if (img_thumb2.media_id) {
                        media_id = img_thumb2.media_id;
                        thumb_url = img_thumb2.converted_url;
                    }
                }
            }
            title = title.replaceAll(domain_, '');
            // console.log(content_);
            try {
                content_ = decodeURIComponent(content_);
            } catch (error) {
                console.log("Error URI !");
            }
            content_ = content_.replaceAll(/<!--(.*?)-->/gm, "");
            content_ = content_.replaceAll(/&nbsp;/g, '');
            content_ = content_.replaceAll('&gt;', '');
            content_ = content_.replaceAll('  ', '');
            return { title: title, content: content_, media: (media_id || 0), thumb_url: thumb_url };

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


function remove_author_in_title(sub_title) {
    if (sub_title.indexOf(' - ') > -1) {
        sub_title = sub_title.split(' - ').slice(0, sub_title.split(' - ').length - 1)[0];
    }
    if (sub_title.indexOf(' – ') > -1) {
        sub_title = sub_title.split(' – ').slice(0, sub_title.split(' – ').length - 1)[0];
    }
    if (sub_title.indexOf(' | ') > -1) {
        sub_title = sub_title.split(' | ').slice(0, sub_title.split(' | ').length - 1)[0];
    }
    if (sub_title.indexOf(' @') > -1) {
        sub_title = sub_title.split(' @').slice(0, sub_title.split(' @').length - 1)[0];
    }
    if (sub_title.indexOf('：') > -1) {
        sub_title = sub_title.split('：').slice(0, sub_title.split('：').length - 1)[0];
    }
    return sub_title;
}

async function get_all_media(body_, origin_domain) {
    var media_ = [];
    var lst_all_img = body_.querySelectorAll('img');
    lst_all_img.forEach(ii => {
        ii.src = ii.src.replaceAll(window.location.origin, origin_domain);
    })
    Array.prototype.forEach.call(lst_all_img, f => {
        if (!f.src || (arr_type.findIndex(fi => { return f.src.includes(fi) }) != -1)) {
            if (f.dataset.original && (arr_type.findIndex(fi => { return f.dataset.original.includes(fi) }) != -1)) {
                f.src = f.dataset.original;
            } else if (f.dataset.breeze && (arr_type.findIndex(fi => { return f.dataset.breeze.includes(fi) }) != -1)) {
                f.src = f.dataset.breeze;
            }
        } else {
            if (f.src.includes('assets') || f.src.includes('facebook') || f.src.includes('gif') || f.src.includes('data:') || f.src.includes('.svg')) {
                // if (!f.dataset.src) {
                if (f.dataset.original && (arr_type.findIndex(fi => { return f.dataset.original.includes(fi) }) != -1)) {
                    f.src = f.dataset.original;
                } else if (f.dataset.breeze && (arr_type.findIndex(fi => { return f.dataset.breeze.includes(fi) }) != -1)) {
                    f.src = f.dataset.breeze;
                } else {
                    f.parentElement.removeChild(f);
                }
                // }
            }
        }
        if (f.src && f.src.length > 0) {
            media_.push(f);
        }
    });
    if (media_.length == 0) {
        Array.prototype.forEach.call(lst_all_img, f => {
            var dt_src = '';
            if ((f.dataset.src) && (arr_type.findIndex(fi => { return f.dataset.src.includes(fi) }) != -1)) {
                dt_src = f.dataset.src;

            }
            if (dt_src && dt_src.length > 0) {
                if (!dt_src.startsWith(origin_domain) && dt_src.startsWith('/')) {
                    dt_src = origin_domain + dt_src;
                    f.src = dt_src;
                } else {
                    var found_url = dt_src.split('"').find(find => { return arr_type.findIndex(f_i => { return find.includes(f_i) }) != -1 });
                    if (found_url) {
                        found_url = found_url.replace('https', '').replace('//', '');
                        f.src = 'https://' + found_url;
                    }
                }
                if (arr_black_type.findIndex(fb => { return f.src.includes(fb) }) != -1) {
                    f.src = f.src.replace(arr_black_type[arr_black_type.findIndex(fb => { return f.src.includes(fb) })], '.jpg');
                }
                media_.push(f);
            }
        });
    }
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
    media_ = Array.prototype.filter.call(media_, f => { return !f.src.includes('assets') && !f.src.includes('facebook') && !f.src.includes('gif') && !f.src.includes('logo') && !f.src.includes('data:') });
    Array.prototype.forEach.call(media_, f => {
        if (!f.src.includes('http')) {
            f.src = full_domain_ + f.src;
        }
        // f.src = f.src.replace('.img', '');
    });
    //console.log(media_);
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
                    console.log(img_.alt);
                    convert_img.text = img_.alt;
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
        content_ = content_.replace(img.text, `<img src="${img.converted_url}"></img><p>${img.text}</p>`);
    } else {
        content_ += `<img src="${img.converted_url}"></img><p>${img.text}</p>`;
    }
    return content_;
}

/**
 * 
 * @param {*} file_url 
 * @returns return {media_id, root_url, converted_url, thumbnail}
 */

async function upload_and_replace_url(file_url) {
    try {
        file_url = decodeURIComponent(file_url);
        if (file_url.indexOf('url=') > -1) {
            file_url = file_url.slice(file_url.indexOf('url=') + 4);
            if (file_url.indexOf('&') != -1) {
                file_url = file_url.slice(0, file_url.indexOf('&'));
            }
        }
        if (file_url.lastIndexOf('https') > 0) {
            var s = file_url.slice(file_url.lastIndexOf('https'));
            if (s.indexOf('?') != -1) {
                s = s.slice(0, s.indexOf('?'));
            }
            if (s.indexOf('&') != -1) {
                s = s.slice(0, s.indexOf('&'));
            }
            file_url = s;
        }
        if (file_url.indexOf('http') == -1) {
            file_url = 'https://' + file_url;
        }
        if (file_url.indexOf(' ') > -1) {
            file_url = file_url.split(' ')[0];
        }
        if (file_url.includes('?')) {
            file_url = file_url.split('?')[0];
        }
        if (file_url.includes('://:')) {
            file_url = file_url.replace('://:', '://')
        }
        if (arr_black_type.findIndex(fb => { return file_url.includes(fb) }) != -1) {
            file_url = file_url.replace(arr_black_type[arr_black_type.findIndex(fb => { return file_url.includes(fb) })], '.jpg');
        }
        var root_url = document.getElementById('input_domain').value;
        var host = `https://${root_url}/wp-json/wp/v2/media`;
        if (is_test == 1) {
            host = `${root_url}wp-json/wp/v2/media`;
        }
        var user = document.getElementById('input_user').value;
        var pass = document.getElementById('input_pass').value;
        // var file_name = file_url.split('/').at(-1);
        // var file_ = await get_blob_from_url();
        // const formData = new FormData();
        // formData.append("file", file_, file_name);

        var au_str = `Basic ${encode_base64(user, pass)}`;
        var data_rs;
        data_rs = await upload_old_version(file_url, au_str, host);
        if (!data_rs || (data_rs && data_rs.code == 'rest_upload_unknown_error')) {
            var new_up_rs = await post_url_image_fromSV(file_url, host, au_str);
            if (new_up_rs && new_up_rs.rs) {
                data_rs = new_up_rs.rs;
            }
        }
        if (!data_rs) return null;
        var thumb = data_rs.source_url;
        if (data_rs.media_details && data_rs.media_details.sizes && data_rs.media_details.sizes.thumbnail) {
            thumb = data_rs.media_details.sizes.thumbnail.source_url;
        }
        return { media_id: data_rs.id, root_url: file_url, converted_url: data_rs.source_url, thumbnail: thumb }
    } catch (error) {
        console.log(error);
        return null;
    }
    return null;
}

async function post_url_image_fromSV(url_image, url_post, key) {
    return await fetch('/api/up_image_fromSV', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url_image: url_image, url_post: url_post, key: key })
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function get_blob_from_url(url_) {
    let response = await fetch('/proxy/' + url_).then(r => r.blob());
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
        await waitingForNext(2000);
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
    return (select_content_located);
}

/**
 * Nếu đổi thì đổi cả bên extentions
 * @param {*} doc 
 * @returns 
 */
async function get_main_intelligent(doc, domain_) {
    var select_content_located = null;
    if (domain_ == 'pagesix') {
        select_content_located = doc.body.getElementsByClassName('article-header')[0];
    }
    if (!select_content_located) {
        select_content_located = doc.body.querySelector('article');
    }
    if (!select_content_located) {
        select_content_located = doc.body.querySelector('precontent')
    }
    if (!select_content_located) {
        select_content_located = doc.body.querySelector('pre')
    }
    if (!select_content_located) {
        select_content_located = doc.getElementById('node-content')
    }
    if (!select_content_located) {
        select_content_located = doc.body
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

        // case 'coms.pub':
        //     select_content_located = doc.getElementById('node-content');
        //     break;
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
    element.querySelectorAll('Header').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('meta').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('amp-ad').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('link').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('noscript').forEach(item => {
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
    element.querySelectorAll('hr').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('br').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('form').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('notify').forEach(item => {
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
    element.querySelectorAll('dl').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('ol').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('i').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('aside').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('wp-ad').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('svg').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('source').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('figcaption').forEach(item => {
        item.parentNode.removeChild(item)
    });
    element.querySelectorAll('time').forEach(item => {
        item.parentNode.removeChild(item)
    });


    remove_all_hidden_div(element);

    element.querySelectorAll('[style]').forEach(item => {
        item.removeAttribute('style')
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
    remove_all_div_by_key('elementSectionHeading', element);
    remove_all_div_by_key('head', element, ['headling']);
    remove_all_div_by_key('nav', element);
    remove_all_div_by_key('foot', element);
    remove_all_div_by_key('Footer', element);
    remove_all_div_by_key('footer', element);
    remove_all_div_by_key('aside', element);
    remove_all_div_by_key('sm_dfp_ads', element);
    remove_all_div_by_key('comment', element);
    remove_all_div_by_key('gsb-wrapper', element);
    remove_all_div_by_key('relatedArticle', element);
    remove_all_div_by_key('related', element);
    remove_all_div_by_key('author-', element);
    remove_all_div_by_key('Author', element);
    remove_all_div_by_key('carousel-', element);
    remove_all_div_by_key('sharing-', element);
    remove_all_div_by_key('rail-body-container', element);
    remove_all_div_by_key('read-more-container', element);
    remove_all_div_by_key('more-on', element);
    remove_all_div_by_key('rss_widget', element);
    remove_all_div_by_key('nextpage', element);
    remove_all_div_by_key('advertisement', element);
    remove_all_div_by_key('entry__author', element);
    remove_all_div_by_key('socialButton', element);
    remove_all_div_by_key('clmn', element);
    remove_all_div_by_key('modal', element);
    remove_all_div_by_key('sidebar', element);
    remove_all_div_by_key('btn-category', element);
    remove_all_div_by_key('navigation', element);
    remove_all_div_by_key('pagenation', element);
    remove_all_div_by_key('articleRelatedPosts', element);
    remove_all_div_by_key('postsSubHeading', element);
    remove_all_div_by_key('rankingHeading', element);
    remove_all_div_by_key('LinkCard', element);
    remove_all_div_by_key('AsideArticleFocusOnModule', element);
    remove_all_div_by_key('AsideArticleTogetherModule', element);
    remove_all_div_by_key('btn', element);
    remove_all_div_by_key('Button', element);
    remove_all_div_by_key('entry-utility-article', element);
    remove_all_div_by_key('recommend', element);
    remove_all_div_by_key('yarpp-related', element);
    remove_all_div_by_key('specialContent', element);
    remove_all_div_by_key('google', element);
    remove_all_div_by_key('relation-', element);
    remove_all_div_by_key('fb-', element);
    remove_all_div_by_key('bread-crumb', element);
    remove_all_div_by_key('fb_box', element);
    remove_all_div_by_key('et_social', element);
    remove_all_div_by_key('frame', element);
    remove_all_div_by_key('recomm-news', element);
    remove_all_div_by_key('compass-fit-widget', element);
    remove_all_div_by_key('fb_fans', element);
    remove_all_div_by_key('menu_page', element);
    remove_all_div_by_key('part_txt_1', element);
    remove_all_div_by_key('moreArticle', element);
    remove_all_div_by_key('Btn', element);
    remove_all_div_by_key('appDownload', element);
    remove_all_div_by_key('advertise', element);
    remove_all_div_by_key('checkIE', element);
    remove_all_div_by_key('sexmask', element);
    remove_all_div_by_key('randBlock1', element);
    remove_all_div_by_key('article_community_box', element);
    remove_all_div_by_key('guangxuan', element);
    remove_all_div_by_key('article_keyword', element);
    remove_all_div_by_key('post_next', element);
    remove_all_div_by_key('post_statement', element);
    remove_all_div_by_key('qrcode', element);
    remove_all_div_by_key('post_side', element);
    remove_all_div_by_key('dontprint', element);
    remove_all_div_by_key('compass-fit', element);
    remove_all_div_by_key('jubao', element);
    remove_all_div_by_key('promote-', element);
    remove_all_div_by_key('post-title', element); //xoa di tieu de trong content vi cai title no tu dong tro thanh tieu de trong content roi
    remove_all_div_by_key('popup', element);
    remove_all_div_by_key('search-container', element);

    remove_all_tab_by_key('entry-footer', element, 'section');
    remove_all_tab_by_key('thumbnail_url', element, 'span');
    remove_all_tab_by_key('next', element, 'a');
    remove_all_tab_by_key('qrcode', element, 'a');
    remove_all_tab_by_key('button', element, 'a');
    remove_all_tab_by_key('p-articleImgSrc', element, 'p');
    remove_all_tab_by_key('blockquote', element, 'p');



    element.querySelectorAll('[loading="lazy"]').forEach(item => {
        item.removeAttribute('loading');
    });
    element.querySelectorAll('[class]').forEach(item => {
        item.removeAttribute('class')
    });
    Array.from(element.querySelectorAll('section')).forEach((item) => {
        var new_p = document.createElement('p');
        new_p.innerHTML = item.innerHTML;
        item.replaceWith(new_p);
    });


}
async function remove_img_null(element) {
    //remove all blank div
    Array.prototype.filter.call(element.querySelectorAll('img'), f => { return f.src.length == 0 }).forEach(item => {
        item.parentNode.removeChild(item)
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
        if (!item.querySelector('img') && item.innerText.length == 0) {
            item.parentNode.removeChild(item);
        }
    });
    element.querySelectorAll('figure').forEach(item => {
        Array.prototype.forEach.call(item.attributes, attribute => item.removeAttribute(attribute.name))
        if (!item.querySelector('img') && item.innerText.length == 0) {
            item.parentNode.removeChild(item);
        } else {
            item.parentElement.innerHTML.replace(item.outerHTML, item.outerHTML.replaceAll('figure', 'p'))
        }
    });

    element.innerHTML = element.innerHTML.replaceAll('<noscript>', '').replaceAll('</noscript>', '');
    element.innerHTML = element.innerHTML.replaceAll('<div', '<p').replaceAll('</div>', '</p>');
    element.innerHTML = element.innerHTML.replaceAll('<picture>', '').replaceAll('</picture>', '');
    element.innerHTML = element.innerHTML.replaceAll('<section>', '').replaceAll('</section>', '');
    element.innerHTML = element.innerHTML.replaceAll('<center>', '').replaceAll('</center>', '');
    element.innerHTML = element.innerHTML.replaceAll('<article', '<p').replaceAll('</article>', ',</p>');
    element.innerHTML = element.innerHTML.replaceAll('<main', '<p').replaceAll('</main>', ',</p>');
    element.innerHTML = element.innerHTML.replaceAll('<big', '<p').replaceAll('</big>', ',</p>');
    element.innerHTML = element.innerHTML.replaceAll('<small', '<p').replaceAll('</small>', ',</p>');
    element.innerHTML = element.innerHTML.replaceAll('<label', '<p').replaceAll('</label>', ',</p>');

}

async function remove_attributes(element) {
    arr_element_find.forEach(f => {
        var all_ele = element.querySelectorAll(f);
        for (var fe of all_ele) {
            var atts = Array.prototype.map.call(fe.attributes, m => { return m.name });
            for (var att of atts) {
                if (arr_white_attributes.indexOf(att) == -1) {
                    fe.removeAttribute(att);
                }
            }
        }
    });
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
async function save_posts(url, user, pass, title, content, media, thumb_img) {
    var data = `title=${title}&content=${content}&status=publish&featured_media=${media}&show_in_rest=true&meta.og:image.content=${thumb_img}`;
    // data.excerpt = {};
    var au_str = `Basic ${encode_base64(user, pass)}`;
    var url = `https://${url}/wp-json/wp/v2/posts`
    if (is_test == 1) {
        var t = $('#input_domain').val();
        url = `${t}wp-json/wp/v2/posts`;
    }
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

function remove_all_div_by_key(key, doc, key_excludes = []) {
    var st = doc.querySelectorAll('div');
    var st_f1 = Array.prototype.filter.call(st, f => {
        return (Array.prototype.findIndex.call(f.classList, fi => {
            return (fi.includes(key) && (key_excludes.findIndex(ke => fi.includes(ke)) === -1))
        }) != -1) || (f.id.toString().includes(key))
    });
    st_f1.forEach(item => {
        item.parentNode.removeChild(item);
    });
}

function remove_all_hidden_div(doc) {
    var st = doc.querySelectorAll('div[style="display:none;"]');
    st.forEach(item => {
        item.parentNode.removeChild(item);
    });
}

function remove_all_tab_by_key(key, doc, tab) {
    var st = doc.querySelectorAll(tab);
    var st_f1 = Array.prototype.filter.call(st, f => {
        return (Array.prototype.findIndex.call(f.classList, fi => {
            return fi.includes(key)
        }) != -1) || (f.id.toString().includes(key))
    });
    st_f1.forEach(item => {
        item.parentNode.removeChild(item);
    });
}


//test_data();
function test_data() {
    is_test = 1;
    $('#input_domain').val('http://abc.com:9999/');
    $('#input_user').val('admin');
    $('#input_pass').val('Thinh_250892');

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
    return (new URL(url)).hostname;
}

async function upload_old_version(file_url, au_str, host) {
    var file_name = (new Date()).getTime().toString() + '.png';
    var file_ = await get_blob_from_url(file_url);
    if (!file_) return null;
    const formData = new FormData();
    formData.append("file", file_, file_name);
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
            return null;
        });
    return data_rs;
}