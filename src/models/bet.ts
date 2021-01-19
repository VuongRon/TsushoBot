import { Model, Sequelize, DataTypes } from "sequelize";

import { User } from "./user";

interface BetAttributes {
  userId: number;
  outcome: number;
  amount: number;
}

class Bet extends Model<BetAttributes> implements BetAttributes {
  public userId!: number;
  public outcome!: number;
  public amount!: number;
}

const init = (sequelizeInstance: Sequelize) => {
  Bet.init(
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      outcome: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
      amount: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize: sequelizeInstance,
      modelName: "Bet",
      tableName: "Bets",
    }
  );
}

const associate = () => {
  Bet.belongsTo(User, {
    foreignKey: "userId"
  });
}

export {
  Bet,
  init,
  associate
}