import { Model, DataTypes} from "sequelize";
import { sequelize } from "../util/db";

class Comment extends Model {
  public id!: number;
  public comment!: string;
  public userId!: number;
  public recommendationId!: number;
}


Comment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
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
  modelName: 'comment'
})

export default Comment;
