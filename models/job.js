const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  positionName: {
    type: String,
    trim: true,
  },
  startDate: Date,
  location: String,
  editHistory: [
    {
      user: {
        name: String,
        azObjID: String,
      },
      editDate: Date,
    }
  ],
  candidates : [
    {
      firstName: String,
      lastName: String,
      contactInfo: {
        phoneNumber: String,
        email: String,
        address: {
          street: String,
          city: String,
          State: String,
          zipcode: String,
        }
      },
      interviewState : Number,
      notes: String,
    }
  ],
  jiraLink: {
    id: String,
    key: String,
    self: String
  },
});

module.exports = mongoose.model('Position', positionSchema);