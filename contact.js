require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on localhost:3000");
})

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/form.html");
})

app.post("/", function (req, res) {
    const firstName = req.body.FNAME;
    const lastName = req.body.LNAME;
    const email = req.body.email;
    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }
    var subscribePerson = JSON.stringify(data);
    const url = process.env.API_URL;
    const options = {
        method : "POST",
        auth: process.env.AUTH
    };
    console.log(firstName, " ", lastName);
    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }
    });
    request.write(subscribePerson);
    request.end();
})
app.post("/failure", function (req, res) {
    res.redirect("/");
})
