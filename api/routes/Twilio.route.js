const express = require("express");
const router = express();
const twilio = require("twilio");

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

router.get("/token", (req, res) => {
  const identity = `user-${new Date().getTime()}`;
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { identity: identity }
  );

  const grant = new VideoGrant();
  token.addGrant(grant);

  res.send({
    token: token.toJwt(),
  });
});

module.exports = router;
