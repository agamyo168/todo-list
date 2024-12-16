import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import sequelize from '../utils/db/connect';
import logger from '../utils/logger';
dotenv.config();
const {
  BCRYPT_SALT_ROUNDS: SALT,
  BCRYPT_SECRET_PEPPER: PEPPER,
  JWT_SECRET: JWT,
  JWT_EXPIRE: EXPIRE,
} = process.env;

export interface User extends Model {
  id: number;
  email: string;
  password: string;
  compare(password: string): Promise<boolean>;
  signToken(): string;
}
const Users = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      // allowNull: false,
      validate: {},
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    compare: {
      type: DataTypes.VIRTUAL,
      get() {
        return async (password: string): Promise<boolean> => {
          return await bcrypt.compare(
            password + PEPPER,
            this.getDataValue('password')
          );
        };
      },
    },
    signToken: {
      type: DataTypes.VIRTUAL,
      get() {
        return () => {
          return jwt.sign({ id: this.getDataValue('id') }, `${JWT}`, {
            expiresIn: `${EXPIRE}`,
          });
        };
      },
    },
  },
  {
    timestamps: true,

    hooks: {
      async beforeCreate(user: User) {
        try {
          const salt = await bcrypt.genSalt(Number(SALT));
          const hashedPassword = await bcrypt.hash(
            `${user.password}${PEPPER}`,
            salt
          );
          user.password = hashedPassword;
        } catch (err) {
          logger.error(err);
        }
      },
      async beforeUpdate(user: User) {
        try {
          const salt = await bcrypt.genSalt(
            Number(process.env.BCRYPT_SALT_ROUNDS)
          );
          const hashedPassword = await bcrypt.hash(
            `${user.password}${process.env.BCRYPT_SECRET_PEPPER}`,
            salt
          );
          user.password = hashedPassword;
        } catch (err) {
          logger.error(err);
        }
      },
    },
  }
);

export default Users;
