import { Account } from "../models"


export const createNewAccount = async (balance: number) => {

  const account = await Account.create({
    balance
  })

  return account

}