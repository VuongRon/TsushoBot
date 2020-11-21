"use strict";
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fisherman extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     getValueOfInv(){
      var value=this.fish*10+
                 this.motorized_wheelchair*100+
                 this.manual_wheelchair*50+
                 this.heart*25+
                 this.blowfish*50+
                 this.tropical_fish*25+
                 this.boot*1+
                 this.wrench*1;
       var bonus = (value>1000? 1.2 : 1);
       return value*bonus;
    }
    sellInventory(){
      this.yen+=this.getValueOfInv();
      this.removeAllFish();
    }
    removeAllFish(){
      console.log("removing all fish");
      this.fish=0;
      this.motorized_wheelchair=0;
      this.manual_wheelchair=0;
      this.heart=0;
      this.blowfish=0;
      this.tropical_fish=0;
      this.boot=0;
      this.wrench=0;
    }
    addItem(item){
      if(item==1){
        if(this.yen>=1500){
          this.line=true;
          this.yen-=1500;
          return true;
        }
      }else if(item==2){
        if(this.yen>=500){
          this.bait=true;
          this.yen-=500;
          return true;
        }
      }else if(item==3){
        if(this.yen>=10000){
          this.boat=true;
          this.yen-=10000;
          return true;
        }
      }
    }
    static associate(models) {
      // define association here
    }
  };
  Fisherman.init({
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
  }, {
    sequelize,
    modelName: 'Fisherman',
  });
  return Fisherman;
};
