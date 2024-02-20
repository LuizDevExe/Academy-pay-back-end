const jwt = require("jsonwebtoken");
const knex = require("../database");

const hash = process.env.JWT_HASH;

const filterLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Não autorizado" });
  }

  const token = authorization.replace("Bearer ", "").trim();

  try {
    const { id } = jwt.verify(token, hash);

    const userExists = await knex("users").where({ id }).first();

    if (!userExists) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const { password, ...user } = userExists;

    req.user = user;
  } catch (error) {
    return res.status(500).json({ message: "usuário não autorizado" });
  }

  next();
};

module.exports = {
  filterLogin,
};
