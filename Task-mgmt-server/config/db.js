const { Sequelize } = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
     port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

async function connectDb() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
}

module.exports = {
  sequelize,
  connectDb
};