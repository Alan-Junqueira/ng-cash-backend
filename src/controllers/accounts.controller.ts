import { Request, Response } from "express"
import { Account, User } from "../models"
import { QueryInterface } from "sequelize"
import { updateBalanceValue } from "../utils/updateBalanceValue"
import JWT from 'jsonwebtoken'

export const accountsController = {
  // GET /accounts
  index: async (req: Request, res: Response) => {
    try {
      const accounts = await Account.findAll({
        order: ['id']
      })

      return res.json(accounts)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  },
  // POST /accounts
  save: async (req: Request, res: Response) => {
    const { balance } = req.body

    try {
      const account = await Account.create({
        balance
      })

      res.status(201).json(account)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  },
  // GET /accounts/:id
  show: async (req: Request, res: Response) => {
    const { id } = req.params

    // console.log('\n\ \n\ \n\ ', id)

    try {
      const account = await Account.findByPk(id)

      res.status(201).json(account)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  },
  // PUT /accounts/:id
  update: async (req: Request, res: Response) => {
    const { id } = req.params
    const { balance } = req.body

    try {
      await Account.update({
        balance
      }, {
        where: { id: String(id) }
      })

      const updatedAccount = await Account.findByPk(id)

      res.status(201).json(updatedAccount)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  },
  // DELETE /accounts/:id
  delete: async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      await Account.destroy({ where: { id } })

      return res.status(204).send()
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message })
      }
    }
  },
  getBalance: async (req: Request, res: Response) => {
    const { token } = req.body.data

    try {
      const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as JWT.JwtPayload
      const userId: number = decoded.id

      console.log("ACCOUNTS getBalance: ", userId)

      const user = await User.findByPk(userId)
      if (user) {
        const userAccountId = user.accountId

        if (userAccountId === null) {
          return res.send({ message: "Usuário não possui conta" })
        }

        const userAccount = await Account.findByPk(userAccountId)

        if (userAccount) {
          const balance = userAccount.balance
          return res.json({ status: true, balance })
        }
      }

    } catch (error) {
      if (error instanceof Error) {
        return res.json({ status: false, error: error.message })
      }
    }
  }
}