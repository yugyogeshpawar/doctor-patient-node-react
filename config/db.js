const mongoose = require('mongoose');
require('dotenv').config(); 

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error('MONGODB_URL is not defined in environment variables');
}
console.log('MongoDB URI:', mongoURI);

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000, 
})
.then(() => {
  console.log('Successfully connected to the database');
})
.catch((err) => {
  console.error('Database connection error:', err);
});
;

module.exports = {
  mongoose
};
