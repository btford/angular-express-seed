# Activator

## Overview
activator is the **simple** way to handle user activation and password reset for your nodejs apps!

Example:
    
    var express = require('express'), app = express(), activator = require('activator');
		
		activator.init({user:userModel,url:URL,templates:mailTemplatesDir});
		
		app.user(app.router);
		
		// activate a user
		app.post("/user",activator.createActivate);
		app.put("/user/:user/active",activator.completeActivate);
		
		// reset a password
		app.post("/passwordreset",activator.createPasswordReset);
		app.put("/passwordreset/:user",activator.completePasswordReset);



## Installation
Installation is simple, just install the npm module:

    npm install activator


## Usage
First *initialize* your activator instance, then use its methods to activate users and reset passwords

### Initialization
In order for activator to work, it needs to be able to read your user instances and save to them. It also needs to be able to compose and send emails.

    activator = require('activator');
		activator.init(config);

The `config` object passed to `activator.init()` **must** contain the following keys:

* `user`: object that allows activator to find and save a user object. See below.
* `emailProperty`: the property of the returned user object that is the email of the recipient. Used in `user.find()`. Defaults to "email".
* `url`: string that describes how we will send email. See below.
* `templates`: string describing the full path to the mail templates. See below.


##### user
The user object needs to have two methods, with the following signatures:

    user.find(login,callback);
		
Where:

* `login`: string with which the user logs in. activator doesn't care if it is an email address, a user ID, or the colour of their parrot. `user.find()` should be able to find a user based on it.
* `callback`: the callback function that `user.find()` should call when complete. Has the signature `callback(err,data)`. If there is an error, `data` should be `null` or `undefined`; if there is no error but no users found, both `err` *and* `data` **must** be `null` (not `undefined`). If an object is found, then `data` **must** be a single JavaScript object, and the object **must** have a property containing the email address. By default, it is named `email`, but you can override it with `config.emailProperty`.

activator also needs to be able to save a user:

    user.save(id,data,callback);

Where:

* `id`: ID of the user to save
* `data`: the data to update the user as an object, e.g.: `{activation_code: "asqefcehe78qa"}`
* `callback`: the callback function that `user.save()` should call when complete. Has the signature `callback(err)`. If the save is successful, `err` **must** be `null` (not `undefined`).

What properties will it add to the user object in `save()`?

1. activation: When a new activation is created, it will save a random string to `activation_code`. For example: `user.save("256",{activation_code:"ABT678HB"})`. When activation is complete, it will set the code to "X".
2. password reset: When a new password reset is created, it will save a random string to `password_reset_code` and an integer representing the expiry at `password_reset_time`. For examle, `user.save("256",{password_reset_code:"ABT678YY",password_reset_time:1377151862978})`. When password reset is complete, it will set the code to "X" and the time to 0.

##### url
URL string of how activator should send mail. Structured as follows:

    protocol://user:pass@hostname:port/domain/sender
		
