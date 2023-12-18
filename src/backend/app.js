require('dotenv').config();


// Main App config.

const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const app = express();
const parentPath = require('path').resolve(__dirname, '..');

const authMiddleware = require("./authMiddleware");

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set('views', parentPath + '/frontend/views');
app.engine('html', require('ejs').renderFile);

app.use('/css', express.static(parentPath + '/frontend/views/css'));
app.use('/img', express.static(parentPath + '/frontend/views/img'));


// Routes Prefix

const authRoutes        = require("./routes/auth.routes");
const funcionarioRoutes = require("./routes/funcionario.routes");
const alumnoRoutes      = require("./routes/alumno.routes");
const reservaRoutes     = require("./routes/reserva.routes");
const bloqueRoutes      = require("./routes/bloque.routes");
const casilleroRoutes   = require("./routes/casillero.routes");
const viewRoutes        = require("./routes/view.routes");

app.use("/api/auth",            authRoutes);
app.use("/api/funcionario",     funcionarioRoutes);
app.use("/api/alumno",          alumnoRoutes);
app.use("/api/reserva",         reservaRoutes);
app.use("/api/bloque",          bloqueRoutes);
app.use("/api/casillero",       casilleroRoutes);
app.use("/",                    viewRoutes);


module.exports = app;