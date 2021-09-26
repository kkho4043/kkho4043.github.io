//naver kakao payco login js
var express = require('express');
var app = express();

//naver info
var nclient_id = 'naver clinet_id';
var nclient_secret = 'naver clinet_secret';

//kakao info
var kclient_id = 'kakao clinet_id';
var kclient_secret ='kakao clinet_secret';

//payco info
var pclient_id = 'payco clinet_id'; 
var pclient_secret ='payco clinet_secret';
var state = ran32();

app.get('/sociallogin', function (req, res) {

  if (req.query.social == 'naver') {
    res.redirect(encodeURI('https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + nclient_id + '&redirect_uri=http://www.kangtaeuk.com/callback?social=naver&state=' + state));
  } else if (req.query.social == 'kakao') {
    res.redirect(encodeURI('https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=' + kclient_id + '&redirect_uri=http://www.kangtaeuk.com/callback?social=kakao'));
  } else if (req.query.social == 'payco') {
    res.redirect(encodeURI('https://id.payco.com/oauth2.0/authorize?response_type=code&client_id=' + pclient_id + '&serviceProviderCode=FRIENDS&redirect_uri=http://www.kangtaeuk.com/callback?social=payco&state=' + state + '&userLocale=ko_KR'));
  }
});


app.get('/callback', function (req, res) {

  code = req.query.code;
  state = req.query.state;
  var request = require('request');
  if (req.query.social == 'naver') {
    
    var options = {
      url: 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='+ nclient_id + '&client_secret=' + nclient_secret + '&redirect_uri=redirect_uri=http://www.kangtaeuk.com/callback?social=naver&code=' + code + '&state=' + state
    };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        userprofile(res,'naver',body);
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });

  } else if (req.query.social == 'kakao') {
    console.log('here');
    var options = {
      url: 'https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id='+ kclient_id + '&client_secret=' + kclient_secret + '&code=' + code
    };
    request.post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        userprofile(res,'kakao',body);
      } else {

        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });

  } else if (req.query.social == 'payco') {
    var options = {
      url: 'https://id.payco.com/oauth2.0/token?grant_type=authorization_code&client_id='+ pclient_id + '&client_secret=' + pclient_secret + '&code=' + code +'&state=' + state
    };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        userprofile(res,'payco',body);
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });

  }
});

function userprofile(res,social,token){
  console.log(token);
  var tokenJson = JSON.parse(token);
  var access_token = tokenJson.access_token;
  console.log(access_token);
  var header ="Bearer " + access_token;
  var request = require('request');
  if(social == 'naver'){
    var options = {
      url: 'https://openapi.naver.com/v1/nid/me',
      headers: {'Authorization': header}
   };
   request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      console.log('error');
      if(response != null) {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    }
  });

  }else if(social == 'kakao'){
    var options = {
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {'Authorization': header}
   };
   request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      console.log('error');
      if(response != null) {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    }
  });
   
  }else if(social == 'payco'){
    var options = {
      url: 'https://apis-paycoid.krp.toastoven.net/payco/friends/find_member_v2.json',
      headers: {'client_id': pclient_id,'access_token':access_token}
   };
   request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      console.log('error');
      if(response != null) {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    }
  });
  }
}
app.listen(8080, function () {
  console.log("server listen 8080");
});

function ran32() {
  var ran = (Math.random().toString(36));
  return ran;
}
