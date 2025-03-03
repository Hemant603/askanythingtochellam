
const jsforce = require('jsforce');

// Your Salesforce OAuth configuration
const conn = new jsforce.Connection({
    oauth2: {
        clientId: '3MVG9GCMQoQ6rpzRwwRKvFaPJ0ofHEAUbw0jW0A13UQp8qHKu97j5DMB26sNN_DkOXHvRBc5x4I5i2Bv7omyJ',
        clientSecret: '8DDAD7235716D58479DC2813C6DD8A398BF2D1C9FF991BEF8694EFEBDE538D0E',
        redirectUri: 'https://ask-anything-to-chellam-sir.netlify.app/'
    }
});

// Function to handle Salesforce OAuth callback
function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
        // Use the authorization code to get an access token
        conn.authorize(authorizationCode, function (err, userInfo) {
            if (err) {
                console.error('Error during Salesforce authorization:', err);
                return;
            }

            // Log the access token and user info
            console.log('Access Token:', conn.accessToken); // Log access token
            console.log('Authenticated as:', userInfo.id); // Log user info
            // You can now use the connection to interact with Salesforce
        });
    } else {
        console.log('No authorization code found in URL');
    }
}

// Run this function if the page URL contains the code
if (window.location.search.includes('code')) {
    handleOAuthCallback();
}


// Function to create a Contact record in Salesforce
function createContact(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get values from the form
    const contactName = document.getElementById('contactName').value;
    const contactEmail = document.getElementById('contactEmail').value;
    const contactPhone = document.getElementById('contactPhone').value;

    // Salesforce API endpoint to create a Contact
    const endpoint = '/services/data/v54.0/sobjects/Contact/';

    // The Contact data to be created
    const contactData = {
        LastName: contactName,
        Email: contactEmail,
        Phone: contactPhone
    };

    // Make a POST request to create the contact
    conn.sobject("Contact").create(contactData, function (err, result) {
        if (err) {
            console.error('Error creating Contact:', err);
        } else {
            console.log('Contact created successfully:', result);
            alert('Contact created successfully!');
            // Optionally, reset form
            document.getElementById('contactForm').reset();
        }
    });
}

runSpeechRecog = () => {
    var text = document.getElementById('text'); 
    var textsearch = document.getElementById('textsearch');

    let recognization = new webkitSpeechRecognition();
    recognization.onstart = () => {
        text.innerHTML = "Listening...";
    };
    
    recognization.onresult = (e) => {
        var transcript = e.results[0][0].transcript;
        text.innerHTML = '';
        textsearch.value = transcript;
        handleInputChange({ target: textsearch });
    };
    
    recognization.start();
};

function handleInputChange(event) {
    search(event.target.value);
}

function search(inputValue) {
    var anchor = document.getElementById('dynamicLink');
    anchor.href = "https://www.google.com/search?q=" + encodeURIComponent(inputValue);
    anchor.click();
}
