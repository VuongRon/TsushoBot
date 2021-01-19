import { Model, DataTypes, BelongsToGetAssociationMixin, Sequelize, BelongsToCreateAssociationMixin } from "sequelize";
import * as UserModule from "./user";

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
}

/**
 * Finds a fisherman model by the discordId of it's associated User model, or creates it if it doesn't exist
 * @param id the discordId of the associated user model to find
 * @returns the fisherman model instance if it was found or created, otherwise null
 */
const findOrCreateByDiscordId = async (discordId: string): Promise<Fisherman> => {
    const userModel = await UserModule.findOrCreateByDiscordId(discordId);

    let fisherman: Fisherman;
    fisherman = await userModel.getFisherman();
    // no fisherman associated to userModel
    if (!fisherman) {
        try {
            fisherman = await userModel.createFisherman();
            return fisherman;
        }
        catch (err) {
            console.error(err);
        }
    }

    return fisherman;
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
    Fisherman.belongsTo(UserModule.User);
}

const getValueOfInv = (fisherman: Fisherman) => {
    let value = getValueOfInvService(fisherman);
    let bonus = value > 1000 ? 1.2 : 1;
    return value * bonus;
}

const sellInventory = async (fisherman: Fisherman): Promise<number> => {
    const userModel = await UserModule.User.findByPk(fisherman.userId);
    if (!userModel) return -1;
    let temp = getValueOfInvService(fisherman);
    console.log(fisherman);
    userModel.balance += temp;
    removeAllFish(fisherman);
    await userModel.save();
    await fisherman.save();
    return temp;
}

const addItem = async (itemId: number, user: UserModule.User) => {
    let item = new Item(itemId);
    if (item.userp == null || item.price == null) {
        return false;
    }

    const fisherman = await user.getFisherman();

    if (!fisherman) {
        return false;
    }

    if (fisherman[item.userp]) return false;

    if (user.balance >= item.price) {
        fisherman[item.userp] = true;
        user.balance -= item.price;
        await user.save().catch((err) => {
            console.error(err);
            return;
        });
        await fisherman.save();
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
    addItem,
    findOrCreateByDiscordId
}