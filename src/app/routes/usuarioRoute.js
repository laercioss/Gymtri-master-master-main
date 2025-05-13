const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.get("/cadastro", (req, res) => {
    res.render("pages/cadastro", {
        listaErros: null,
        valores: {},
        falha: null
    });
});

router.post("/cadastro", usuarioController.validacaoCadastro, usuarioController.inserirUsuario);

module.exports = router;
