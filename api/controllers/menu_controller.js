'use strict'

const util = require('util')
const mysql = require('mysql2')
const db = require('./../db')
// const session = require('express-session');

module.exports = {
    get_template: (req, res) => {
        let sql = 'CALL `get_all_menu_template`();'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    get_by_user: (req, res) => {
        let sql = 'CALL `get_all_menu_by_user`(?);'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    add_menu: (req, res) => {
        // var data = JSON.stringify(req.body)
        let sql = 'delete from user_menu where `user_menu`.`user_id` = ?'
        db.query(sql, [req.params.user_id], (err, response) => {
            if (err) throw err
            // res.json({ message: 'Insert success!' })
        })
        sql = 'INSERT INTO `user_menu`(`menu_id`,`stt`,`user_id`) VALUES ?;'
        db.query(sql, [req.body], (err, response) => {
            if (err) throw err
            res.json({ message: 'Insert success!' })
        })
    },
    get_web_info: (req, res) => {
        let sql = 'select * from web_info where type = ? limit 1'
        db.query(sql, [req.params.type], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    update_web_info: (req, res) => {
        let sql = 'update web_info set ? where type = ? limit 1'
        db.query(sql, [req.body, req.params.type], (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
}