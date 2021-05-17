var Redis = require('ioredis');
// var jwt = require('jwt-simple');

exports.handler =  function(event, context, callback) {
    var token = event.authorizationToken;
    var id = event.body.id;

    if(token){
        var redis = new Redis(6379,'w-awps-di-an2-ecrds-dev-dxp.wimlsn.0001.apn2.cache.amazonaws.com');
        //var hour = 3600000;

        if(redis.exists(token)===1){
         //redis.get(token, function (err, result) {
        
        }else{
           callback("Error: Invalid token");   
           break;
        }
   
        redis.set(token, {"password" : password,"expires" : new Date(Date.now() + hour)});
    }else{

      callback(null, generatePolicy('user', 'Deny', event.methodArn));
       break;

    }
    
   

    
    redis.get(token, function (err, result) {
        if (err) 
          console.error(err);
        else 
          console.log(result);
        client.quit(()=> {
          callback(err, {body: "Result :"+result});
      });
      })
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
    authResponse.context = {
        // "stringKey": "stringval",
        // "numberKey": 123,
        // "booleanKey": true
    };
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
