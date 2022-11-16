import { Request, Response } from 'express'
import JWT from 'jsonwebtoken'

import { Account, Transaction, User } from '../models'
import { getUserByUsername } from '../utils/getUserByUserName'
import { updateBalanceValue } from '../utils/updateBalanceValue'

export const transactionsController = {
  // PUT /transactions/transference
  transference: async (req: Request, res: Response) => {
    const { cashInAccountUsername, cashIn, token } = req.body

    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as JWT.JwtPayload
    const cashOutAccountId: number = decoded.id

    const accountToOutMoney = await Account.findByPk(+cashOutAccountId)

    if (accountToOutMoney === null) {
      return res.send({ message: "Erro ao encontrar a conta" })
    }

    if (+accountToOutMoney.balance < cashIn) {
      return res.send({ message: "Saldo insuficiente" })
    }

    const userToInMoney = await getUserByUsername(cashInAccountUsername)

    if (userToInMoney === null) {
      return res.send({ message: "Usuário escolhido para o envio do dinheiro não existe" })
    }

    const cashInAccount = await Account.findOne({
      where: { id: userToInMoney.accountId }
    })

    if (cashInAccount === null) {
      return res.send({ message: "Usuário para o envio do dinheiro, não possúi conta" })
    }

    if (+cashInAccount.id === +cashOutAccountId) {
      return res.status(401).send({ message: "Não é permitido transferir pra mesma conta." })
    }

    try {
      // Income
      await Account.update(
        {
          balance: await updateBalanceValue(+cashInAccount.id, +cashIn)
        }, {
        where: {
          id: +cashInAccount.id
        }
      }
      )

      // Outcome
      await Account.update(
        {
          balance: await updateBalanceValue(+cashOutAccountId, -cashIn)
        }, {
        where: {
          id: +cashOutAccountId
        }
      }
      )

      const updatedIncomeAccout = await Account.findByPk(+cashOutAccountId)
      const updatedIncomeValue = updatedIncomeAccout?.balance

      const transactionsTableUpdate = await Transaction.create({
        debitedAccountId: cashOutAccountId,
        creditedAccountId: cashInAccount.id,
        balance: updatedIncomeValue,
        value: cashIn
      })

      res.status(201).json({
        status: true,
        debitedAccountId: cashOutAccountId,
        creditedAccountId: cashInAccount.id,
        balance: updatedIncomeValue,
        value: cashIn
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ status: false, message: error.message })
      }
    }
  },
  getAllUserTransactions: async (req: Request, res: Response) => {
    const { token } = req.body

    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as JWT.JwtPayload
    const userId: number = decoded.id

    console.log(decoded)

    const user = await User.findByPk(userId)

    if (user === null) {
      return res.status(404).send({ message: "Usuário não encontrado" })
    }

    try {
      const cashInParticipation = await Transaction.findAll({
        where: {
          creditedAccountId: user.accountId
        }
      })

      const cashOutParticipation = await Transaction.findAll({
        where: {
          debitedAccountId: user.accountId
        }
      })


      return res.send({ transactionsReceived: cashInParticipation, transactionsMade: cashOutParticipation })
    } catch (error) {

    }
  }
}