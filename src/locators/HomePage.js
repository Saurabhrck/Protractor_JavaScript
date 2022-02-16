class Home {
  getStartedCta;
  constructor() {
    this.getStartedCta = element(
      by.cssContainingText("a[href='start']", "Get Started")
    );
  }
}

module.exports = new Home();
