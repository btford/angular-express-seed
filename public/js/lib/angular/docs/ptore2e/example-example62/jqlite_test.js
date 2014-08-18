describe("module:ng.service:$sce", function() {
  beforeEach(function() {
    browser.get("./examples/example-example62/index.html");
  });

describe('SCE doc demo', function() {
  it('should sanitize untrusted values', function() {
    expect(element.all(by.css('.htmlComment')).first().getInnerHtml())
        .toBe('<span>Is <i>anyone</i> reading this?</span>');
  });

  it('should NOT sanitize explicitly trusted values', function() {
    expect(element(by.id('explicitlyTrustedHtml')).getInnerHtml()).toBe(
        '<span onmouseover="this.textContent=&quot;Explicitly trusted HTML bypasses ' +
        'sanitization.&quot;">Hover over this text.</span>');
  });
});
});
