## View Helpers

This module is used as express middleware and it provides helper methods to the views.

## Installation

```sh
$ npm install view-helpers
```

or specify in package.json as dependency

## Usage

with express

```js
var helpers = require('view-helpers')
app.use(helpers('app name')) // make sure you declare this middleware after `connect-flash` and `express.session` middlewares and before `express.router`.
```

In your views you would have access to some methods and variables. The middleware also exposes `req` object.

### API

* `createPagination(pages, page)` - creates pagination
* `formatDate(date)` - date is a mongoose `Date` object
* `isActive('/link/href/')` - to add active class to the link
* `stripScript(str)` - to escape javascript inputs
* `req.isMobile` - detects if the request is coming from tablet/mobile device
* `res.render('template', locals, cb)` - mobile templates - If the request is coming from a mobile device, then it would try to look for a `template.mobile.jade` (or with the registered extension, it can also be ejs, hbs etc) file in the views folder and render it. This has been added in the 0.1.0 version.  Refer to [166ebf2](https://github.com/madhums/node-view-helpers/commit/166ebf2#L0L16) for more details.

## License
(The MIT License)

Copyright (c) 2013 Madhusudhan Srinivasa < [madhums8@gmail.com](mailto:madhums8@gmail.com) >

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
