const passport = require("passport");

module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get("/auth/google/callback", passport.authenticate("google"));

  app.get("/apis/logout", (req, res) => {
    req.logout();
    res.send("Logout sucessfully");
  });

  app.get("/apis/current-user", (req, res) => {
    res.send(req.user);
  });
};
