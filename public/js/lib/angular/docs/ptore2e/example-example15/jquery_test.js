describe("module:ng.directive:ngBindHtml", function() {
  beforeEach(function() {
    browser.get("./examples/example-example15/index-jquery.html");
  });

  it('should check ng-bind-html', function() {
    expect(element(by.binding('myHTML')).getText()).toBe(
        'I am an HTMLstring with links! and other stuff');
  });
});
