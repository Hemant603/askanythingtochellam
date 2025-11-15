const axios = require("axios");

exports.handler = async (event, context) => {
  try {
    const { name, phone, website } = JSON.parse(event.body);

    // ---------- Salesforce Credentials ----------
    const SF_LOGIN_URL =SF_LOGIN_URL;
    const SF_USERNAME = SF_USERNAME;
    const SF_PASSWORD = SF_PASSWORD;
    const SF_TOKEN =SF_TOKEN;

    // ---------- Step 1: Login to Salesforce ----------
    const loginResponse = await axios.post(
      `${SF_LOGIN_URL}/services/oauth2/token`,
      new URLSearchParams({
        grant_type: "password",
        client_id: SF_CLIENT_ID,
        client_secret: SF_CLIENT_SECRET,
        username: SF_USERNAME,
        password: SF_PASSWORD + SF_TOKEN,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token, instance_url } = loginResponse.data;

    // ---------- Step 2: Create Account ----------
    const accountResponse = await axios.post(
      `${instance_url}/services/data/v57.0/sobjects/Account`,
      {
        Name: name,
        Phone: phone,
        Website: website,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Account created!",
        accountId: accountResponse.data.id,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data,
      }),
    };
  }
};
