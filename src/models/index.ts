import { Account } from "./accounts";
import { Transaction } from "./transactions";
import { User } from "./user";

// Transaction.belongsTo(Account)
// Account.hasMany(Transaction)

// Account.belongsTo(User)
Account.hasOne(User)

export {
  Account,
  Transaction,
  User
}