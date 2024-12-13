import { DataTypes } from 'sequelize';
import sequelize from '../utils/db/connect';

const Users = sequelize.define('users', {
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
});

export default Users;
