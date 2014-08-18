describe("module:ng.directive:ngDisabled", function() {
  beforeEach(function() {
    browser.get("./examples/example-example6/index-jquery.html");
  });

  it('should toggle button', function() {
    expect(element(by.css('button')).getAttribute('disabled')).toBeFalsy();
    element(by.model('checked')).click();
    expect(element(by.css('button')).getAttribute('disabled')).toBeTruthy();
  });
});
