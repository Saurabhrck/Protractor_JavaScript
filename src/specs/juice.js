const { baseUrl } = require("../../config.js").config;
const { browser, element, By, protractor } = require("protractor");
const EC = protractor.ExpectedConditions;

describe("Login to juice shop", () => {
  beforeEach(() => {
    browser.get(baseUrl);
  });
  it("Navigate to login page", () => {
    element(By.css("button[aria-label='Close Welcome Banner']")).click();
    element(By.id("navbarAccount")).click();
    element(By.id("navbarLoginButton")).click();
    element(By.id("email")).sendKeys("test@test.com");
    element(By.id("password")).sendKeys("password");
    element(By.id("loginButton")).click();
    expect(
      element(
        By.css("button[aria-label='Show the shopping cart']")
      ).isDisplayed()
    ).toBeTrue;
    element(By.id("navbarAccount")).click();
    element(
      By.css("button[aria-label='Show Orders and Payment Menu']")
    ).click();
    element(By.css("button[aria-label='Go to order history page']")).click();
    browser.wait(
      EC.visibilityOf(
        element(By.xpath("//mat-card-title[contains(text(),'Order History')]"))
      ),
      50000
    );
  });
});
