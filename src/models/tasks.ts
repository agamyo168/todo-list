import { DataTypes } from 'sequelize';
import sequelize from '../utils/db/connect';

const Tasks = sequelize.define('users', {
  title: {
    type: DataTypes.STRING,
  },
  desc: {
    type: DataTypes.STRING,
  },
  check: {
    type: DataTypes.BOOLEAN,
  },
});

export default Tasks;
