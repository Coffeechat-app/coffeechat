const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({

  name: {
    type: String,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  }

  
})