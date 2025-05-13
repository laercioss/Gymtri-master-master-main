const pool = require("../../config/pool_conexoes");

const usuarioModel = {
    // Buscar todos os usuários ativos
    findAll: async () => {
        try {
            const [resultados] = await pool.query(
                `SELECT * FROM usuario u
                 JOIN tipo_usuario t ON t.id_tipo_usuario = u.tipo_usuario
                 WHERE u.status_usuario = 1;`
            );
            return resultados;
        } catch (erro) {
            console.log(erro);
            return erro;
        }
    },

    // Verifica se o e-mail já está cadastrado
    buscarPorEmail: async (email) => {
        try {
            const [rows] = await pool.query(
                "SELECT * FROM usuario WHERE email_usuario = ? LIMIT 1",
                [email]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (erro) {
            console.log(erro);
            return null;
        }
    },

    // Insere um novo usuário
    create: async (dados) => {
        try {
            const [resultado] = await pool.query(
                "INSERT INTO usuario (nome_usuario, user_usuario, senha_usuario, email_usuario) VALUES (?, ?, ?, ?)",
                [dados.nome, dados.nome, dados.senha, dados.email]
            );
            return resultado;
        } catch (erro) {
            console.log(erro);
            return false;
        }
    }
};

module.exports = usuarioModel;
