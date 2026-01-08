const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Job = sequelize.define('Job', {
    taskName: { type: DataTypes.STRING, allowNull: false },
    payload: { type: DataTypes.JSON, allowNull: true },
    priority: { type: DataTypes.ENUM('Low','Medium','High'), defaultValue: 'Low' },
    status: { type: DataTypes.ENUM('pending','running','completed'), defaultValue: 'pending' },
  }, {
    tableName: 'jobs',
    timestamps: true,
  });
  return Job;
};
