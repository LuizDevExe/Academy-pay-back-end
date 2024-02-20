const knex = require("../database");

const registerClient = async (req, res) => {
  const {id: user_id} = req.params;

  const {
    name,
    email,
    cpf,
    phone,
    zip_code,
    address,
    complementary_address,
    neighborhood,
    city,
    state,
  } = req.body;

  try {
    const response = await knex("clients").where({cpf, user_id}).first();

    if (response) {
      return res
        .status(400)
        .json({message: "Erro: Esse CPF ja está cadastrado"});
    }
  } catch (error) {
    return res
      .status(400)
      .json({message: "Erro Interno do Servidor", error: error.message});
  }

  try {
    const newClient = {
      name,
      email,
      cpf,
      phone,
      zip_code,
      address,
      complementary_address,
      neighborhood,
      city,
      state,
      user_id,
    };

    await knex("clients").insert(newClient);

    return res.json({message: "Cliente cadastrado com sucesso!"});
  } catch (error) {
    return res
      .status(400)
      .json({message: "Erro Interno do Servidor", error: error.message});
  }
};

const listClients = async (req, res) => {
  const {id: user_id} = req.params;

  try {
    const currentDate = new Date();
    currentDate.setUTCHours(3, 0, 0, 0);
    const formattedDate = currentDate.toISOString();
    const currentDateUTC3 = new Date(formattedDate);


    const clients = await knex('clients').where({user_id});

    for (let i = 0; i < clients.length; i++) {
      clients[i].status = 'EM DIA';

      const bills = await knex('billing').where({client_id: clients[i].id});

      for (const bill of bills) {

        if (bill.due_date < currentDateUTC3 && (bill.status !== 'PAGA')) {
          clients[i].status = 'INADIMPLENTE';
          break;
        }
      }
    }

    return res.json({data: clients});
  } catch (error) {
    return res.status(400).json({message: 'Erro Interno do Servidor', error: error.message});
  }
};


const getClient = async (req, res) => {
  const {id} = req.params;

  try {
    const client = await knex("clients").where({id}).first();

    if (client) {
      return res.json(client);
    }

    return res
      .status(404)
      .json({message: `Erro! Não existe usuario com id ${id}`});

  } catch (error) {
    return res
      .status(404)
      .json({message: `Erro interno do servidor! Erro: ${error.message}`});
  }
}

const editClient = async (req, res) => {
  const {id: user_id} = req.params;
  const {
    id: client_id,
    name,
    email,
    cpf,
    phone,
    zip_code,
    address,
    complementary_address,
    neighborhood,
    city,
    state,
  } = req.body;

  try {

    const emailAlreadyExists = await knex("clients")
      .where({email, user_id})
      .whereNot({id: client_id})
      .first();

    const cpfAlreadyExists = await knex("clients")
      .where({cpf, user_id})
      .whereNot({id: client_id})
      .first();

    if (emailAlreadyExists) {
      return res
        .status(400)
        .json({message: "Erro: E-mail já cadastrado para outro cliente"});
    }

    if (cpfAlreadyExists) {
      return res
        .status(400)
        .json({message: "Erro: CPF já cadastrado para outro cliente"});
    }

    const updatedClient = {
      name,
      email,
      cpf,
      phone,
      zip_code,
      address,
      complementary_address,
      neighborhood,
      city,
      state,
    };

    await knex("clients").where({id: client_id}).update(updatedClient);

    return res.json({message: "Cliente editado com sucesso!"});
  } catch (error) {
    return res
      .status(500)
      .json({message: "Erro interno do servidor", error: error.message});
  }
};



module.exports = {
  registerClient,
  listClients,
  getClient,
  editClient
};
