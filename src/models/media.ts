import { Model, DataTypes, Sequelize } from "sequelize";
import { User } from "./user";

interface MediaAttributes {
    mediaContent: string;
    requestedByUserId: string;
    approved: boolean;
    commandName: string;
}

class Media extends Model<MediaAttributes> implements MediaAttributes {
    public mediaContent!: string;
    public requestedByUserId!: string;
    public approved!: boolean;
    public commandName!: string;
}

const init = (sequelizeInstance: Sequelize) => {
    Media.init(
        {
            mediaContent: {
                type: DataTypes.STRING(1000),
                allowNull: false,
                unique: true,
            },
            requestedByUserId: {
                type: DataTypes.STRING,
                allowNull: false,
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
            sequelize: sequelizeInstance,
            modelName: "Media",
            tableName: "Media",
        }
    );
}

const associate = () => {
    Media.belongsTo(User, {
        foreignKey: "requestedByUserId",
    });
}


const findOneByMediaContent = async (resource) => {
    const model = await Media.findOne({
        where: {
            mediaContent: resource
        }
    }).catch(err => console.error(err));

    return model;
}

const findFirstUnapprovedByCommandName = async (command) => {
    const model = await Media.findOne({
        where: {
            commandName: command,
            approved: false,
        },
    }).catch(err => console.error(err));

    return model;
}

const findOneById = async (id: string) => {
    const model = await Media.findByPk(id).catch(err => console.error(err));

    return model;
}

const selectRandomFromCommand = async (commandName: string, sequelizeInstance: Sequelize): Promise<Media | null> => {
    try {
        const mediaResults = await Media.findAll({
            where: {
                commandName: commandName,
                approved: true,
            },
            order: sequelizeInstance.random(),
            limit: 1,
        })
        if (mediaResults && mediaResults.length != 0) {
            return mediaResults[0];
        }
    }
    catch (err) {
        console.error(err);
    }

    return null;
}

export {
    Media,
    init,
    associate,
    findOneByMediaContent,
    findFirstUnapprovedByCommandName,
    findOneById,
    selectRandomFromCommand
}