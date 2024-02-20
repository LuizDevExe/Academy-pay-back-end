const knex = require("../database");

const currentDate = new Date();
currentDate.setUTCHours(3, 0, 0, 0);
const formattedDate = currentDate.toISOString();
const currentDateUTC3 = new Date(formattedDate);


const homePage = async (req, res) => {
    const { id: user_id } = req.params

    const arrayPayingClients = []
    const arrayOverdueClients = []

    const arrayPayedBills = []
    const arrayPendingBills = []
    const arrayOverdueBills = []

    let valuePayedBills = 0;
    let valuePendingBills = 0;
    let valueOverdueBills = 0;

    try {
        const clients = await knex('clients').where({ user_id })

        for (let i = 0; i < clients.length; i++) {
            clients[i].status = 'EM DIA';

            const bills = await knex('billing').where({ client_id: clients[i].id });

            for (const bill of bills) {
                if (bill.due_date < currentDateUTC3 && (bill.status !== 'PAGA')) {
                    clients[i].status = 'INADIMPLENTE';
                    break;
                }
            }
            if (clients[i].status == 'EM DIA') {
                arrayPayingClients.push(clients[i])
            }
            else if (clients[i].status == "INADIMPLENTE") {
                arrayOverdueClients.push(clients[i])
            }
        }

        const bills = await knex('billing')
            .where('billing.user_id', user_id)
            .join('clients', 'billing.client_id', 'clients.id')
            .select('billing.*', 'clients.name as client_name')
            .returning('*');

        for (const bill of bills) {
            if (bill.status == 'PENDENTE') {
                arrayPendingBills.push(bill);
                valuePendingBills = valuePendingBills + bill.value;
            }
            if (bill.status == 'PAGA') {
                arrayPayedBills.push(bill);
                valuePayedBills = valuePayedBills + bill.value;
            }
            if (bill.status == 'VENCIDA') {
                arrayOverdueBills.push(bill);
                valueOverdueBills = valueOverdueBills + bill.value;
            }
        }

        const arrayClients = {
            paying: arrayPayingClients,
            overdue: arrayOverdueClients
        }

        const arrayBills = {
            payed: { value: valuePayedBills, bills: arrayPayedBills },
            pending: { value: valuePendingBills, bills: arrayPendingBills },
            overdue: { value: valueOverdueBills, bills: arrayOverdueBills }
        }

        const response = {
            clients: arrayClients,
            bills: arrayBills
        }

        return res.status(200).json(response)

    } catch (error) {
        return res.status(400).json({ message: "Erro interno do servidor", error: error.message })
    }
}

module.exports = {
    homePage
}