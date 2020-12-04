"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Media);
    }

    static async findOrCreateByDiscordId(id) {
      const [user] = await User.findOrCreate({
        where: {
          discordId: id,
        },
      }).catch((err) => {
        console.error(err);
      });
      return user;
    }
  }
  User.init(
    {
      discordId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      whitelisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
