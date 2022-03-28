'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Participation, Log }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
        constraints: true,
        onDelete: 'CASCADE'
      });
      this.belongsToMany(User, {
        through: Participation,
        as: 'participators',
        foreignKey: 'tripId'
      });
      this.hasMany(Participation, {
        foreignKey: 'tripId'
      });
      this.hasMany(Log, {
        foreignKey: 'tripId'
      });
    }
  }
  Trip.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      start: DataTypes.STRING,
      goal: DataTypes.STRING,
      startDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      difficulty: DataTypes.STRING,
      type: DataTypes.STRING,
      description: DataTypes.STRING,
      userId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Trip',
      tableName: 'Trips'
    }
  );
  return Trip;
};
