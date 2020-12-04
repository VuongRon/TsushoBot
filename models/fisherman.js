"use strict";
const { Model } = require("sequelize");
const fishService = require("../services/fishService");
module.exports = (sequelize, DataTypes) => {
  class Fisherman extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    getValueOfInv() {
      let value = fishService.getValueOfInv(this);
      let bonus = value > 1000 ? 1.2 : 1;
      return value * bonus;
    }

    sellInventory() {
      let temp = this.getValueOfInv();
      this.yen += temp;
      this.removeAllFish();
      return temp;
    }

    removeAllFish() {
      this.fish = 0;
      this.motorized_wheelchair = 0;
      this.manual_wheelchair = 0;
      this.heart = 0;
      this.blowfish = 0;
      this.tropical_fish = 0;
      this.boot = 0;
      this.wrench = 0;
    }

    addItem(id) {
      let item1 = new fishService.Item(id);
      if (eval("this." + item1.userp)) return false;
      if (this.yen >= item1.price) {
        eval("this." + item1.userp + "=true");
        this.yen -= item1.price;
        return true;
      }
    }

    static associate(models) {
      // define association here
    }
  }

  Fisherman.init(
    {
      discordId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      fish: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      motorized_wheelchair: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      manual_wheelchair: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      heart: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      blowfish: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      tropical_fish: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      boot: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      wrench: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      yen: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      line: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      bait: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      boat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Fisherman",
    }
  );
  return Fisherman;
};
