const bcrypt = require("bcryptjs")
const usuarioModel = require("../models/usuarioModel")
const {body, validationResult} = require("express-validator")


const salt = bcrypt.genSaltSync(10)

const usuarioController = {

    //validação
    validacaoFormularioCadastro : [
        body("nome")
            .isLength({min:3, max:45})
            .withMessage("O nome deve ter de 3 a 45 letras"),
        body("email")
            .isEmail()
            .withMessage("O e-mail deve ser válido!"),
        body("senha")
            .isStrongPassword()
            .withMessage("A senha deve possuir no mínimo 8 caracteres:com letra maiúscula e minúscula, número e caracter especial!"),
        body("c_senha")
            .custom((value, { req }) => {
                if( value !== req.body.senha ){
                    throw new Error('As senhas não coincidem!');
                }else{
                    return true;
                }
            })        
    ],

    regrasValidacaoFormLogin: [
        body("email")
            .isLength({ min: 8, max: 45 })
            .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
        body("senha")
            .notEmpty()
            .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)")
    ],

    //métodos 
    inserirUsuario: async (req, res) => {
    const listaErros = validationResult(req);

    if (listaErros.isEmpty()) {
        // Verifica se o e-mail já existe
        const usuarioExistente = await usuarioModel.buscarPorEmail(req.body.email);
        if (usuarioExistente) {
            return res.render("pages/cadastro", {
                listaErros: null,
                valores: req.body,
                falha: "E-mail já cadastrado!"
            });
        }

        // Inserir o novo usuário
        let dadosParaInserir = {
            nome: req.body.nome,
            email: req.body.email,
            senha: bcrypt.hashSync(req.body.senha, salt)
        };

        let resultadoInsert = await usuarioModel.create(dadosParaInserir);
        if (resultadoInsert && resultadoInsert.insertId > 0) {
            res.redirect("/perfil");
        } else {
            res.render("pages/cadastro", {
                listaErros: null,
                valores: req.body,
                falha: "Falha ao inserir usuário"
            });
        }

    } else {
        // Há erros de validação
        res.render("pages/cadastro", {
            listaErros,
            valores: req.body,
            falha: null
        });
    }
}

    

}



module.exports = usuarioController;