const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MySQL
console.log('Tentando conectar ao MySQL...');
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'pedro',
    database: 'portfolio_db',
    multipleStatements: true
});

db.connect(err => {
    console.log('Iniciando conexão com o banco de dados...');
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        throw err;
    }
    console.log('Conectado ao MySQL!');
    
    // Criar tabelas se não existirem
    const createTables = `
        CREATE TABLE IF NOT EXISTS categorias (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS projetos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            descricao TEXT,
            imagem_url VARCHAR(255),
            link_projeto VARCHAR(255),
            categoria_id INT,
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        );

        CREATE TABLE IF NOT EXISTS habilidades (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            nivel VARCHAR(50)
        );

        CREATE TABLE IF NOT EXISTS projeto_habilidades (
            projeto_id INT,
            habilidade_id INT,
            PRIMARY KEY (projeto_id, habilidade_id),
            FOREIGN KEY (projeto_id) REFERENCES projetos(id),
            FOREIGN KEY (habilidade_id) REFERENCES habilidades(id)
        );
    `;

    db.query(createTables, (err) => {
        if (err) throw err;
        console.log('Tabelas criadas com sucesso!');
    });
});

// Rotas para Categorias
app.post('/categorias', (req, res) => {
    const { nome } = req.body;
    const sql = 'INSERT INTO categorias (nome) VALUES (?)';
    db.query(sql, [nome], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: result.insertId, nome });
    });
});

app.get('/categorias', (req, res) => {
    db.query('SELECT * FROM categorias', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// Rotas para Projetos
app.post('/projetos', (req, res) => {
    const { nome, descricao, imagem_url, link_projeto, categoria_id, habilidades } = req.body;
    
    db.beginTransaction(err => {
        if (err) return res.status(500).send(err);

        const sql = 'INSERT INTO projetos (nome, descricao, imagem_url, link_projeto, categoria_id) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [nome, descricao, imagem_url, link_projeto, categoria_id], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).send(err);
                });
            }

            const projetoId = result.insertId;

            // Inserir habilidades do projeto
            if (habilidades && habilidades.length > 0) {
                const values = habilidades.map(habilidadeId => [projetoId, habilidadeId]);
                const sqlHabilidades = 'INSERT INTO projeto_habilidades (projeto_id, habilidade_id) VALUES ?';
                
                db.query(sqlHabilidades, [values], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send(err);
                        });
                    }

                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).send(err);
                            });
                        }
                        res.status(201).send({ 
                            id: projetoId, 
                            nome, 
                            descricao, 
                            imagem_url, 
                            link_projeto, 
                            categoria_id,
                            habilidades 
                        });
                    });
                });
            } else {
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send(err);
                        });
                    }
                    res.status(201).send({ 
                        id: projetoId, 
                        nome, 
                        descricao, 
                        imagem_url, 
                        link_projeto, 
                        categoria_id 
                    });
                });
            }
        });
    });
});

app.get('/projetos', (req, res) => {
    const sql = `
        SELECT p.*, c.nome as categoria_nome,
        GROUP_CONCAT(h.nome) as habilidades
        FROM projetos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN projeto_habilidades ph ON p.id = ph.projeto_id
        LEFT JOIN habilidades h ON ph.habilidade_id = h.id
        GROUP BY p.id
    `;
    
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/projetos/:id', (req, res) => {
    const sql = `
        SELECT p.*, c.nome as categoria_nome,
        GROUP_CONCAT(h.nome) as habilidades
        FROM projetos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN projeto_habilidades ph ON p.id = ph.projeto_id
        LEFT JOIN habilidades h ON ph.habilidade_id = h.id
        WHERE p.id = ?
        GROUP BY p.id
    `;
    
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send({ mensagem: 'Projeto não encontrado' });
        res.send(results[0]);
    });
});

app.put('/projetos/:id', (req, res) => {
    const { nome, descricao, imagem_url, link_projeto, categoria_id, habilidades } = req.body;
    
    db.beginTransaction(err => {
        if (err) return res.status(500).send(err);

        const sql = 'UPDATE projetos SET nome = ?, descricao = ?, imagem_url = ?, link_projeto = ?, categoria_id = ? WHERE id = ?';
        db.query(sql, [nome, descricao, imagem_url, link_projeto, categoria_id, req.params.id], (err) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).send(err);
                });
            }

            // Atualizar habilidades
            if (habilidades) {
                // Remover habilidades antigas
                db.query('DELETE FROM projeto_habilidades WHERE projeto_id = ?', [req.params.id], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send(err);
                        });
                    }

                    // Inserir novas habilidades
                    if (habilidades.length > 0) {
                        const values = habilidades.map(habilidadeId => [req.params.id, habilidadeId]);
                        const sqlHabilidades = 'INSERT INTO projeto_habilidades (projeto_id, habilidade_id) VALUES ?';
                        
                        db.query(sqlHabilidades, [values], (err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).send(err);
                                });
                            }

                            db.commit(err => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).send(err);
                                    });
                                }
                                res.send({ mensagem: 'Projeto atualizado com sucesso' });
                            });
                        });
                    } else {
                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).send(err);
                                });
                            }
                            res.send({ mensagem: 'Projeto atualizado com sucesso' });
                        });
                    }
                });
            } else {
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send(err);
                        });
                    }
                    res.send({ mensagem: 'Projeto atualizado com sucesso' });
                });
            }
        });
    });
});

app.delete('/projetos/:id', (req, res) => {
    db.beginTransaction(err => {
        if (err) return res.status(500).send(err);

        // Primeiro, remover as relações com habilidades
        db.query('DELETE FROM projeto_habilidades WHERE projeto_id = ?', [req.params.id], (err) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).send(err);
                });
            }

            // Depois, remover o projeto
            db.query('DELETE FROM projetos WHERE id = ?', [req.params.id], (err) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).send(err);
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send(err);
                        });
                    }
                    res.send({ mensagem: 'Projeto excluído com sucesso' });
                });
            });
        });
    });
});

// Rotas para Habilidades
app.post('/habilidades', (req, res) => {
    const { nome, nivel } = req.body;
    const sql = 'INSERT INTO habilidades (nome, nivel) VALUES (?, ?)';
    db.query(sql, [nome, nivel], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: result.insertId, nome, nivel });
    });
});

app.get('/habilidades', (req, res) => {
    db.query('SELECT * FROM habilidades', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// Adicionar rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 