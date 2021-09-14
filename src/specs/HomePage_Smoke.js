const obj = require("../locators/HomePage.js");
const { baseUrl } = require("../../config.js").config;
const { browser } = require("protractor");

describe("Validate Home page", () => {
  beforeEach(() => {
    browser.get(baseUrl);
  });
  it("Validate Home Page", () => {
    expect(obj.getStartedCta.isDisplayed()).toBeTrue;
  });

  afterEach(() => {
    browser.driver.manage().deleteAllCookies();
  });
});
