describe("module:ng.type:ngModel.NgModelController", function() {
  beforeEach(function() {
    browser.get("./examples/example-NgModelController/index.html");
  });

it('should data-bind and become invalid', function() {
  if (browser.params.browser == 'safari' || browser.params.browser == 'firefox') {
    // SafariDriver can't handle contenteditable
    // and Firefox driver can't clear contenteditables very well
    return;
  }
  var contentEditable = element(by.css('[contenteditable]'));
  var content = 'Change me!';

  expect(contentEditable.getText()).toEqual(content);

  contentEditable.clear();
  contentEditable.sendKeys(protractor.Key.BACK_SPACE);
  expect(contentEditable.getText()).toEqual('');
  expect(contentEditable.getAttribute('class')).toMatch(/ng-invalid-required/);
});
});
