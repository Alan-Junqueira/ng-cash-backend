import { DataTypes, Model } from "sequelize"
import { sequelize } from "../database"

interface IAccountInstance extends Model {
  id: number
  balance: string
}

export const Account = sequelize.define<IAccountInstance>(
  'accounts',
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
    }
  }
)