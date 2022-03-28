'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
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
  Log.init(
    {
      text: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      tripId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Log',
      tableName: 'Logs'
    }
  );
  return Log;
};
