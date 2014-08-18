describe("module", function() {
  beforeEach(function() {
    browser.get("./examples/example-example101/index.html");
  });

  it('should add Hello to the name', function() {
    expect(element(by.binding("{{ greeting }}")).getText()).toEqual('Bonjour World!');
  });
});
