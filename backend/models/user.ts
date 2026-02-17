import { Model, DataTypes } from "sequelize";
import { sequelize } from "../util/db";
import Recommendation from "./recommendation";

class User extends Model {
  public id!: number;
  public username!: string;
  public passwordHash!: string;
  public admin!: boolean;
  public disabled!: boolean;
  public token: string | undefined;
  public recommendations?: Recommendation[];
  
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "user",
  },
);

export default User;
