const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'}
}); 

module.exports = mongoose.model('Application', AppSchema);