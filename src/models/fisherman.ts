import { Model, DataTypes, BelongsToGetAssociationMixin, Sequelize } from "sequelize";
import { User } from "./user";

import {
    getValueOfInv as getValueOfInvService,
    Item
} from "../services/fishService";

interface FishermanAttributes {
    userId: number;
    fish: number;
    motorized_wheelchair: number;
    manual_wheelchair: number;
    heart: number;
    blowfish: number;
    tropical_fish: number;
    boot: number;
    wrench: number;
    line: boolean;
    bait: boolean;
    boat: boolean;
}

class Fisherman extends Model<FishermanAttributes> implements FishermanAttributes {
    userId!: number;
    fish!: number;
    motorized_wheelchair!: number;
    manual_wheelchair!: number;
    heart!: number;
    blowfish!: number;
    tropical_fish!: number;
    boot!: number;
    wrench!: number;
    line!: boolean;
    bait!: boolean;
    boat!: boolean;

    // Mixin virtual functions
    public getUser!: BelongsToGetAssociationMixin<User>;
}

const init = (sequelizeInstance: Sequelize) => {
    Fisherman.init(
        {
            userId: {
                allowNull: false,
                unique: true,
                type: DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                },
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
            sequelize: sequelizeInstance,
            modelName: "Fisherman",
            tableName: "Fishermen",
        }
    );
}

const associate = () => {
    Fisherman.belongsTo(User);
}

const getValueOfInv = (fisherman: Fisherman) => {
    let value = getValueOfInvService(fisherman);
    let bonus = value > 1000 ? 1.2 : 1;
    return value * bonus;
}

const sellInventory = async (fisherman: Fisherman) => {
    const userModel = await fisherman.getUser();
    if (!userModel) return null;
    let temp = getValueOfInvService(fisherman);
    console.log(fisherman);
    userModel.balance += temp;
    removeAllFish(fisherman);
    await userModel.save();
    return temp;
}

const addItem = async (itemId: number, fishermanUser: User) => {
    if (!fishermanUser) {
        return false;
    }

    let item = new Item(itemId);
    if (item.userp == null || item.price == null) {
        return false;
    }
    
    const fisherman = await Fisherman.findOne({
        where: {
            userId: fishermanUser['id']
        }
    })
    
    if (!fisherman) {
        return false;
    }

    if (fisherman[item.userp]) return false;

    if (fishermanUser.balance >= item.price) {
        fisherman[item.userp] = true;
        fishermanUser.balance -= item.price;
        await fishermanUser.save();
        return true;
    }
}

const removeAllFish = (fisherman: Fisherman) => {
    fisherman.fish = 0;
    fisherman.motorized_wheelchair = 0;
    fisherman.manual_wheelchair = 0;
    fisherman.heart = 0;
    fisherman.blowfish = 0;
    fisherman.tropical_fish = 0;
    fisherman.boot = 0;
    fisherman.wrench = 0;
}

export {
    Fisherman,
    init,
    associate,
    getValueOfInv,
    sellInventory,
    addItem
}