'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
      },
      uuid: {
        type: Sequelize.STRING,
      },
      cmt: {
        type: Sequelize.STRING,
      },
      cmt_no: {
        type: Sequelize.STRING,
      },
      birthday: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      refresh_token_account: {
        type: Sequelize.TEXT
      },
      refresh_token_payment: {
        type: Sequelize.TEXT
      },
      user_money: {
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      service: {
        type: Sequelize.INTEGER
      },
      referent_id: {
        type: Sequelize.INTEGER
      },
      os_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};