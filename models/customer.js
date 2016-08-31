'use strict'

module.exports = (sequelize, DataTypes) => {
  let Customer = sequelize.define('Customer', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    doc_cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    doc_rg: DataTypes.STRING(14),
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    phone: DataTypes.STRING(14),
    birthday: DataTypes.INTEGER, // Data em milisegundos
    note: DataTypes.TEXT,
    address_zip: DataTypes.STRING,
    address_street: DataTypes.STRING,
    address_number: DataTypes.STRING,
    address_district: DataTypes.STRING,
    address_city: DataTypes.STRING,
    address_complement: DataTypes.STRING
  })

  return Customer
}
