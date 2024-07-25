'use strict'

const util = require('util')
const mysql = require('mysql2')
const db = require('../db')
// const session = require('express-session');

module.exports = {
    get: (req, res) => {
        let sql = 'select * from slot'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    detail: (req, res) => {
        // let is_admin = req.params.is_admin || false;
        let sql = 'select * from slot where id = ? limit 1;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response[0]);
        })
    },
    update: (req, res) => {
        let data = req.body;
        let id = req.params.id;
        let sql = 'UPDATE slot SET ? WHERE id = ?;'
        db.query(sql, [data, id], (err, response) => {
            if (err) throw err
            res.json({ ok: 1, id })
        })
    },
    store: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO slot SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({ ok: 1, id: response.insertId })
        })
    },
    delete: (req, res) => {
        let sql = 'DELETE FROM slot WHERE id = ?'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
}
