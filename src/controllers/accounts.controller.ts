import { Request, Response } from "express"
import { Account } from "../models"
import { QueryInterface } from "sequelize"
import { updateBalanceValue } from "../utils/updateBalanceValue"

export const accountsController = {
  // GET /accounts
  index: async (req: Request, res: Response) => {
    try {
      const accounts = await Account.findAll()

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
  // PUT /accounts/:id/transference
  transference: async (req: Request, res: Response) => {
    const { id } = req.params
    const { cashInAccountId, cashIn } = req.body

    const accountToOutMoney = await Account.findByPk(id)

    if (accountToOutMoney === null) { res.status(404).send({ message: "Conta não encoutrada" }) }

    try {
      await Account.update(
        {
          balance: await updateBalanceValue(cashInAccountId, +cashIn)
        }, {
        where: {
          id: cashInAccountId
        }
      }
      )

      await Account.update(
        {
          balance: await updateBalanceValue(+id, -cashIn)
        }, {
        where: {
          id
        }
      }
      )

      const updatedIncomeAccout = await Account.findByPk(id)
      const updatedIncomeValue = updatedIncomeAccout?.balance

      res.status(201).json({ saldo: `${updatedIncomeValue}` })
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
}