* `protocol`: normally "smtp", can be "smtps"
* `user`: the user with which to login to the SMTP server, if authentication is required.
* `pass`: the password with which to login to the SMTP server, if authentication is required.
* `hostname`: the hostname of the server, e.g. "smtp.gmail.com".
* `port`: the port to use.
* `domain`: the domain from which the mail is sent, when the mail server is first connected to.
* `sender`: the email to use as the sender or "from" of the emails sent. Can be in the format `name@domain.com` or `My Name <name@domain.com>`. Should always be URL-encoded (or else you'll never get it into a URL!)

##### templates
The directory where you keep text files that serve as mail templates. See below under the section templates.


### Activation
Activation is the two-step process wherein a user first *creates* their account and *then* confirms (or activates) it by clicking on a link in an email or entering a short code via SMS/iMessage/etc.

activator provides the route handlers to create the activation code on the account and send the email, and then confirm the entered code to mark the user activated.

activator does **not** create the user; it leaves that up to you, since everyone likes to do it just a little differently.


#### Create an activation
Activation is simple, just add the route handler *after* you have created the user:

````JavaScript
app.post("/users",createUser,activator.createActivate);
````

`activator.createActivate` needs access to several pieces of data in order to do its job:

* `id`: It needs the ID of the user, so that it can call `user.save(id,data)`
* `response.body`: Since `createUser` (in the above example) or anything you have done to create a user might actually want to send data back, `createActivate()` needs to be able to know what the body you want to send is, when it is successful and calls `res.send(201,data);`

`createActivate()` will look for these properties on `req.activator`. 

````JavaScript
req.activator = {
	id: "12345tg", // the user ID to pass to createActivate()
	body: "A message" // the body to send back along with the successful 201
}
````

If `createActivate()` cannot find `req.activator.id` or `req.user.id`, it will send a `500` error.

When done, activator will send a `201` response code and a response body as passed in `req.activator.body`.

#### Complete an activation
Once the user actually clicks on the link, you need to complete the activation:

````JavaScript
app.put("/users/:user/activation",activator.completeActivate);
````

activator will return a `200` if successful, a `400` if there is an error, along with error information, and a `404` if it cannot find that user.

activator assumes the following:

1. The express parameter `user` (i.e. `/users/:user/whatever/foo`) contains the user identifier to pass to `user.find()` as the first parameter. It will retrieve it using `req.param('user')`
2. The `req.body` or `req.query` will contain the parameter `code` which has the actual activation code. It will retrieve it using `req.param('code')`

If it is successful activating, it will return `200`, a `400` if there is an error (including invalid activation code), and a `404` if the user cannot be found.

### Password Reset
Password reset is a two-step process in which the user requests a password reset link, normally delivered by email, and then uses that link to set a new password. Essentially, the user requests a time-limited one-time code that is delivered to the user and allows them to set a new password.

#### Create a password reset
Creating a password reset is simple, just add the route handler:

````JavaScript
app.post("/passwordreset",activator.createPasswordReset);
````

When done, activator will send a `201` response code and a response body whose text content is the URL to be used to reset the password.

Activator assumes that the login/email/ID to search for will be in `req.param("user")`.

#### Complete a password reset
Once the user actually clicks on the link, you need to complete the password reset:

````JavaScript
app.put("/users/:user/passwordreset",activator.completePasswordReset);
````

activator will return a `200` if successful, a `400` if there is an error, along with error information, and a `404` if it cannot find that user.

activator assumes the following:

1. The express parameter `user` (i.e. `/users/:user/whatever/foo`) contains the user identifier to pass to `user.find()` as the first parameter. It will retrieve it using `req.param('user')`
2. The `req.body` or `req.query` will contain the parameter `code` which has the actual password reset code, and the parameter `password` which is the new password to set. It will retrieve them using `req.param('code')` and `req.param('password')`.

If it is successful resetting the password, it will return `200`, a `400` if there is an error (including invalid code), and a `404` if the user cannot be found.


### Templates
In order to send an email (yes, we are thinking about SMS for the future). activator needs to have templates. The templates are simple text files that contain the text or HTML to send.

The templates should be in the directory passed to `activator.init()` as the option `templates`. It **must** be an absolute directory path (how else is activator going to know, relative to what??). Each template file should be named according to its function: "activate" or "passwordreset". You can, optionally, add ".txt" to the end of the filename, if it makes your life easier.

Each template file must have 3 or more lines. The first line is the `Subject` of the email; the second is ignored (I like to use '-----', but whatever works for you), the third and all other lines are the content of the email.

Remember, activator is a *server-side* product, so it really has no clue if the page the user should go to is https://myserver.com/funny/page/activate/fooooo.html or something a little more sane like https://myserver.com/activate.html

How does activator know what to put in the email? **It doesn't; you do!**. You put the URL in the template files for passwordreset and activate. 

What you can do is have activator embed the necessary information into the templates before sending the email. Each template file follows a simplified [EJS](http://embeddedjs.com) style (very similar to PHP). All you need to do is embed the following anywhere (and as many times as you want) inside the template:

    <%= abc %>
		
and every such instance will be replaced by the value of `abc`. So if `abc = "John"`, then 

    This is an email for <%= abc %>, 
		   hi there <%= abc %>.

Will be turned into

    This is an email for John,
		   hi there John.
			 
So what variables are available inside the templates?

* `code`: the activation or password reset code
* `email`: the email of the recipient user
* `id`: the internal user ID of the user
* `request`: the `request` object that was passed to the route handler, from which you can extract lots of headers, for example the protocol at `req.protocol` or the hostname from `req.headers.host`. 

So if your password reset page is on the same host and protocol as the request that came in but at "/reset/my/password", and you want to include the code in the URL as part of a query but also add it to the page, you could do:


    Hello,
		
		You have asked to reset your password for MySite. To reset your password, please click on the following link:
		
		<%= request.protocol %><%= req.headers.host %>/reset/my/password?code=<%= code %>&user=<%= id %>
		
		Or just copy and paste that link and enter your code as <%= code %>.
		
		Thanks! 
		From: the MySite team




Internationalization support is just around the corner...

## Testing
To run the tests, from the root directory, run `npm test`.

## License
Released under the MIT License. 
Copyright Avi Deitcher https://github.com/deitch
