const express = require('express');
const router = express.Router(); // Use express.Router to define routes
const mysql = require('mysql2/promise');

const creds = require('../config/creds.json');
const pool = mysql.createPool(creds);

// Example route
router.get('/', (req, res) => {
    res.send('Hello, World!');
});

router.post('/post', async (req, res) => {
    const body = req.body;
    const [rows, fields] = await pool.execute('INSERT INTO members (psid, email, password, first, last, discord) VALUES (?, ?, ?, ?, ?, ?)', [
        body.psid, body.email, body.password, body.first, body.last, body.discord
    ]);
    res.json({ "Status": "Success" });
});

router.get('/get', async (req, res) => {
    const id = req.query.id;
    let test;

    if (id) {
        try {
            const [rows, fields] = await pool.execute('SELECT * FROM members WHERE id = ?', [id]);

            console.log(rows);

            if (rows.length > 0) {
                test = rows.map(row => {
                    return `
                        <div>
                            <p><strong>ID</strong>: ${row.id}</p>
                            <p><strong>PSID</strong>: ${row.psid}</p>
                            <p><strong>Email</strong>: ${row.email}</p>
                            <p><strong>First</strong>: ${row.first}</p>
                            <p><strong>Last</strong>: ${row.last}</p>
                            <p><strong>Discord</strong>: ${row.discord}</p>
                        </div>
                    `;
                }).join('');
            }
        } catch (err) {
            return res.status(500).send("Error: " + err.message);
        }
    }

    res.render('index', { test });
});

// Export the router for use in app.js
module.exports = router;
