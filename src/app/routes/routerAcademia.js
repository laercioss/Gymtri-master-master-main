const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const academiaModel = require("../models/academiaModel");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);

// Validação
const validarCadastroAcademia = [
    body("nome").isLength({ min: 3 }).withMessage("Nome deve ter no mínimo 3 caracteres."),
    body("email").isEmail().withMessage("E-mail inválido."),
    body("senha").isStrongPassword().withMessage("Senha fraca."),
    body("cnpj").isLength({ min: 14, max: 14 }).withMessage("CNPJ deve conter 14 dígitos."),
    body("endereco").notEmpty().withMessage("Endereço é obrigatório."),
    body("c_senha").custom((value, { req }) => {
        if (value !== req.body.senha) {
            throw new Error("As senhas não coincidem.");
        }
        return true;
    })
];

// Rota de cadastro
router.post("/cadastro", validarCadastroAcademia, async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
        return res.render("pages/cadastroAcademia", {
            listaErros: erros.array(),
            valores: req.body,
            falha: null
        });
    }

    try {
        const emailExistente = await academiaModel.buscarPorEmail(req.body.email);
        if (emailExistente) {
            return res.render("pages/cadastroAcademia", {
                listaErros: null,
                valores: req.body,
                falha: "E-mail já cadastrado!"
            });
        }

        const dados = {
            nome: req.body.nome,
            email: req.body.email,
            senha: bcrypt.hashSync(req.body.senha, salt),
            cnpj: req.body.cnpj,
            endereco: req.body.endereco
        };

        const resultado = await academiaModel.create(dados);

        if (resultado.insertId > 0) {
            res.redirect("/perfilAcademia");
        } else {
            res.render("pages/cadastroAcademia", {
                listaErros: null,
                valores: req.body,
                falha: "Erro ao cadastrar academia."
            });
        }
    } catch (erro) {
        console.error(erro);
        res.render("pages/cadastroAcademia", {
            listaErros: null,
            valores: req.body,
            falha: "Erro inesperado no servidor."
        });
    }
});

module.exports = router;
