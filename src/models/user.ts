import { Model, DataTypes, Sequelize } from "sequelize";
import { Bet } from "./bet";
import { Media } from "./media";

interface UserAttributes {
    discordId: string;
    count: number;
    whitelisted: boolean;
    balance: number;
}

class User extends Model<UserAttributes> implements UserAttributes {
    public discordId!: string;
    public count!: number;
    public whitelisted!: boolean;
    public balance!: number;
}

const init = (sequelizeInstance: Sequelize) => {
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
            balance: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            sequelize: sequelizeInstance,
            modelName: "User",
            tableName: "Users"
        }
    );
}

const associate = () => {
    User.hasMany(Media, {
        foreignKey: "requestedByUserId"
    });
    User.hasMany(Bet, {
        foreignKey: "userId"
    });
}

export {
    User,
    init,
    associate
}