import { Sequelize } from "sequelize";

import { init as betInit, associate as betAssociate } from "./bet";
import { init as fishermanInit, associate as fishermanAssociate } from "./fisherman";
import { init as mediaInit, associate as mediaAssociate } from "./media";
import { init as userInit, associate as userAssociate } from "./user";

const env = process.env.NODE_ENV || 'development';
import * as configJson from "../config/config.json";
const config = configJson[env];

let sequelize;

if (config.use_env_variable) {
    // TODO - use_env_variable is only mentioned here without any comment anywhere else 
    // hence a default fallback to an empty string is used
    const dbString = process.env[config.use_env_variable] || "";
    sequelize = new Sequelize(dbString, config);
}
else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Models initialization
// =====================
betInit(sequelize);
fishermanInit(sequelize);
mediaInit(sequelize);
userInit(sequelize);

// Models Associations
// ===================
betAssociate();
fishermanAssociate();
mediaAssociate();
userAssociate();

export {
    sequelize
}