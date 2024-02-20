const jwt = require("jsonwebtoken");
const knex = require("../database");
const bcrypt = require("bcrypt");

const hash = process.env.JWT_HASH;

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await knex("users").where({ email }).first();

    if (existingUser) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    const passwordEncrypted = await bcrypt.hash(password, 10);

    await knex("users").insert({
      name,
      email,
      password: passwordEncrypted,
    });

    return res.status(201).json({ message: "Usuário cadastrado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: `Erro interno do servidor! Erro: ${error.message}` });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await knex("users").where({ email }).first();

    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    const token = jwt.sign({ id: user.id }, hash, { expiresIn: "8h" });

    const { password: _, ...userData } = user;

    return res.status(201).json({
      user: userData,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: `Erro interno do servidor! Erro: ${error.message}` });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await knex("users").where({ id }).first();


    if (user) {
      const { password, ...userData } = user
      return res.json(userData);
    }


    return res
      .status(404)
      .json({ message: `Erro! Não existe usuario com id ${id}` });

  } catch (error) {
    return res
      .status(404)
      .json({ message: `Erro interno do servidor! Erro: ${error.message}` });
  }
}

const editUser = async (req, res) => {
  const { name, email, cpf, phone, password } = req.body;
  const { id } = req.params;

  try {
    const existingUser = await knex("users")
      .where({ id })
      .first();

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: `Erro! Não existe usuario com id ${id}` });

    }

    const existingEmail = await knex("users")
      .where({ email })
      .whereNot({ id })
      .first();

    if (cpf) {
      const existingCpf = await knex("users")
        .where({ cpf })
        .whereNot({ id })
        .first();

      if (existingCpf) {
        return res
          .status(404)
          .json({ message: `Erro! CPF ja cadastrado` });
      }
    }

    if (existingEmail) {
      return res
        .status(404)
        .json({ message: `Erro! Email ja cadastrado` });
    }

  } catch (error) {
    return res
      .status(400)
      .json({ message: `Erro interno do servidor! Erro: ${error.message}` });
  }

  if (password) {
    let cryptPassword = "";

    try {
      cryptPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res
        .status(400)
        .json({ message: `Erro interno do servidor! Erro: ${error.message}` });
    }

    try {
      const response = await knex("users")
        .where({ id })
        .update({ name, email, cpf, phone, password: cryptPassword })
        .returning(["name", "email", "cpf", "phone"]);

      return res.status(201).json({
        message: "Dados alterados com sucesso!",
        changePassword: true,
        data: response,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: `Erro interno do servidor! Erro: ${error.message}` });
    }
  }

  try {
    const response = await knex("users")
      .where({ id })
      .update({ name, email, cpf, phone })
      .returning(["name", "email", "cpf", "phone"]);

    return res.status(201).json({
      message: "Dados alterados com sucesso!",
      changePassword: false,
      data: response,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Erro interno do servidor! Erro: ${error.message}` });
  }
};

module.exports = {
  loginUser,
  registerUser,
  editUser,
  getUser
};
