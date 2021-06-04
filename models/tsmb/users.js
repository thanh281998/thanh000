'use strict';

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = (process.env.NODE_ENV == 'production') ? new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: false,
        pool: {
          max: 10,
          min: 2,
          acquire: 120000,
          idle: 2000
        },
        retry: {
          match: [
            Sequelize.ConnectionError,
            Sequelize.ConnectionTimedOutError,
            Sequelize.TimeoutError,
            Sequelize.ConnectionAcquireTimeoutError,
            /SequelizeConnectionAcquireTimeoutError/,
            /ConnectionAcquireTimeoutError/
          ],
          max: 3
        }
    }
) : new Sequelize(
  process.env.DB_NAME_DEV,
  process.env.DB_USER_DEV,
  process.env.DB_PASSWORD_DEV,
  {
      host: process.env.DB_HOST_DEV,
      dialect: process.env.DB_DIALECT_DEV,
      logging: false,
      pool: {
        max: 10,
        min: 2,
        acquire: 120000,
        idle: 2000
      },
      retry: {
        match: [
          Sequelize.ConnectionError,
          Sequelize.ConnectionTimedOutError,
          Sequelize.TimeoutError,
          Sequelize.ConnectionAcquireTimeoutError,
          /SequelizeConnectionAcquireTimeoutError/,
          /ConnectionAcquireTimeoutError/
        ],
        max: 3
      }
  }
);

const users = sequelize.define('users', {
  id:{
    type:DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  mobile: DataTypes.STRING,
  cmt: DataTypes.STRING,
  cmt_no: DataTypes.STRING,
  birthday: DataTypes.STRING,
  address: DataTypes.TEXT,
  service: DataTypes.INTEGER,
  referent_id: DataTypes.INTEGER,
  os_id: DataTypes.INTEGER,
  refresh_token_account: DataTypes.STRING,
  refresh_token_payment: DataTypes.STRING,
  user_money: DataTypes.INTEGER
},
{
  tableName:"users",
//   timestamps: false
});

module.exports = users;