'use strict'

module.exports = (sequelize, DataTypes) => {
  let Profile = sequelize.define('Profile', {
    pageId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dataCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dataValue: DataTypes.TEXT
  })

  return Profile
}
