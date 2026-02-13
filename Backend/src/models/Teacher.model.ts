import { sequelize } from "../config/db";
import { DataTypes } from "sequelize";

const Teacher = sequelize.define('Teacher', {
   id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  }, 

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isPsychologist: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  cvUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
});



export default Teacher;
