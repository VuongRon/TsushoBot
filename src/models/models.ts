import { Sequelize } from "sequelize";

import * as BetModule from "./bet";
import * as FishermanModule from "./fisherman";
import * as MediaModule from "./media";
import * as UserModule from "./user";

const env = process.env.NODE_ENV || 'development';
import * as configJson from "../config/config.json";
const config = configJson[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

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