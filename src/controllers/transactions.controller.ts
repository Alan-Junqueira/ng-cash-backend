import { Request, Response } from 'express'
import JWT from 'jsonwebtoken'

import { Account, Transaction, User } from '../models'
import { getUserByUsername } from '../utils/getUserByUsername'
import { updateBalanceValue } from '../utils/updateBalanceValue'

export const transactionsController = {
  // PUT /transactions/transference
  transference: async (req: Request, res: Response) => {
    const { cashInAccountUsername, cashIn, token } = req.body.data
    console.log("TYPEOF TOKEN: ", (token.length))

    if (token === null || token.length < 1) {
      return res.json({ message: "Faça login para transferir" })
    }

    console.log(cashInAccountUsername)

    console.log("\n\ \n\ TRANSACTIONS CONTROLLER", req.body.data)

    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as JWT.JwtPayload

    const user = await User.findByPk(decoded.id)

    if (user === null || user.accountId === null) {
      return res.json({ message: "Usuário ou conta inválidos" })
    }

    const cashOutAccountId: number = +user.accountId


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

      const transactionsTableUpdate = await Transaction.create({
        debitedAccountId: cashOutAccountId,
        creditedAccountId: cashInAccount.id,
        value: cashIn
      })

      return res.status(201).json({
        status: true,
        debitedAccountId: cashOutAccountId,
        creditedAccountId: cashInAccount.id,
        value: cashIn,
        message: "Transferencia realizada com sucesso"
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ status: false, message: error.message })
      }
    }
  },
  getAllUserTransactions: async (req: Request, res: Response) => {
    const { token } = req.body.data



    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as JWT.JwtPayload
    const userId: number = decoded.id


    const user = await User.findByPk(userId)

    if (user === null) {
      return res.status(404).send({ message: "Usuário não encontrado" })
    }
    const cashInParticipation = await Transaction.findAll({
      where: {
        creditedAccountId: user.accountId,
      },
      order: [['createdAt', 'DESC']]
    })

    // console.log("\n\ \n\ \n\ getALlUserTransactions", cashInParticipation, "\n\ \n\ \n\ ")
    // console.log("Transactions Controller ACCOUNT ID", user)

    try {
      const cashInParticipation = await Transaction.findAll({
        where: {
          creditedAccountId: user.accountId,
        },
        order: [['createdAt', 'DESC']]
      })

      if (cashInParticipation === null) {
        return res.status(404).json({ message: "Usuário não recebeu nenhuma transação" })
      }

      const cashOutParticipation = await Transaction.findAll({
        where: {
          debitedAccountId: user.accountId
        },
        order: [['createdAt', "DESC"]]
      })

      if (cashOutParticipation === null) {
        return res.status(404).json({ message: "Usuário não efetuou nenhuma transação" })
      }

      if (cashInParticipation.length > 0 || cashOutParticipation.length > 0) {
        return res.json({ transactionsReceived: cashInParticipation, transactionsMade: cashOutParticipation })
      } else {
        return res.json({ message: "Sem transações para exibir" })
      }

    } catch (error) {
      res.status(404).json({ message: "Não foi possível encontrar transações." })
    }
  },
  getAllUserOutcomeTransactions: async (req: Request, res: Response) => {
    const { token } = req.body

    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as JWT.JwtPayload
    const userId: number = decoded.id

    const user = await User.findByPk(userId)

    if (user === null) {
      return res.status(404).send({ message: "Usuário não encontrado" })
    }

    try {
      const cashOutParticipation = await Transaction.findAll({
        where: {
          debitedAccountId: user.accountId
        }
      })

      return res.send({ transactionsMade: cashOutParticipation })
    } catch (error) {

    }
  },
  getAllUserIncomeTransactions: async (req: Request, res: Response) => {
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

      return res.send({ transactionsReceived: cashInParticipation })
    } catch (error) {

    }
  }
}