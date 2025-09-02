const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const notes = sequelize.define(
    'notes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

title: {
        type: DataTypes.TEXT,

      },

content: {
        type: DataTypes.TEXT,

      },

is_public: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,

      },

reminder: {
        type: DataTypes.DATE,

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

  notes.associate = (db) => {

    db.notes.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.notes.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return notes;
};

