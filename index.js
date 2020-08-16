const express = require("express");
const exphbr = require("express-handlebars");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

//Setting up a view engine for handlebars
app.engine("handlebars", exphbr());
app.set("view engine", "handlebars");

//Defining a public folder for static files like css or even html
app.use("/public", express.static(path.join(__dirname, "public")));

//Settings for BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Tells express not to look for layout.handlebars
app.locals.layout = false;

//Rendering contact.handlebars on main page
app.get("/", (req, res) => {
  res.render("contact");
});

//Main function responsible for sending a message
app.post("/send", (req, res) => {
  console.log(req.body);

  const output = `
  <p>New contact request</p>
  <h3>Details of contact</h3>
    <li>Email: ${req.body.emailBox}</li>
  <h3>Message</h3>
  <p>${req.body.textBox}</p>
`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "yourHostName",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "yourHostName@host.com", // user
      pass: "StrongAndComplicatedPassword", // password
    },
    tls: {
      rejectUnauthorized: false, //Important if u are going to use it on a local machine
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"coolName" <test@test.com>', // sender address
    to: "donald.trump@gmail.com", // list of receivers
    subject: "Nodemailer contact form", // Subject line
    text: "Content of the message", // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("contact", { msg: "Email has been sent" });
  });
});

app.listen("3030", () => {
  console.log("I am alive");
});
