const axios = require("axios");

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);

    const SF_LOGIN_URL = process.env.SF_LOGIN_URL;
    const SF_USERNAME = process.env.SF_USERNAME;
    const SF_PASSWORD = process.env.SF_PASSWORD;
    const SF_TOKEN = process.env.SF_TOKEN;
    const SF_CLIENT_ID = process.env.SF_CLIENT_ID;
    const SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET;

    // Login
    const loginResponse = await axios.post(
      `${SF_LOGIN_URL}/services/oauth2/token`,
      new URLSearchParams({
        grant_type: "password",
        client_id: SF_CLIENT_ID,
        client_secret: SF_CLIENT_SECRET,
        username: SF_USERNAME,
        password: SF_PASSWORD + SF_TOKEN
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }
    );

    const { access_token, instance_url } = loginResponse.data;

    // Create Contact
    const contactResponse = await axios.post(
      `${instance_url}/services/data/v57.0/sobjects/Contact`,
      data,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Contact Created",
        id: contactResponse.data.id
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data
      })
    };
  }
};
