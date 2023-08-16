const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');
const bcrypt = require('bcrypt');

class user extends Model {
checkPassword(loginPw) {
  return bcrypt.compareSync(loginPw, this.Password);
}
}

user.init(
  {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: true,
      }
    },
    LastName: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true,
      },
    },
    Email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6],
      }
    },
  },
  {
    hooks: {
        beforeCreate: async (newUserData) => {
          newUserData.Password = await bcrypt.hash(newUserData.Password, 10);
          return newUserData;
        },
        beforeUpdate: async (updatedUserData) => {
          if (updatedUserData.Password) {
          updatedUserData.Password = await bcrypt.hash(updatedUserData.Password, 10);
          }
          return updatedUserData;
        },
      },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
  },
  
);

module.exports = user;