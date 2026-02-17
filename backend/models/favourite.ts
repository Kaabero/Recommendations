import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../util/db";

class Favourite extends Model {
  public id!: number;
  public userId!: number;
  public recommendationId!: number;
}


Favourite.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  recommendationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'recommendations', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'favourite'
})

export default Favourite;
