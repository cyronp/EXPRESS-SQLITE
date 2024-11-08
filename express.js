const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database('./itemsdb.sqlite', (err) => {
    if(err) {
        console.err('ERROR');
    } else {
        console.log('REALIZADO COM SUCESSO');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    descricao TEXT,
    dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP)`, (err) => {
        if (err) {
            console.error('Erro ao criar a tabela');
        }
});

app.post('/items', (req, res) => {
    const { name, descricao } = req.body;
    const query = `INSERT INTO items (name, descricao) VALUES (?, ?)`;

    db.run(query, [name, descricao], (err) => {
        if(err) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(201).json({ id: this.lastID, name, descricao });
        }
    })
});

app.get('/items', (req, res) => {
    const query = `SELECT * FROM items`;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(200).json(rows);
        }
    });
});

// GET PELO ID
app.get('/items/:id',(req,res) => {
    const query = `SELECT * FROM items WHERE ID = ?`
    const param = [req.params.id]
    
    db.get(query, param, (err, row) =>{
        if(err){
            res.status(400).json({"error":err.message});
        } else {
            res.json({
                "message":"PESQUISA REALIZADA COM SUCESSO",
                "data":row
            })
        }
    });
});

// PUT
app.put('/items/:id', (req, res) => {
    const query = `UPDATE items SET name = ?, descricao = ? WHERE id = ?`;
    const id = req.params.id;
    const name = req.body.name;
    const descricao = req.body.descricao;

    db.run(query, [name, descricao, id], (err) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            message: "success",
            data: { id, name, descricao }
        });
    });
});

// PATCH
app.patch('/items/:id', (req, res) => {
    const query = `UPDATE items SET name = COALESCE(?,name), descricao = COALESCE(?,descricao) WHERE id = COALESCE(?,id)`;
    const id = req.params.id;
    const name = req.body.name;
    const descricao = req.body.descricao;
    
    db.run(query, [name, descricao, id], (err) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            message: "success",
            data: { id, name, descricao }
        });
    });
    
});

// DELETE
app.delete('/items/:id',(req,res) => {
    const query = `DELETE FROM items WHERE ID = ?`
    const param = [req.params.id]
    
    db.get(query, param, (err, row) =>{
        if(err){
            res.status(400).json({"error":err.message});
        } else {
            res.json({
                "message":"EXCLUIDO COM SUCESSO",
                "data":row
            })
        }
    });
});

app.listen(port, () => {
    console.log("Servidor rodando na porta http://localhost:3000");
})