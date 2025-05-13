const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const router = express.Router();
const {body, validationResult} = require("express-validator");

const { verificarUsuAutenticado, limparSessao, gravarUsuAutenticado, verificarUsuAutorizado } = require("../models/autenticador_middleware");


router.get("/", verificarUsuAutenticado, function (req, res){
    res.render("pages/index", req.session.autenticado);
});

router.get("/sair", limparSessao, function (req, res) {
    res.redirect("/");
  });

router.get("/login", function (req, res){
    res.render("pages/login", { listaErros: null });
} )

router.post(
    "/login",
    usuarioController.regrasValidacaoFormLogin,
    gravarUsuAutenticado,
    function (req, res) {
      usuarioController.logar(req, res);
})

router.get("/cadastro", function (req, res) {
    res.render("pages/cadastro", { listaErros: null, valores: { nome_usu: "", nomeusu_usu: "", email_usu: "", senha_usu: "" } });
  });

router.post("/cadastro", 
    usuarioController.validacaoFormularioCadastro, 
    (req, res) =>{
    usuarioController.inserirUsuario(req, res);
} )


router.get("/perfil", (req, res)=>{
        res.render("pages/perfil", {"listaErros":null,})
})

router.get("/teste", async (req, res) =>{
    //requisitar o model
    const usuarioModel = require("../models/usuarioModel");

    //teste do findAll
    //let resultados = usuarioModel.findAll();
    //let dadosParaInserir = {"nome":"Joca","senha":"acesso1234","email":"joca@gmail.com"}
    //let resultadoInsert = await usuarioModel.create(dadosParaInserir);
    //let resultados = await usuarioModel.findAll();
})


  

router.post("/cadastro",
    usuarioController.regrasValidacaoFormCad,
    async function (req, res) {
      usuarioController.cadastrar(req, res);
})

router.get(
    "/adm",
    verificarUsuAutorizado([2, 3], "pages/restrito"),
    function (req, res) {
      res.render("pages/adm", req.session.autenticado);
})

module.exports = router