var express = require('express')
var path = require('path')
var app = express()
 
app.use(express.static(path.join(__dirname, 'dist')))
app.listen(8080, () => {
    console.log("Browse http://localhost:8080/index.html")
});