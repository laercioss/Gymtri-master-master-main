const express = require("express");
const path = require("path");
const app = express();

const usuarioRoute = require("./routes/usuarioRoute");

const adminRouter = require('./routes/adminRouter');
app.use('/admin', adminRouter);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", usuarioRoute);

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
