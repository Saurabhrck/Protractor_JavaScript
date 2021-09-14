const obj = require("../locators/HomePage.js");
const data = require("../dataLayer/Expected.js").expected;
const { baseUrl } = require("../../config.js").config;
const { browser } = require("protractor");
const using = require("jasmine-data-provider");

describe("Test Navigation", () => {
  beforeEach(() => {
    browser.get(baseUrl);
  });
  using(data, function (datum, description) {
    it(description, () => {
      obj.getStartedCta.click();
      expect(browser.getCurrentUrl()).toContain(datum.titleExpected);
    });

    afterEach(() => {
      browser.driver.manage().deleteAllCookies();
    });
  });
});
