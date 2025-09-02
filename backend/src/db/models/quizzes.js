const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const quizzes = sequelize.define(
    'quizzes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

title: {
        type: DataTypes.TEXT,

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  quizzes.associate = (db) => {

    db.quizzes.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.quizzes.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return quizzes;
};

