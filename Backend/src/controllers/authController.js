const db = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
        }

        res.status(201).json({
          message: 'Usuário criado com sucesso',
          id: result.insertId
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Senha inválida' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        'segredo',
        { expiresIn: '1d' }
      );

      res.json({ token });
    }
  );
};
