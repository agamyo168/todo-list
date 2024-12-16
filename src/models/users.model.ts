import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/db/connect';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import logger from '../utils/db/logger';
dotenv.config();
const { BCRYPT_SALT_ROUNDS: SALT, BCRYPT_SECRET_PEPPER: PEPPER } = process.env;

export interface User extends Model {
  id: number;
  email: string;
  password: string;
  compare(password: string): Promise<boolean>;
}
const Users = sequelize.define(
  'users',
  {
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
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
  },
  {
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
