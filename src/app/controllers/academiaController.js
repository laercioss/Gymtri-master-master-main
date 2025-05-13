const bcrypt = require('bcryptjs')
const academiaModel = require('../models/academiaModel.js')
const {body, validationResult} = require('express-validator')
const salt = bcrypt.genSaltSync(10)

const academiaController = {

    //Validação
    validacaoFormularioCadastro : [
        body('nome')
            .isLength({min:3, max:45})
            .withMessage('O nome deve ter de 3 a 45 letras'),
        body('email')
            .isEmail()
            .withMessage('O e-mail deve ser válido!'),
        body('senha')
            .isStrongPassword()
            .withMessage('A senha deve possuir no mínimo 8 caracteres: com letra miniscula, maiuscula, numeral e caracter especial!'),
        body('c_senha')
            .custom((value, {req}) => {
                if(value != req.body.senha){
                    throw new Error('Senha está errada')
                }else{
                    return true;
                }
            }),            
        body("cnpj").isLength({ min: 14 }),
        body("endereco").notEmpty()
    ],

    regrasValidacaoFormLogin: [
        body('nome')
            .isLength({min:3, max:45})
            .withMessage('O nome de usuário / e-mail deve conter de 8 a 45 caracteres.'),
        body('senha')
            .isStrongPassword()
            .withMessage('A senha deve possuir no mínimo 8 caracteres, (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)')
    ],

    //métodos 
    inserirAcademia: async (req, res) => {
        //recuperar dados da validação  
        const listaErros = validationResult(req);
        //verificar se há erros
        if(listaErros.isEmpty()){
            //não há erros - insert
            //criar objeto de dados do fomrulario
            let dadosParaInserir = {
                "nome":req.body.nome, 
                "email":req.body.email,
                "senha": bcrypt.hashSync(req.body.senha, salt),
                'cnpj': req.body.cnpj,
            'endereco': req.body.endereco
            };
            //executar o insert
            let resultadoInsert = await academiaModel.create(dadosParaInserir);
            if(resultadoInsert){
                if(resultadoInsert.insertId > 0){
                    //insert realizado
                    res.redirect("/perfil");
                }else{
                    res.render("pages/cadastro",{"listaErros":null, 
                        "valores":req.body,"falha":"falha ao inserir"});
                }
            }else{
                //falha ao iserir
                res.render("pages/cadastro",{"listaErros":null, 
                    "valores":req.body,"falha":"falha ao inserir"});
            }
        }else{
            //há erros
            console.log(listaErros);
            res.render("pages/cadastro",{"listaErros":listaErros, 
                "valores":req.body,"falha":null});
        }

    }

}


module.exports = profissionalController;