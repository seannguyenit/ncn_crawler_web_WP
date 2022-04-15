'use strict'

const util = require('util')
const mysql = require('mysql')
const db = require('./../db')
// const session = require('express-session');

module.exports = {
    get: (req, res) => {
        let sql = 'select * from tool_lib'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req, res) => {
        // let is_admin = req.params.is_admin || false;
        let sql = 'select * from tool_lib where id = ? limit 1'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response);
        })
    },
    update: (req, res) => {
        let data = req.body;
        let id = req.params.id;
        let sql = 'UPDATE tool_lib SET ? WHERE id = ?;'
        db.query(sql, [data, id], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },
    store: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO tool_lib SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },
    delete: (req, res) => {
        let sql = 'DELETE FROM tool_lib WHERE id = ?'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
}
