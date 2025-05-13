const pool = require('../../config/pool_conexoes'); // ajuste o caminho conforme sua estrutura

const profissionalModel = {
    async buscarPorEmail(email) {
        try {
            const [rows] = await pool.query("SELECT * FROM profissionais WHERE email = ?", [email]);
            return rows.length > 0 ? rows[0] : null;
        } catch (erro) {
            console.error("Erro ao buscar profissional por e-mail:", erro);
            return null;
        }
    },

    async create(dados) {
        try {
            const sql = "INSERT INTO profissionais (nome, email, senha, especialidade, cref) VALUES (?, ?, ?, ?, ?)";
            const [resultado] = await pool.query(sql, [dados.nome, dados.email, dados.senha, dados.especialidade, dados.cref]);
            return resultado;
        } catch (erro) {
            console.error("Erro ao criar profissional:", erro);
            return null;
        }
    }
};

module.exports = profissionalModel;
