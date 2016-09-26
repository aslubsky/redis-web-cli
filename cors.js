var exports = module.exports = {};

exports.cors = function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.setHeader('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.setHeader('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.writeHead(200);
        res.end();
    } else if(next) {
        next();
    }
}
