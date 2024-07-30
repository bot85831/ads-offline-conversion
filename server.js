// write simple express server having two routes

// 1. GET /
// 2. GET /register

const env = require("dotenv");
env.config();

const express = require("express");
const fbConversion = require("./utils/fbConversion");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/ig-webhook", (req, res) => {
  if (req.query["hub.verify_token"] !== "this_is_my_token") {
    return res.status(403).send("Invalid verify token");
  }

  const { hub, query } = req.query;
  console.log("hub: ", hub);
  console.log("query: ", query);

  return res.send(req.query["hub.challenge"]);
});

app.post("/ig-webhook", (req, res) => {
  console.log("req.body: ", req.body);
  return res.json({ status: "success" });
});

app.post("/register", async (req, res) => {
  // here we need to track the conversion, and send it to facebook pixel along with the user data, event name, and other details
  const dummyData = {
    user: {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      country: "US",
      email: "dummy@gmail.com",
      phone: ["1234567890"],
      ip: "0.0.0.0",
      user_agent: "Mozilla/5.0",
      fbc: "1234567890"
    },
    eventName: "Purchase",
    otherDetails: {
      value: 100,
      currency: "USD",
      contents: [],
      event_source_url: "http://app.local",
      action_source: "website"
    }
  };

  try {
    await fbConversion(
      dummyData.eventName,
      dummyData.user,
      dummyData.otherDetails
    );
  } catch (error) {
    console.log("Error: ", error);
  }

  res.json({ message: "User registered successfully!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
