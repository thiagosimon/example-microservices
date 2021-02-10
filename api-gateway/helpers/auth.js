const jwt = require('jsonwebtoken');
var configAuth = require('../config/auth');

module.exports = {
    checkToken: function(req, res, next) {
        var token = req.headers['authorization'];
        var correlationId = req.headers['x-correlation-id'];
        
        jwt.verify(token, configAuth.secret, function(err, decoded) {
            if (err) {
                return res.status(401).json(instantiateMessage(401, 'response.invalid.token'));
            }
            if (!correlationId || correlationId == null || correlationId == 'undefined'){
                return res.status(401).json(instantiateMessage(401, 'response.missing.correlation.id'));
            }
            
            let copy = JSON.parse(JSON.stringify(decoded));
            try {
                globalElkApm.setLabel("x_correlation_id", correlationId);
                if (decoded){
                    globalElkApm.setUserContext({
                        id: decoded.user._id,
                        email: decoded.user.email
                    });
                    globalElkApm.setLabel("user_type", decoded.user.type);
                }
            } catch (error) {
            }
            
            req.headers['jwtdecoded'] = JSON.stringify(copy);
            return next();
        });
        
    }
}