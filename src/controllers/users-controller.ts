import { Request, Response } from "express"
import { Account, User } from "../models"
import { createNewAccount } from "../utils/createNewAccount"


export const usersController = {
  // GET /users
  index: async (req: Request, res: Response) => {
    try {
      const users = await User.findAll()

      return res.json(users)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  },
  // POST /users
  save: async (req: Request, res: Response) => {
    const { username, password } = req.body
    let initialBalance = 100

    if (username.length >= 3) {
      try {
        const user = User.build({
          username, password
        })

        // Retorna null caso não exista
        const userAlreadyExists = await User.findOne({ where: { username } })
        // console.log(`USER_ALREADY_EXISTS: `, userAlreadyExists)

        if (userAlreadyExists === null) {
          const newAccount = await createNewAccount(initialBalance)

          if (newAccount) {
            user.accountId = newAccount.id

            await user.save()

            return res.status(201).json(user)
          } else {
            await user.save()

            return res.status(201).json(user)
          }

        } else {
          return res.status(404).send({ message: "Usuário não criado" })
        }

      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({ message: error.message })
        }
      }
    } else {
      return res.status(406).send({ message: "Usuário deve ter no minimo 3 digitos." })
    }
  },
  // GET /users/:id  
  show: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      const user = await User.findByPk(id)

      return res.json(user)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  },
  //PUT /users/:id
  update: async (req: Request, res: Response) => {
    const { id } = req.params
    const { username, password } = req.body

    try {
      const user = await User.findByPk(id)
      if (user === null) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      if (username) {
        user.username = username
      }

      if (password) {
        user.password = password
      }

      await user.save()

      return res.json(user)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  },
  // Delete /users/:id
  delete: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      await User.destroy({ where: { id } })

      return res.status(204).send()
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  },
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body

    try {
      const user = await User.findOne({ where: { username } })

      if (user === null) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      if (user.authenticate(password)) {
        res.status(202).json(user)
      } else {
        res.status(401).json({ message: "Senha incorreta" })
      }

    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  }
}