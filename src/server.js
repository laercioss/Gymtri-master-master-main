import app from '../app.js'

const PORT = process.env.PORT || 3000

//escutar a porta 3000
app.listen(PORT, () => {
    console.log(`Servido rodando no endereço http://localhost:${PORT}`)
})