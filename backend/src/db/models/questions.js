const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const questions = sequelize.define(
    'questions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

question_text: {
        type: DataTypes.TEXT,

      },

type: {
        type: DataTypes.ENUM,

        values: [

"multiple_choice",

"true_false"

        ],

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

  questions.associate = (db) => {

    db.questions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.questions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return questions;
};

