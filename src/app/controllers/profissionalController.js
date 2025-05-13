const bcrypt = require("bcryptjs");
const profissionalModel = require("../models/profissionalModel");
const {body, validationResult} = require("express-validator");
const salt = bcrypt.genSaltSync(10);

const profissionalController = {

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
            }),
            body('cref').isLength({min:5})      
    ],

    regrasValidacaoFormLogin: [
        body("nome")
            .isLength({ min: 3, max: 45 })
            .withMessage("O nome de usuário/e-mail deve ter de 8 a 45 caracteres"),
        body("senha")
            .isStrongPassword()
            .withMessage("A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)")
    ],

    //métodos 
    inserirProfissional: async (req, res) => {
        //recuperar dados da validação  
        const listaErros = validationResult(req);
        //verificar se há erros
        if(listaErros.isEmpty()){
            //não há erros - insert
            //criar objeto de dados do fomrulario
            let dadosParaInserir = 
            {"nome":req.body.nome, 
                "email":req.body.email,
                "senha": bcrypt.hashSync(req.body.senha, salt),
                'especialidade': req.body.especialidade,
                'cref': req.body.cref
            };
            //executar o insert
            let resultadoInsert = await profissionalModel.create(dadosParaInserir);
            if(resultadoInsert){
                if(resultadoInsert.insertId > 0){
                    //insert realizado
                    res.redirect("/perfilProfissional");
                }else{
                    res.render("pages/cadastroProfissional",{"listaErros":null, 
                        "valores":req.body,"falha":"falha ao inserir profissional"});
                }
            }else{
                //falha ao iserir
                res.render("pages/cadastro",
                    {"listaErros":null, 
                    "valores":req.body,
                    "falha":"falha ao inserir"});
            }
        }else{
            //há erros
            console.log(listaErros);
            res.render("pages/cadastro",{"listaErros":listaErros, 
                "valores":req.body,"falha":null});
        }

        const jaExiste = await profissionalModel.buscarPorEmail(req.body.email);
        if (jaExiste) {
            return res.render("pages/cadastroProfissional", {
                listaErros: [],
                valores: req.body,
                falha: "E-mail já cadastrado!"
            });
        }

    }

}



module.exports = profissionalController;