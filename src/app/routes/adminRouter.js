const express = require('express');
const router = express.Router();
const { apenasAdmin } = require('../middlewares/autenticacao');

// Página inicial do painel admin
router.get('/dashboard', apenasAdmin, (req, res) => {
    res.render('pages/admin/dashboard', { usuario: req.session.usuario });
});

module.exports = router;
