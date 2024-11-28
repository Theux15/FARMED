const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');  // Adicione esta linha //npm init -y // npm install express mysql2 body-parser

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Adicione esta linha para permitir requisições de outros domínios


// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'farmed_db'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota de cadastro de usuários
app.post('/register', (req, res) => {
    const { nome_usuario, senha } = req.body;

    // Criptografar a senha
    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        // Inserir o usuário no banco de dados
        const query = 'INSERT INTO usuarios (nome_usuario, senha) VALUES (?, ?)';
        db.query(query, [nome_usuario, hash], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.status(201).json({ message: 'Usuário registrado com sucesso!' });
        });
    });
});

// Rota de login de usuários
app.post('/login', (req, res) => {
    const { nome_usuario, senha } = req.body;

    // Verificar se o usuário existe no banco de dados
    const query = 'SELECT * FROM usuarios WHERE nome_usuario = ?';
    db.query(query, [nome_usuario], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuário não encontrado!' });
        }

        const user = results[0];

        // Comparar a senha fornecida com a senha armazenada
        bcrypt.compare(senha, user.senha, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Senha incorreta!' });
            }

            // Gerar um token JWT
            const token = jwt.sign({ id: user.id }, 'seu_segredo_jwt', { expiresIn: '1h' });

            res.status(200).json({ message: 'Login bem-sucedido!', token });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

