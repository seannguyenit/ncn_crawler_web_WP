'use strict'

const util = require('util')
const mysql = require('mysql2')
const db = require('./../db')
// const session = require('express-session');

module.exports = {
    get: (req, res) => {
        let sql = 'select * from fbuid'
        db.query(sql, (err, response) => {
            if (err) throw err
            res.json(response)
        })
    },
    getByAcc: (req, res) => {
        let sql = 'select * from fbuid where account = ? limit 1'
        db.query(sql, [req.params.account], (err, response) => {
            if (err) throw err
            res.json(response);
        })
    },
    getBySlotId: (req, res) => {
        let sql = 'select * from fbuid where slotId = ?;'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response);
        })
    },
    detail: (req, res) => {
        // let is_admin = req.params.is_admin || false;
        let sql = 'select * from fbuid where id = ? limit 1'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json(response);
        })
    },
    update: (req, res) => {
        let data = req.body;
        let id = req.params.id;
        let sql = 'UPDATE fbuid SET ? WHERE id = ?;'
        db.query(sql, [data, id], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },
    updateBigData: async (req, res) => {
        const batchSize = 1000; // Number of records to update in each batch
        const records = req.body; // Array of objects

        try {
            if (!Array.isArray(records)) {
                throw new Error('Input must be an array of objects');
            }

            for (let i = 0; i < records.length; i += batchSize) {
                const batch = records.slice(i, i + batchSize);

                const sql = `
        UPDATE fbuid 
        SET uid = CASE
          ${batch.map(() => 'WHEN account = ? THEN ?').join(' ')}
          ELSE uid
        END,
        token = CASE
          ${batch.map(() => 'WHEN account = ? THEN ?').join(' ')}
          ELSE token
        END
        WHERE account IN (${batch.map(() => '?').join(',')})
      `;

                const params = [
                    ...batch.flatMap(record => [record.account, record.uid]),
                    ...batch.flatMap(record => [record.account, record.token]),
                    ...batch.map(record => record.account)
                ];
                await new Promise((resolve, reject) => {
                    db.query(sql, params, (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                });
            }

            res.json({ ok: 1, message: `${records.length} records updated successfully` });
        } catch (error) {
            console.error('Error updating records:', error);
            res.status(500).json({ ok: 0, message: 'Error updating records: ' + error.message });
        }
    },
    store: (req, res) => {
        let data = req.body;
        let sql = 'INSERT INTO fbuid SET ?;'
        db.query(sql, [data], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },
    storeBigData: (req, res) => {
        let data = req.body;
        const newValues = data.map(record => [record.slotId, record.account, record.password, record.uid, record.token]);
        const insertSql = 'INSERT INTO fbuid (slotId, account, password, uid, token) VALUES ?';
        db.query(insertSql, [newValues], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },
    getByMultiAcc: (req, res) => {
        let data = req.body;
        const dt = [...new Set(data)];
        const checkExistingSql = 'SELECT * FROM fbuid WHERE account IN (?)';
        db.query(checkExistingSql, [dt], (err, response) => {
            if (err) throw err
            res.json(response);
        })
    },
    delete: (req, res) => {
        let sql = 'DELETE FROM fbuid WHERE id = ?'
        db.query(sql, [req.params.id], (err, response) => {
            if (err) throw err
            res.json({ message: 'Delete success!' })
        })
    },
    deleteMultiple: (req, res) => {
        let data = req.body;
        const dt = [...new Set(data)];
        let sql = 'DELETE FROM fbuid WHERE id IN (?)'
        db.query(sql, [dt], (err, response) => {
            if (err) throw err
            res.json({ ok: 1 })
        })
    },
}
