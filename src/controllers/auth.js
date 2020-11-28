const jwt = require("jsonwebtoken");
const response = require("../utils/response");
const Session = require("../middlewares/session");
const Password = require("../utils/password");
const UsuariosDB = require("../repositories/usuarioDB");

require("dotenv").config();

const autenticar = async (ctx) => {
  const { email = null, password = null } = ctx.request.body;
  if (!email || !password) {
    return Session.response(ctx, 400, {
      mensagem: "Pedido mal formatado",
    });
  }

  const usuario = await UsuariosDB.obterUsuarioPorEmail(email);

  if (usuario) {
    const comparison = await Password.check(password, usuario.senha);
    if (comparison) {
      const token = await jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET || "desafioback",
        {
          expiresIn: "1h",
        }
      );
      return response(ctx, 200, { token });
    }
  }

  return response(ctx, 200, {
    mensagem: "email ou senha incorretos",
  });
};

module.exports = { autenticar };
