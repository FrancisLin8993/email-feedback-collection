const _ = require("lodash");
const Path = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const MessageObject = require("../services/MessageObject");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

mongoose.Promise = global.Promise;
const Survey = mongoose.model("surveys");

module.exports = app => {
  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: 0
    });

    res.send(surveys);
  });

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for voting");
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(",").map(email => ({ email })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    const sgMail = require("@sendgrid/mail");
    const keys = require("../config/keys");
    sgMail.setApiKey(keys.sendGridKey);

    try {
      const result = await sgMail.send(
        MessageObject(survey, surveyTemplate(survey))
      );
      console.log(result);
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user);
    } catch (error) {
      res.status(422).send(error);
    }
  });

  app.post("/api/surveys/webhooks", (req, res) => {
    const path = new Path("/api/surveys/:surveyId/:choice");

    _.chain(req.body);
    _.map(({ email, url }) => {
      const matchedObject = path.test(new URL(url).pathname);
      if (matchedObject) {
        return {
          email,
          surveyId: matchedObject.surveyId,
          choice: matchedObject.choice
        };
      }
    })
      .compact()
      .uniqBy("email", "surveyId")
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, isResponded: false }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { "recipients.$.responded": true },
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();
  });
};
