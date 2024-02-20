const express = require('express');

const { filterLogin } = require('./middlewares/filterLogin.js');
const validateReq = require('./middlewares/validateReq.js');

const { registerUser, loginUser, editUser, getUser } = require('./controllers/user.js');
const { registerClient, listClients, getClient, editClient } = require('./controllers/client.js');
const { billingClient, listBills, listClientBills, editClientBill, getBill, deleteBill } = require('./controllers/billing.js');
const { homePage } = require('./controllers/homePage.js');

const registerSchema = require('./schema/registerSchema.js');
const loginSchema = require('./schema/loginSchema.js');
const editUserSchema = require('./schema/editUserSchema.js');
const clientSchema = require('./schema/clientSchema.js');
const billingSchema = require('./schema/billingSchema.js');
const editClientSchema = require('./schema/editClientSchema.js');

const router = express.Router();

router.post('/registerUser', validateReq(registerSchema), registerUser);
router.post('/login', validateReq(loginSchema), loginUser);

router.use(filterLogin);

router.put('/editUser/:id', validateReq(editUserSchema), editUser);
router.get('/getUser/:id', getUser);

router.post('/registerClient/:id', validateReq(clientSchema), registerClient);
router.get('/listClients/:id', listClients)
router.get('/getClient/:id', getClient)
router.put('/editClient/:id', validateReq(editClientSchema), editClient)

router.post('/registerBilling/:idUser/:idClient', validateReq(billingSchema), billingClient)
router.put('/editBilling/:id', editClientBill)
router.get('/listBills/:idUser', listBills)
router.get('/getBill/:idBill', getBill)
router.get('/listClientBills/:idUser/:idClient', listClientBills)
router.delete('/deleteBill/:idBill', deleteBill)

router.get('/homepage/:id', homePage)

module.exports = router;