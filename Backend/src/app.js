console.log('APP ATUALIZADO CARREGADO');
const express = require('express');
const app = express();

app.use(express.json());

const connection = require('./database');

app.get('/teste', (req, res) => {
  res.send('Rota funcionando');
});

app.get('/', (req, res) => {
  connection.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro no banco');
    }

    res.json(results);
  });
});

app.post('/usuarios', (req, res) => {
  const { nome, email } = req.body;

  connection.query(
    'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
    [nome, email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao cadastrar');
      }

      res.status(201).json({
        mensagem: 'Usuário criado com sucesso',
        id: result.insertId
      });
    }
  );
});

module.exports = app;

app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  const sql = 'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?';

  connection.query(sql, [nome, email, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao atualizar usuário');
    }

    res.json({
      mensagem: 'Usuário atualizado com sucesso'
    });
  });
});