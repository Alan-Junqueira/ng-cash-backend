import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database"

interface ITransactionInstance extends Model {
  id: number
  balance: string
  debitedAccountId: number
  creditedAccountId: number
  value: number
  createdAt: string
}

export const Transaction = sequelize.define<ITransactionInstance>(
  'transactions',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    balance: {
      type: DataTypes.STRING,
      allowNull: false
    },
    debitedAccountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "accounts",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    creditedAccountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "accounts",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT"
    },
    value: DataTypes.INTEGER,
  }
)