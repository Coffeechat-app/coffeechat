# welcome to coffeechat

-------------

<b>The free and open-source discord clone powered by socket.io, mongodb, ejs and express</b>

-------------

1. **protected**

- No data such as credentials are held onsite, they are transported to the mongodb cluster and all passwords are encrypted with Bcrypt

2. **simple to setup**

- just change the values in .env to get started!

3. **open-source!**

- unlike discord, this version is open source and free like discord!

4. **fast**

- we use defresh to load our pages fast, and with no complications!

------------

This was based off [minicord](https://github.com/ThalKod/discord-clone)- by Thalkod

----------

**is this causing issues? if so delete it at your own risk!**
```js
// app.js
function checkHttps(req, res, next){
  // protocol check, if http, redirect to https
  
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
    return next()
  } else {
    res.redirect('https://' + req.hostname + req.url);
  }
}

app.all('*', checkHttps);
```
