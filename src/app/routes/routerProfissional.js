const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const profissionalModel = require("../models/profissionalModel");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);

// Validação
const validarCadastroProfissional = [
    body("nome").isLength({ min: 3 }).withMessage("Nome deve ter no mínimo 3 caracteres."),
    body("email").isEmail().withMessage("E-mail inválido."),
    body("senha").isStrongPassword().withMessage("Senha fraca."),
    body("c_senha").custom((value, { req }) => {
        if (value !== req.body.senha) {
            throw new Error("As senhas não coincidem.");
        }
        return true;
    })
];

// Rota de cadastro
router.post("/cadastro", validarCadastroProfissional, async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.render("pages/cadastroProfissional", {
            listaErros: erros.array(),
            valores: req.body,
            falha: null
        });
    }

    try {
        const emailExistente = await profissionalModel.buscarPorEmail(req.body.email);
        if (emailExistente) {
            return res.render("pages/cadastroProfissional", {
                listaErros: null,
                valores: req.body,
                falha: "E-mail já cadastrado!"
            });
        }

        const dados = {
            nome: req.body.nome,
            email: req.body.email,
            senha: bcrypt.hashSync(req.body.senha, salt)
        };

        const resultado = await profissionalModel.create(dados);

        if (resultado.insertId > 0) {
            res.redirect("/perfilProfissional");
        } else {
            res.render("pages/cadastroProfissional", {
                listaErros: null,
                valores: req.body,
                falha: "Erro ao cadastrar profissional."
            });
        }
    } catch (erro) {
        console.error(erro);
        res.render("pages/cadastroProfissional", {
            listaErros: null,
            valores: req.body,
            falha: "Erro inesperado no servidor."
        });
    }
});

module.exports = router;
