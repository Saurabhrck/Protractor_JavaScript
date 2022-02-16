const HtmlReporter = require("protractor-beautiful-reporter");
const AllureReporter = require("jasmine-allure-reporter");
const {
  allureReporter,
} = require("jasmine-allure-reporter/src/Jasmine2AllureReporter");

exports.config = {
  baseUrl: "https://angular.io/",
  directConnect: true,
  seleniumAddress: "http://localhost:4444/wd/hub",
  specs: ["./src/specs/*.js"],
  framework: "jasmine",
  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000,
    showColors: true,
  },
  capabilities: {
    browserName: "chrome",
    shardTestFiles: true,
    maxInstances: 2,
  },
  onPrepare: () => {
    browser.driver.manage().window().maximize();
    jasmine.getEnv().addReporter({
      specStarted(result) {
        jasmine.getEnv().currentSpec = result;
      },
      specDone() {
        jasmine.getEnv().currentSpec = null;
      },
    });
    jasmine.getEnv().addReporter(
      new AllureReporter({
        resultsDir: "target/allure-results",
      })
    );
    jasmine.getEnv().afterEach(function (done) {
      if (jasmine.getEnv().currentSpec.failedExpectations.length > 0) {
        console.log("Attaching report");
        browser.takeScreenshot().then(function (png) {
          allure.createAttachment(
            "Screenshot",
            function () {
              return new Buffer(png, "base64");
            },
            "image/png"
          )();
          done();
        });
      } else {
        done();
      }
    });
  },
  suites: {
    Whole: ["./src/specs/*.js"],
    Smoke: ["./src/specs/*Smoke.js"],
    Regression: ["./src/specs/*Regression.js"],
  },
};
