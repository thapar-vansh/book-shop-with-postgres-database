import { Sequelize } from 'sequelize'
const sequelize = new Sequelize('book-shop','postgres','root',{dialect:'postgres',host:'localhost'})
export default sequelize