import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../util/db";
import User from "./user";


interface RecommendationAttributes {
  id: number;
  title: string;
  service: string;
  url: string | null;
  likes: number;
  userId: number;
  user?: User;
}

interface RecommendationCreationAttributes extends Optional<
  RecommendationAttributes,
  "id" | "likes"
> {}

class Recommendation
  extends Model<RecommendationAttributes, RecommendationCreationAttributes>
  implements RecommendationAttributes
{
  public id!: number;
  public title!: string;
  public service!: string;
  public url!: string;
  public likes!: number;
  public userId!: number;
  public user?: User;
}

Recommendation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    service: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Invalid Url",
        },
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "recommendation",
  },
);

export default Recommendation;
