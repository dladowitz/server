const passport = require("passport");

module.exports = app => {
  app.get("/", (req, res) => {
    console.log("\nreq.user: ", req.user);
    console.log("res.user: ", res.user + "\n");
    console.log("req.session", req.session);
    res.send("Jello World");
  });

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.send("Logged In Propperly");
    }
  );

  app.get("/api/current_user", (req, res) => {
    console.log("\nreq.user: ", req.user);
    console.log("res.user: ", res.user + "\n");
    console.log("req.session", req.session);
    res.send(req.user);
    // res.send(req.session);
  });

  app.get("/api/logout", (req, res) => {
    console.log("\nreq.user: ", req.user);
    console.log("res.user: ", res.user + "\n");
    console.log("req.session", req.session);
    req.logout();
    console.log("\nUser logged out\n\n");
    res.redirect("/");
  });
};
