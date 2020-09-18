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
    const url = "https://us18.api.mailchimp.com/3.0/lists/85b60ae405";
    const options = {
        method : "POST",
        auth: "tieukhang:612d98c4969932de8af3ab36edf13678-us18"
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
//API key
//db95e7cfdf516ee0ac0090510f779fd7-us18
//listID
//85b60ae405