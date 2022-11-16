import express from "express"
import { accountsController } from "./controllers/accounts.controller"
import { usersController } from "./controllers/users-controller"

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ hello: "hello world!" })
})

router.get('/users', usersController.index)
router.get('/users/:id', usersController.show)
router.post('/users', usersController.save)
router.put('/users/:id', usersController.update)
router.delete('/users/:id', usersController.delete)
router.post('/users/login', usersController.login)

router.get('/accounts', accountsController.index)
router.post('/accounts', accountsController.save)
router.get('/accounts/:id', accountsController.show)
router.put('/accounts/:id/transference', accountsController.transference)
router.put('/accounts/:id', accountsController.update)
router.delete('/accounts/:id', accountsController.delete)

export { router }