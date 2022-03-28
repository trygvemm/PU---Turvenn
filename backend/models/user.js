'use strict';

// Add validations in model files

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Trip, Participation, Log }) {
      this.hasMany(Trip, {
        foreignKey: 'userId',
        as: 'trips'
      });
      this.belongsToMany(Trip, {
        through: Participation,
        as: 'participatedTrips',
        foreignKey: 'userId'
      });
      this.hasMany(Participation, {
        foreignKey: 'userId'
      }); // "super many to many"
      this.hasMany(Log, {
        foreignKey: 'userId'
      });
    }

    toJSON() {
      return { ...this.get(), password: undefined, createdAt: undefined, updatedAt: undefined };
    }
  }
  User.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
      },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      password: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM('user', 'admin', 'commercial'),
        allowNull: false,
        defaultValue: 'user'
      },
      experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
          max: 3
        }
      },
      profilePic: DataTypes.STRING
    },
    {
      sequelize,
      tableName: 'Users',
      modelName: 'User'
    }
  );
  return User;
};
