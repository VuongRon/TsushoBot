"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Media.belongsTo(models.User);
    }
  }
  Media.init(
    {
      mediaContent: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      requestedByUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        references: {
          model: "Users",
          key: "discordId",
        },
      },
      approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      commandName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Media",
      tableName: "Mediae",
    }
  );
  return Media;
};
