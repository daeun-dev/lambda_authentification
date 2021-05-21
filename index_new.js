var Redis = require('ioredis');
var jwt = require('jwt-simple');

exports.handler =  function(event, context, callback) {
    var redis = new Redis(6379,'w-awps-di-an2-ecrds-dev-dxp.wimlsn.0001.apn2.cache.amazonaws.com');
    var expireTm = 3600;
    // var token = event.authorizationToken;
    // var id = event.body.id;

    var payload = { foo: 'bar' };
    var secret = 'abc';
    //var token = null;
    var token = jwt.encode(payload, secret);
    var id = "ddxp1";
    redis.set(token, id, 'EX', expireTm);
    
    if(token){
        // ECS test Redis connection point
        // var redis = new Redis(6379,'w-awps-di-an2-ecrds-dev-dxp.wimlsn.0001.apn2.cache.amazonaws.com');
        
        redis.get(token, function (err, result) {
            if (err) {
                console.error(err);
                callback("Error: Invalid user");
                redis.disconnect();
            } else {
                if (id === result) {
                    
                     redis.ttl(token).then( function (leftTm) {
                    
                        if (leftTm > 0 && leftTm <= expireTm) {
                            redis.set(token, id, 'EX', expireTm);

                            redis.ttl(token).then(function (result) {
                                console.log("leftTime:" + result);
                                console.log("success");
                            });
                            
                            callback(null, generatePolicy('user', 'Allow', event.methodArn));
                            redis.disconnect();
                            
                        } else {
                            console.log("error");
                            callback(null, generatePolicy('user', 'Deny', event.methodArn));
                            redis.disconnect();
                        }
                    });
                } else {
                    callback("Error: Invalid token");
                    redis.disconnect();
                }
            }
        });

    }else{
        callback("Unauthorized");  
        redis.disconnect();
    }
    
   
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    // Optional output with custom properties of the String, Number or Boolean type.
    // authResponse.context = {
    //     "stringKey": "stringval",
    //     "numberKey": 123,
    //     "booleanKey": true
    // };
    return authResponse;
}
