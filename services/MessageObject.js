module.exports = ({ subject, recipients }, content) => {
  const formattedEmail = recipients.map(({email})=>{
    return email;
  });
  return {
    to: [formattedEmail],
    from: "no-reply@emailfc.com",
    subject,
    content: [
      {
        type:'text/html',
        value: content
      }
    ],
    trackingSettings: {
      clickTracking:{
        enable: true
      }
    }

  };
}
