const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
