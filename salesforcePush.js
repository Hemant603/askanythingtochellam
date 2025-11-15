function runSpeechRecog() {
    var text = document.getElementById('text'); 
    var textsearch = document.getElementById('textsearch');

    let recognization = new webkitSpeechRecognition();
    recognization.continuous = false;   // End when you pause
    recognization.interimResults = true; // Show words while speaking
    recognization.lang = 'en-US';

    recognization.onstart = () => {
        text.innerHTML = "Start speaking...";
    };

    recognization.onresult = (e) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < e.results.length; i++) {
            let transcript = e.results[i][0].transcript;
            if (e.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        // Show live spoken words
        text.innerHTML = finalTranscript + '<span style="color:#888;">' + interimTranscript + '</span>';

        // Update input field with final transcript
        if (finalTranscript.trim() !== '') {
            textsearch.value = finalTranscript.trim();
            handleInputChange({ target: textsearch });
        }
    };

    recognization.onerror = (err) => {
        console.error("Speech recognition error:", err);
        text.innerHTML = "Error occurred. Try again.";
    };

    recognization.start();
}

function handleInputChange(event) {
    search(event.target.value);
}

function search(inputValue) {
    var anchor = document.getElementById('dynamicLink');
    anchor.href = "https://www.google.com/search?q=" + encodeURIComponent(inputValue);
    anchor.click();
}

document.getElementById('contactForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        FirstName: document.getElementById('firstname').value,
        LastName: document.getElementById('lastname').value,
        Email: document.getElementById('email').value,
        Phone: document.getElementById('phone').value,
        Description: document.getElementById('message').value,
    };

    try {
        const response = await fetch('https://localhost:3000/submit-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert('Contact created successfully!');
            event.target.reset();
        } else {
            const errorData = await response.json();
            alert('Error creating contact: ' + (errorData.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Failed to submit form. Please try again later.');
    }
});
