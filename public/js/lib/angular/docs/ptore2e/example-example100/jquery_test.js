describe("module", function() {
  beforeEach(function() {
    browser.get("./examples/example-example100/index-jquery.html");
  });

  it('should add Hello to the name', function() {
    expect(element(by.binding("{{ 'World' | greet }}")).getText()).toEqual('Hello, World!');
  });
});
