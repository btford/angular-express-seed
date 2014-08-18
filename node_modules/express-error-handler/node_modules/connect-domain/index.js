module.exports = process.env.CONNECT_DOMAIN_COV ? require('./lib-cov/connect-domain') : require('./lib/connect-domain');
