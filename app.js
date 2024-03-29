const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(express.json())
app.use(cors())

const PUERTO = process.env.PUERTO || 3001

app.listen(PUERTO, () => {
    console.log(`el servidor esta escuchando en el puerto ${PUERTO}....`)
})

const config = require('./config.js')
const mysql = require('mysql2')
const connection = mysql.createConnection(config) 

connection.connect((err) => {  
    if (err) throw err;  
    console.log("Conectado!");  
}); 

app.get('/', (req, res) => {
    connection.query(
        'SELECT * FROM `form_services`',
        (err,results) => {
            res.send(results)
        }
    )
})

app.get('/:id', (req, res) => {
    const id = req.params.id
    connection.query(
        'SELECT * FROM `form_services` WHERE `id_form` = ?',  
        id,
        (err, results) => {
            if (err) {
                console.log(err)

                return
            }

            res.status(200).send(results[0])
        }
    ) 
})

app.post('/api/review', (req, res) =>  {
    const user_name = req.body.user_name
    const title = req.body.title
    const post_text = req.body.post_text

    connection.query(
        'INSERT INTO form_services (user_name, title, post_text) VALUES (?, ?, ?)',
        [user_name, title, post_text],
        (err, results) => {
            if (err) {
                console.log(err)
                
                return
            }

            let r = {
                id_form: results.insertId, 
                user_name: user_name,
                title: title,   
                post_text: post_text,
            }

            res.send(r)
        }
    )
})

app.put('/api/review/:id', (req, res) => {
    const id = req.params.id
    const user_name = req.body.user_name
    const title = req.body.title
    const post_text = req.body.post_text

    connection.query(
        'UPDATE form_services SET user_name = ?, title = ?, post_text = ? WHERE id_form = ?',
        [user_name, title, post_text, id],
        (err, results) => {
            if (err) {
                console.log(err)

                return
            }
        
            res.status(200).end()
        }
        )
})

app.delete('/api/review/:id', (req, res) => {
    const id = req.params.id

    connection.query(
        'DELETE FROM form_services WHERE id_form = ?', 
        id,
        (err, results) => {
            if (err) {
                console.log(err)

                return
            }

            res.status(200).end()
        }
    )

    
})

function delay(ms) {
    const date = Date.now();
    let currentDate = null;

    do {
        currentDate = Date.now();
    } while (currentDate - date < ms);
}