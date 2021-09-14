const HtmlReporter = require("protractor-beautiful-reporter");

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
    jasmine.getEnv().addReporter(
      new HtmlReporter({
        baseDirectory: "target/screenshots",
        takeScreenShotsOnlyForFailedSpecs: true,
        preserveDirectory: true,
        gatherBrowserLogs: false,
        docTitle: "Test Report",
        clientDefaults: {
          columnSettings: {
            displayTime: true,
            displayBrowser: true,
            displaySessionId: false,
            displayOS: false,
            inlineScreenshots: false,
          },
        },
      }).getJasmine2Reporter()
    );
  },
  suites: {
    Whole: ["./src/specs/*.js"],
    Smoke: ["./src/specs/*Smoke.js"],
    Regression: ["./src/specs/*Regression.js"],
  },
};
