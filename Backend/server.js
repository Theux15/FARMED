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
    host: 'sql10.freesqldatabase.com',
    port: 3306,
    user: 'sql10748412',
    password: 'mjNujtIggN',
    database: 'sql10748412'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Middleware para autenticação
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'seu_segredo_jwt', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Middleware para proteger rotas
function protectRoute(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.redirect('/login.html');
    }

    jwt.verify(token, 'seu_segredo_jwt', (err, user) => {
        if (err) {
            return res.redirect('/login.html');
        }
        req.user = user;
        next();
    });
}

// Rota de cadastro de usuários
app.post('/register', (req, res) => {
    const { nome_usuario, email, senha } = req.body;

    // Criptografar a senha
    bcrypt.hash(senha, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        }

        // Inserir o usuário no banco de dados
        const query = 'INSERT INTO usuarios (nome_usuario, email, senha) VALUES (?, ?, ?)';
        db.query(query, [nome_usuario, email, hash], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err });
            }
            res.status(201).json({ message: 'Usuário registrado com sucesso!' });
        });
    });
});

// Rota de login de usuários
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Verificar se o usuário existe no banco de dados
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
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

// Rota para salvar pontuação do quiz
app.post('/save-score', authenticateToken, (req, res) => {
    const { pontuacao, quiz } = req.body;
    const usuario_id = req.user.id;
    const table = quiz === 1 ? 'pontuacoes' : 'pontuacoes2';

    const query = `INSERT INTO ${table} (usuario_id, pontuacao) VALUES (?, ?)`;
    db.query(query, [usuario_id, pontuacao], (err, result) => {
        if (err) {
            console.error('Erro ao salvar pontuação:', err);
            return res.status(500).json({ error: 'Erro ao salvar pontuação' });
        }
        res.status(201).json({ message: 'Pontuação salva com sucesso!' });
    });
});

// Rota para obter ranking do quiz 1
app.get('/ranking1', authenticateToken, (req, res) => {
    const query = `
        SELECT u.nome_usuario, p.pontuacao
        FROM pontuacoes p
        JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.pontuacao DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json(results);
    });
});

// Rota para obter ranking do quiz 2
app.get('/ranking2', authenticateToken, (req, res) => {
    const query = `
        SELECT u.nome_usuario, p.pontuacao
        FROM pontuacoes2 p
        JOIN usuarios u ON p.usuario_id = u.id
        ORDER BY p.pontuacao DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json(results);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

