const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  company: Object,
  job_details: String,
  count: Number
});

const jobModel = mongoose.model("Job", jobSchema);

module.exports = jobModel;
