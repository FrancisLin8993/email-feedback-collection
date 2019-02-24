const sendgrid = require("sendgrid");
const mailHelper = sendgrid.mail;
const keys = require("../config/keys");

class Mailer extends mailHelper.Mail {
  constructor({ subject, recipients }, content) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new mailHelper.Email("no-reply@emailfc.com");
    this.subject = subject;
    this.body = new mailHelper.Content("text/html", content);
    this.recipients = this.formatAddresses(recipients);

    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new mailHelper.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new mailHelper.TrackingSettings();
    const clickTracking = new mailHelper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalization = new mailHelper.Personalization();
    this.recipients.forEach(recipient => {
      personalization.addTo(recipient);
    });
    this.addPersonalization(personalization);
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: "POST",
      path: "v3/mail/send",
      body: this.toJSON()
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
