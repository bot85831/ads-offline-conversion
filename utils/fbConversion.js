const axios = require("axios");
const crypto = require("crypto");
const uuid = require("uuid");

// data = [
//   {
//     event_name: "Purchase",
//     event_time: 1721898612,
//     user_data: {
//       em: ["309a0a5c3e211326ae75ca18196d301a9bdbd1a882a4d2569511033da23f0abd"],
//       ph: [
//         "254aa248acb47dd654ca3ea53f48c2c26d641d23d7e2e93a1ec56258df7674c4",
//         "6f4fcb9deaeadc8f9746ae76d97ce1239e98b404efe5da3ee0b7149740f89ad6"
//       ],
//       client_ip_address: "123.123.123.123",
//       client_user_agent: "$CLIENT_USER_AGENT",
//       fbc: "fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
//       fbp: "fb.1.1558571054389.1098115397"
//     },
//     custom_data: {
//       currency: "usd",
//       value: 123.45,
//       contents: [
//         {
//           id: "product123",
//           quantity: 1,
//           delivery_category: "home_delivery"
//         }
//       ]
//     },
//     event_source_url: "http://jaspers-market.com/product/123",
//     action_source: "website"
//   }
// ];

/**
 * This function will be used to send the conversion data to facebook pixel along with the user data, event name, and other details
 * @param {Object} user - The user object
 * @param {String} eventName - The event name
 * @param {Object} otherDetails - The other details
 * @returns {void}
 * @example
 * const user = {
 *  id: 1,
 * name: "John Doe",
 * email: "xyz@gmail.com"
 * }
 * const eventName = "purchase"
 * const otherDetails = {
 * value: 100,
 * currency: "USD"
 * }
 * fbConversion(user, eventName, otherDetails)
 */
const fbConversion = async (eventName, userDetails, otherDetails) => {
  // we can generate the fbp on server as well, just we need to keep subdomainindex as 1
  // fbp : version.subdomainIndex.creationTime.randomnumber
  const fbp = `fb.1.${Math.floor(Date.now() / 1000)}.${Math.floor(
    Math.random() * 10000000000000
  )}`;

  // we'll need to format fbp properly : format is fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
  // const fbc = `fb.1.${Math.floor(Date.now() / 1000)}.${otherDetails.fbc}`;

  // format the data to be sent to facebook pixel,
  // we'll also send the fbc and fbp parameters, which are used to track the user's interaction with the website and better ad targeting/optimization
  const conversionData = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: uuid.v4(),
        user_data: {
          fn: hashData(userDetails.firstName),
          ln: hashData(userDetails.lastName),
          country: hashData(userDetails.country),
          em: hashData(userDetails.email),
          ph: userDetails.phone
            ? userDetails.phone.map(phone => hashData(phone))
            : [],
          client_ip_address: userDetails.ip,
          client_user_agent: userDetails.user_agent,
          fbc: otherDetails.fbc,
          fbp
        },
        custom_data: {
          currency: otherDetails.currency,
          value: otherDetails.value,
          contents: otherDetails.contents,
          planGroup: "agency v10",
          membership: "agency"
        },
        event_source_url: otherDetails.event_source_url,
        action_source: "website" // this can be "app" or "website"
      }
    ]
    // test_event_code: "TEST99179" // * Can be used to test the conversion data
  };

  // log the info before sending it to facebook pixel
  console.dir(conversionData, { depth: null });

  console.log(
    "Sending conversion data to facebook pixel...",
    process.env.FB_PIXEL_ID,
    process.env.FB_ACCESS_TOKEN
  );

  // send the conversion data to facebook pixel
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${process.env
        .FB_PIXEL_ID}/events?access_token=${process.env.FB_ACCESS_TOKEN}`,
      conversionData
    );
    console.log("Conversion data sent successfully: ", response.data);
  } catch (error) {
    // log the error details
    console.error("Error sending conversion data: ", error.response.data);
  }

  return;
};

const hashData = data => {
  // hash the data
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  return hash;
};

module.exports = fbConversion;
