describe("module:ng.filter:currency", function() {
  beforeEach(function() {
    browser.get("./examples/example-example51/index.html");
  });

  it('should init with 1234.56', function() {
    expect(element(by.id('currency-default')).getText()).toBe('$1,234.56');
    expect(element(by.binding('amount | currency:"USD$"')).getText()).toBe('USD$1,234.56');
  });
  it('should update', function() {
    if (browser.params.browser == 'safari') {
      // Safari does not understand the minus key. See
      // https://github.com/angular/protractor/issues/481
      return;
    }
    element(by.model('amount')).clear();
    element(by.model('amount')).sendKeys('-1234');
    expect(element(by.id('currency-default')).getText()).toBe('($1,234.00)');
    expect(element(by.binding('amount | currency:"USD$"')).getText()).toBe('(USD$1,234.00)');
  });
});
