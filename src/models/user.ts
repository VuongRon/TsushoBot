import { Model, DataTypes, Sequelize, HasOneGetAssociationMixin, HasOneCreateAssociationMixin, HasManyGetAssociationsMixin, HasManySetAssociationsMixin, HasOneSetAssociationMixin } from "sequelize";
import { FishermanModule } from ".";
import { Bet } from "./bet";
import { Fisherman } from "./fisherman";
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

    // Mixin virtual functions
    /**
     * Returns the fisherman associated with the given User model instance
     */
    public getFisherman!: HasOneGetAssociationMixin<Fisherman>;
    public setFisherman!: HasOneSetAssociationMixin<Fisherman, "userId">;
    public createFisherman!: HasOneCreateAssociationMixin<Fisherman>;
    public getMedias!: HasManyGetAssociationsMixin<Media>;
    public setMedias!: HasManySetAssociationsMixin<Media, "requestedByUserId">;

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

/**
 * Finds a user model by its discordId, or creates it if it doesn't exist
 * @param discordId the discordId of the user to find
 * @returns the user model instance if it was found or created, otherwise null
 */
const findOrCreateByDiscordId = async (discordId: string): Promise<User> => {
    const user = await User.findOrCreate({
        where: {
            discordId: discordId,
        }
    }).catch(err => {
        console.error(err);
    });

    return user[0];
}

const associate = () => {
    User.hasOne(Fisherman, {
        foreignKey: "userId"
    });
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
    associate,
    findOrCreateByDiscordId
}