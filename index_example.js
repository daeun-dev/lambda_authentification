var Redis = require('ioredis');
var jwt = require('jwt-simple');
var redis = new Redis(6379,'w-awps-di-an2-ecrds-dev-dxp.wimlsn.0001.apn2.cache.amazonaws.com');
 
exports.handler =  function(event, context, callback) {
    var expireTm = 3600;
   // var token = event.authorizationToken;
    //var id = event.body.id;

    var payload = { foo: 'bar' };
    var secret = 'abc';
    //var expires=moment().add(1,'hour').valueOf(); 
    //var token = jwt.encode(payload, secret,{exp: expires});
    var token = jwt.encode(payload, secret);
    var id = "ddxp";
    //var redis = new Redis(6379,'w-awps-di-an2-ecrds-dev-dxp.wimlsn.0001.apn2.cache.amazonaws.com');
    redis.set(token, id, 'EX', 1000);
    
    if(token){
        //var redis = new Redis(6379,'w-awps-di-an2-ecrds-dev-dxp.wimlsn.0001.apn2.cache.amazonaws.com');
        
        redis.get(token, function (err, result) {
            if (err) {
                console.error(err);
                callback("Error: Invalid user");
            } else {
                if (id === result) {
                    console.log("pass1");

                    // const redisleftTmVal = async() => await redis.ttl(token).then(function (result) {
                    //     console.log("pass111:" + result);
                    //     return result;
                    // });
                    
                    redis.ttl(token).then(function (result) {
                        console.log("pass111:" + result);
                        
                        if (result > 0 && result <= expireTm) {
                            redis.set(token, id, 'EX', expireTm);
                            console.log("pass2");
    
                            redis.ttl(token).then(function (result) {
                                console.log("pass222:" + result);
                                console.log("success");
                            });
                        } else {
                            console.log("eeeeeeeeeeror");
                        }
 
                    });

                    // console.log("pass21111122:" + redisleftTmVal);

                    // if (redisleftTmVal > 0 && redisleftTmVal <= expireTm) {
                    //     redis.set(token, id, 'EX', expireTm);
                    //     console.log("pass2");

                    //     const leftTm2 = redis.ttl(token).then(function (result) {
                    //         console.log("pass222:" + leftTm2);
                    //         return result;
                    //     });
                    //     console.log("success");
                    // } else {
                    //     console.log("eeeeeeeeeeror");
                    // }
                    
                    //expire 갱신
                    //redis.get(token).setTimeout()
                    //redis.set(token, id,"expires" : new Date(Date.now() + hour)});
                    callback(null, generatePolicy('user', 'Allow', event.methodArn));
                } else {
                    callback("Error: Invalid token");
                }
            }
        });

    }else{
        callback("Unauthorized");   
    }
    
   

    
    // redis.get(token, function (err, result) {
    //     if (err) 
    //       console.error(err);
    //     else 
    //       console.log(result);
    //     client.quit(()=> {
    //       callback(err, {body: "Result :"+result});
    //   });
    //   })

    // switch (token) {
    //     case 'allow':
    //         callback(null, generatePolicy('user', 'Allow', event.methodArn));
    //         break;
    //     case 'deny':
    //         callback(null, generatePolicy('user', 'Deny', event.methodArn));
    //         break;l
    //     case 'unauthorized':
    //         callback("Unauthorized");   // Return a 401 Unauthorized response
    //         break;
    //     default:
    //         callback("Error: Invalid token"); // Return a 500 Invalid token response
    // }
};

// var redisleftTm = function(token){
//     return redis.ttl(token).then(function(resolve, result){
//                         console.log("pass111:"+result);
//                         resolve(result);
//                     });
// }

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





/*var Redis = require('ioredis');

exports.handler = (event, context, callback) => {
var client = new Redis(6379,'w-awps-di-an2-ecrds-dev-dxp.wimlsn.0001.apn2.cache.amazonaws.com');


var id = event.id;
var password = event.password;

client.set(id, {"password" : password}, (error, result) => {
if(error)
	console.info("error =", error);
else
	console.info("result:::", result);
client.quit(()=> {
	callback(error, {body: "Result :"+result});
});

})
client.set(id, password);
client.get(id, function (err, result) {
  if (err) 
    console.error(err);
  else 
    console.log(result);
  client.quit(()=> {
	callback(err, {body: "Result :"+result});
});
})
}*/
