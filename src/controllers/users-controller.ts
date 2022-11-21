import dotenv from "dotenv"
import { Request, Response } from "express"
import JWT from "jsonwebtoken"

import { Account, User } from "../models"
import { createNewAccount } from "../utils/createNewAccount"

dotenv.config()

export const usersController = {
  // GET /users
  index: async (req: Request, res: Response) => {
    try {
      const users = await User.findAll({
        order: ['id']
      })

      return res.json(users)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  },
  // POST /users
  save: async (req: Request, res: Response) => {
    const { username, password } = req.body.data
    let initialBalance = 100

    if (!username || !password) {
      return res.send({ message: "Dados incompletos" })
    }

    let regexPassword = new RegExp(/^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z$]{8,}$/)

    if (username.length >= 3 && regexPassword.test(password)) {
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

            const token = JWT.sign(
              { id: user.id, username },
              process.env.JWT_SECRET_KEY as string,
              { expiresIn: "24h" }
            )

            return res.status(201).json({
              status: true,
              user: {
                token,
                accountId: newAccount.id,
                username,
                id: user.id
              },
              message: 'Conta criada com sucesso'
            })
          } else {
            await user.save()

            return res.status(201).json(user)
          }

        } else {
          return res.status(404).json({ message: "Usuário já existe" })
        }

      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({ message: error.message })
        }
      }
    } else {
      return res.status(406).json({ message: { usuario: "Usuário deve ter no mínimo 3 digitos", senha: "Senha deve ter no mínimo 8 digitos, 1 letra maiúscula e 1 número" } })
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
    const { username, password } = req.body.data

    try {
      const user = await User.findOne({ where: { username } })

      if (user === null) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      if (user.authenticate(password)) {
        const token = JWT.sign(
          { id: user.id, username },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "24h" }
        )
        res.status(202).json({
          status: true,
          user: { username, token, id: user.id, accountId: user.accountId },
          message: "Login Realizado com sucesso"
        })
      } else {
        res.status(401).json({ message: "Senha incorreta" })
      }

    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  },
  getUserByToken: async (req: Request, res: Response) => {
    const { token } = req.body.data

    if (token) {
      try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as JWT.JwtPayload
        if (decoded) {

          const user = await User.findByPk(decoded.id)
          if (user) {
            const { accountId, username, id, } = user
            return res.json({
              status: true,
              user: {
                accountId,
                username,
                id
              }
            })
            // const userAccountId = user.accountId

            // if (userAccountId === null) {
            //   return res.send({ message: "Faça login para acessar o saldo da conta" })
            // }

            // const userAccount = await Account.findByPk(userAccountId)

            // if (userAccount) {
            //   const balance = userAccount.balance
            //   return res.json(balance)
            // } else {
            //   return res.status(404).json({ message: 'Conta não encontrada' })
            // }
          }
        }

      } catch (error) {

      }
    } else {
      return res.status(401).json({ message: "Token de autenticação inválido" })
    }
    // return console.log('DECODED:', user.accountId)
  }
}