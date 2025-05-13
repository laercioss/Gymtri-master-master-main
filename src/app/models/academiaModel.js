const pool = require("../database/connection");

const academiaModel = {
    async buscarPorEmail(email) {
        try {
            const [rows] = await pool.query("SELECT * FROM academias WHERE email = ?", [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (erro) {
            console.error("Erro ao buscar academia por e-mail:", erro);
            return null;
        }
    },

    async create(dados) {
        try {
            const sql = "INSERT INTO academias (nome, email, senha, cnpj, endereco) VALUES (?, ?, ?, ?, ?)";
            const [resultado] = await pool.query(sql, [dados.nome, dados.email, dados.senha, dados.cnpj, dados.endereco]);
            return resultado;
        } catch (erro) {
            console.error("Erro ao criar academia:", erro);
            return null;
        }
    },

    async findAll() {
        try {
            const [resultado] = await pool.query("SELECT * FROM academias WHERE status = 1");
            return resultado;
        } catch (erro) {
            console.error("Erro ao buscar todas as academias:", erro);
            return [];
        }
    },

    async deleteById(id) {
        try {
            const [resultado] = await pool.query("UPDATE academias SET status = 0 WHERE id = ?", [id]);
            return resultado;
        } catch (erro) {
            console.error("Erro ao deletar academia:", erro);
            return null;
        }
    }
};

module.exports = academiaModel;
