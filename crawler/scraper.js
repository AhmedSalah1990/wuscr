const axios = require("axios");
const cheerio = require("cheerio");
const chalk = require("chalk");

class Scraper {
  constructor() {
    this.URL = "https://wuzzuf.net/search/jobs";
    this.parsedJobs = [];
    this.pageLimit = 10;
    this.pageCounter = 0;
    this.resultCount = 1;
    this.jobsCounter = 0;
    this.nextPageLink;
    console.log(
      chalk.yellow.bgBlue(
        `\n Scraping of ${chalk.underline.bold(this.URL)} initiated...\n`
      )
    );
  }

  getWebsiteContent(url) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.scrapWebSite(url);

        resolve(this.parsedJobs);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  async scrapWebSite(url) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // New Lists
    $(".container .main-content-container .card-has-jobs .result-wrp").map(
      (i, el) => {
        const count = this.resultCount++;
        pageLimit =
          $(el)
            .find(".search-jobs-count")
            .text() / 20;
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
        this.parsedJobs.push(metadata);
      }
    );
    // Pagination Elements Link
    this.jobsCounter += 20;
    this.nextPageLink = `${this.URL}?start=${this.jobsCounter}`;
    console.log(chalk.cyan(`  Scraping: ${this.nextPageLink}`));
    this.pageCounter++;
    if (this.pageCounter === this.pageLimit) {
      console.log(
        chalk.yellow.bgBlue(
          `\n ${chalk.underline.bold(
            this.parsedJobs.length
          )} Results exported successfully\n`
        )
      );
      // return false;
    } else {
      await this.scrapWebSite(this.nextPageLink);
    }
  }
}

module.exports = Scraper;
