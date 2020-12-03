"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Media", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mediaContent: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      requestedByUserId: {
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: "discordId",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      approved: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      commandName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Media");
  },
};
