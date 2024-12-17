import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/db/connect';
export interface Todo extends Model {
  id: number;
  userId: number;
  title: string;
  desc: string;
  check: boolean;
}
const Todos = sequelize.define(
  'todos',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
    },
    check: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

export default Todos;
