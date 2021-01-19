import { Sequelize } from "sequelize";

import * as BetModule from "./bet";
import * as FishermanModule from "./fisherman";
import * as MediaModule from "./media";
import * as UserModule from "./user";

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
UserModule.init(sequelize);
FishermanModule.init(sequelize);
BetModule.init(sequelize);
MediaModule.init(sequelize);

// Models Associations
// ===================
UserModule.associate();
FishermanModule.associate();
BetModule.associate();
MediaModule.associate();

export {
    sequelize
}