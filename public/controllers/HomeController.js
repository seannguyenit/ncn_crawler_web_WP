'use strict'
const path = require('path')

module.exports = {
    get_login_page: (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/new_login.html'))
    },
    notice:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/notice.html'))
    },
    content:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/get_content.html'))
    },
    filter_str:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/filter_str.html'))
    },
    dis_str:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/dis_str.html'))
    },
    user:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/user.html'))
    },
    tool_lib:  (req, res) => {
        res.sendFile(path.join(__dirname,'../../view/tool_lib.html'))
    },
    // get_partial: (req,res)=>{
    //     let action = [req.params.action];
    //     res.sendFile(path.join(__dirname,`../../view/partial/${action}.html`))
    // },
}