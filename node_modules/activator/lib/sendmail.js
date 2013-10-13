/*jslint node:true */
/*global unescape, escape */
var mailer = require('nodemailer');


module.exports = function(turl) {
  var url = require('url').parse(turl||""), transport, host, port, auth, from, protocol, sysopts,
  parts, domain;
  // do we have a proper URL?
  url.protocol = url.protocol || "smtp:";
  url.host = url.host || "localhost";
  url.port = url.port || "25";
  url.path = url.path || "/localhost/"+escape("local@localhost");
  
  protocol = url.protocol.replace(/:$/,"").toUpperCase();
  host = url.host.split(":")[0];
  port = parseInt(url.port,10);
  parts = url.path.split(/\//);
  domain = parts[1];
  from = unescape(parts[2]);
  sysopts = {host: host, port:port, name: domain};
  if (url.auth) {
    auth = url.auth.split(":");
    sysopts.auth = {user:auth[0],pass:auth[1]};
  }

  // create reusable transport method (opens pool of SMTP connections)
  transport = mailer.createTransport(protocol,sysopts);

  return function(to,subject,body,cb) {
    var opts = {
      from: from,
      to: to,
      subject: subject,
      text: body
    };
    transport.sendMail(opts,cb);
  };
};
