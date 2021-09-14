class Home {
  getStartedCta;
  constructor() {
    this.getStartedCta = element(
      by.cssContainingText("a[href='docs']", "Get Started")
    );
  }
}

module.exports = new Home();
