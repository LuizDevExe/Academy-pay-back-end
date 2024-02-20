const knex = require("../database");

const currentDate = new Date();
currentDate.setUTCHours(3, 0, 0, 0);
const formattedDate = currentDate.toISOString();
const currentDateUTC3 = new Date(formattedDate);

const billingClient = async (req, res) => {
    const { idUser: user_id,
        idClient: client_id
    } = req.params;

    const {
        status,
        value,
        due_date,
        payment_date,
        description
    } = req.body;

    try {
        const response = await knex("billing").where({ client_id });
        if (!response) {
            return res.status(400).json({ message: "Erro: Esse cliente não existe" });
        }

        const newBilling = {
            client_id,
            user_id,
            status,
            value,
            due_date,
            payment_date,
            description
        }

        await knex("billing").insert(newBilling);

        return res.json({ message: "Cobrança cadastrada com sucesso!" });

    } catch (error) {
        return res.status(400).json({ message: "Erro Interno do Servidor", error: error.message });
    }

}


const listBills = async (req, res) => {
    const { idUser: user_id } = req.params;

    try {
        const getBills = await knex('billing')
            .where('billing.user_id', user_id)
            .join('clients', 'billing.client_id', 'clients.id')
            .select('billing.*', 'clients.name as client_name')
            .returning('*');

        for (let bill of getBills) {
            if (!bill) {
                return res.status(404).json({ message: 'Erro: Esse usuário ainda não possui cobranças' });
            }

            if (new Date(bill.due_date) < currentDateUTC3 && bill.status === 'PENDENTE') {
                await knex('billing')
                    .where({ id: bill.id })
                    .update({ status: 'VENCIDA' });
                bill.status = 'VENCIDA';
            }

            if (new Date(bill.due_date) >= currentDateUTC3 && bill.status === 'VENCIDA') {
                await knex('billing')
                    .where({ id: bill.id })
                    .update({ status: 'PENDENTE' });
                bill.status = 'PENDENTE';
            }

            if (bill.payment_date) {
                await knex('billing').where({ id: bill.id }).update({ status: 'PAGA' });
                bill.status = 'PAGA';
            }
        }

        return res.json(getBills);
    } catch (error) {
        return res.status(400).json({ message: 'Erro Interno do servidor', error: error.message });
    }
};



const listClientBills = async (req, res) => {
    const {
        idClient: client_id,
        idUser
    } = req.params;

    try {
        const clientBills = await knex("billing").where({ client_id });
        const client = await knex("clients").where({ id: client_id }).first();

        if (client.user_id == idUser) {
            for (let bill of clientBills) {
                if (bill.due_date < currentDateUTC3 && bill.status === 'PENDENTE') {
                    await knex("billing").where({ id: bill.id }).update({ status: "VENCIDA" });
                    bill.status = "VENCIDA";
                    return
                }
                if (bill.due_date > currentDateUTC3 && bill.status === 'VENCIDA') {
                    await knex("billing").where({ id: bill.id }).update({ status: "PENDENTE" });
                    bill.status = "PENDENTE";
                }
            }
            return res.json(clientBills);
        }
        else {
            return res.status(400).json({ message: "Erro: Esse cliente não pertence a esse usuário" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Erro Interno do Servidor", error: error.message });
    }
};

const getBill = async (req, res) => {
    const { idBill: id } = req.params;

    try {
        const getBill = await knex("billing").where({ id }).first();

        return res.json(getBill);
    } catch (error) {
        return res.status(500).json({ message: "Erro Interno do Servidor" });
    }
};

const editClientBill = async (req, res) => {
    const { id: bill_id } = req.params;
    const {
        status,
        value,
        due_date,
        payment_date,
        description
    } = req.body;

    try {
        const clientBill = await knex("billing").where({ id: bill_id });
        if (!clientBill) {
            return res.status(400).json({ message: "Erro: Cobrança não encontrada" });
        }

        if (payment_date) {
            if (status == 'PAGA') {

                await knex("billing").where({ id: bill_id }).update({ status: "PAGA" });
                clientBill.status = "PAGA";
            }
        }

        const updatedBill = {
            id: bill_id,
            status,
            value,
            due_date,
            payment_date,
            description
        }

        const update = await knex("billing").where({ id: bill_id }).update(updatedBill);

        return res.json({ message: "Cobrança atualizada com sucesso!", update });
    }
    catch (error) {
        return res.status(400).json({ message: "Erro Interno do Servidor", error: error.message });
    }
}

const deleteBill = async (req, res) => {
    const { idBill: id } = req.params;

    try {
        const bill = await knex("billing").where({ id }).first();
        if (!bill) {
            return res.status(400).json({ message: "Erro: Cobrança não encontrada" });
        }

        await knex("billing").where({ id }).del();

        return res.json({ message: "Cobrança excluída com sucesso!" });
    } catch (error) {
        return res.status(400).json({ message: "Erro Interno do Servidor", error: error.message });
    }
}

module.exports = {
    billingClient,
    listClientBills,
    listBills,
    editClientBill,
    getBill,
    deleteBill
};