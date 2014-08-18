describe("module:ng.filter:date", function() {
  beforeEach(function() {
    browser.get("./examples/example-example53/index.html");
  });

  it('should format date', function() {
    expect(element(by.binding("1288323623006 | date:'medium'")).getText()).
       toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
    expect(element(by.binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).getText()).
       toMatch(/2010\-10\-2\d \d{2}:\d{2}:\d{2} (\-|\+)?\d{4}/);
    expect(element(by.binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).getText()).
       toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
  });
});
