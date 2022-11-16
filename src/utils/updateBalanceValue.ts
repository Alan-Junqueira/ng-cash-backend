import { Account } from "../models"

export const updateBalanceValue = async (id: number, balance: number) => {
  const accoutToModifyValue = await Account.findByPk(id)

  if (accoutToModifyValue === null) {
    return 'Conta não encontrada'
  }

  return accoutToModifyValue.balance = String(+accoutToModifyValue.balance + balance)
}