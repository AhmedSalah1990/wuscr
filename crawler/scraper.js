const axios = require("axios");
const cheerio = require("cheerio");
const chalk = require("chalk");

const URL = "https://wuzzuf.net/search/jobs";
const parsedJobs = [];
let pageLimit = 2;
let pageCounter = 0;
let resultCount = 0;
let jobsCounter = 0;
let nextPageLink;

console.log(
  chalk.yellow.bgBlue(
    `\n Scraping of ${chalk.underline.bold(URL)} initiated...\n`
  )
);

const getWebsiteContent = url => {
  return new Promise(async (resolve, reject) => {
    try {
      await scrapWebSite(url);

      resolve(parsedJobs);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const scrapWebSite = async url => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // New Lists
  $(".container .main-content-container .card-has-jobs .result-wrp").map(
    (i, el) => {
      const count = resultCount++;
      // pageLimit =
      //   $(el)
      //     .find(".search-jobs-count")
      //     .text() / 20;
      const title = $(el)
        .find("h2.job-title")
        .text()
        .trim();
      const url = $(el)
        .find("a")
        .attr("href");
      const company_name = $(el)
        .find(".company-name")
        .text()
        .trim();
      const company_location = $(el)
        .find(".location-mobile")
        .text()
        .trim();
      const company_logo = $(el)
        .find("img.company-logo-img")
        .attr("src");
      const job_details = $(el)
        .find(".job-details")
        .text()
        .split("·")
        .map(ele => ele.replace(/\s+/g, " "))
        .join("·");
      const metadata = {
        count,
        title,
        url,
        company: {
          company_name,
          company_location,
          company_logo
        },
        job_details
      };
      parsedJobs.push(metadata);
    }
  );
  // Pagination Elements Link
  jobsCounter += 20;
  nextPageLink = `${URL}?start=${jobsCounter}`;
  console.log(chalk.cyan(`  Scraping: ${nextPageLink}`));
  pageCounter++;
  if (pageCounter === pageLimit) {
    console.log(
      chalk.yellow.bgBlue(
        `\n ${chalk.underline.bold(
          parsedJobs.length
        )} Results exported successfully\n`
      )
    );
    // return false;
  } else {
    await scrapWebSite(nextPageLink);
  }
};

module.exports = getWebsiteContent;
