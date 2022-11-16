import { sequelize } from "../database"
import { DataTypes, Model } from "sequelize"

const useBcrypt = require('sequelize-bcrypt');

interface IUserInstance extends Model {
  authenticate(password: any): unknown;
  id: number
  username: string
  password: string
  accountId: number | null
}

export const User = sequelize.define<IUserInstance>('users', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "Usuário já existe",
      name: "true"
    },
    validate: {
      notEmpty: {
        msg: "Este campo não pode ser vazio"
      },
      len: {
        args: [3, 30],
        msg: "Este campo deve ter no mínimo 3 caractéres, e no máximo 30 caractéres"
      },
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Esse campo não pode ser vazio"
      },
      len: {
        args: [8, 30],
        msg: "Este campo deve ter no mínimo 8 caractéres, e no máximo 30 caractéres",
      },
      is: {
        args: /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z$]{8,}$/,
        msg: "Este campo deve ter no mínimo 8 caractéres, 1 número e 1 letra Maiúscula"
      }
    }
  },
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "accounts",
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT"
  }
})

useBcrypt(User, {
  field: 'password',
  rounds: 12,
  compare: 'authenticate'
})