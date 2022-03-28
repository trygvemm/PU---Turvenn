'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Participation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Trip }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
        constraints: true,
        onDelete: 'CASCADE'
      });
      this.belongsTo(Trip, {
        foreignKey: 'tripId',
        as: 'trip',
        constraints: true,
        onDelete: 'CASCADE'
      });
    }
  }
  Participation.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      tripId: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      rating: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 10
        }
      }
    },
    {
      sequelize,
      modelName: 'Participation',
      tableName: 'Participations'
    }
  );
  return Participation;
};
