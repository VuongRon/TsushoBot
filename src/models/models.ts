import { Sequelize } from "sequelize";
import * as UserModule from "./user";

const env = process.env.NODE_ENV || "development";
import * as configJson from "../config/db-config.json";
const config = configJson[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Models initialization
// =====================
UserModule.init(sequelize);

// Models Associations
// ===================
// UserModule.associate();

export { sequelize };
