const jobModel = require("./jobs/jobs.model");
const getWebsiteContent = require("./crawler/scraper");
const mongoose = require("mongoose");

const URL = "https://wuzzuf.net/search/jobs";

const insertContentInDataBase = () => {
  getWebsiteContent(URL)
    .then(reJobs => {
      mongoose.connection.db.dropCollection("jobs");
      console.log("returnedJobs length", reJobs.length);
      reJobs.forEach(job => {
        const createdJob = new jobModel(job);
        createdJob.save().then(savedJob => {});
      });
    })
    .catch(err => console.log(err));
};

module.exports = insertContentInDataBase;
