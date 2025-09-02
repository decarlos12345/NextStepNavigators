const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const options = sequelize.define(
    'options',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

text: {
        type: DataTypes.TEXT,

      },

is_correct: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,

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

  options.associate = (db) => {

    db.options.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.options.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return options;
};

