'use strict'

module.exports = (sequelize, DataTypes) => {
  let Hero = sequelize.define('Hero', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(14),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    phone: DataTypes.STRING(14),
    birthday: DataTypes.INTEGER, // Data em milisegundos
    note: DataTypes.TEXT
  })

  return Hero
}
