// 🎤 Voice Input
function nSpeechRecog() {
  const text = document.getElementById('text');
  const textsearch = document.getElementById('textsearch');

  const recognization = new webkitSpeechRecognition();
  recognization.onstart = () => {
    text.innerHTML = "Listening...";
  };

  recognization.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    text.innerHTML = '';
    textsearch.value = transcript;
    handleInputChange({ target: textsearch });
  };

  recognization.start();
}

function handleInputChange(event) {
  search(event.target.value);
}

function search(inputValue) {
  const anchor = document.getElementById('dynamicLink');
  anchor.href = "https://www.google.com/search?q=" + encodeURIComponent(inputValue);
  anchor.click();
}

// 📨 Form Submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = {
        FirstName: document.getElementById('firstname').value,
        LastName: document.getElementById('lastname').value,
        Email: document.getElementById('email').value,
        Phone: document.getElementById('phone').value,
        Description: document.getElementById('message').value,
      };

      try {
        const response = await fetch('https:na123.salesforce.com/services/data/v60.0/sobjects/Contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('✅ Contact created successfully!');
          form.reset();
        } else {
          const errorData = await response.json();
          alert('❌ Error creating contact: ' + (errorData.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('❌ Network error:', error);
        alert('Failed to submit form. Try again later.');
      }
    });
  } else {
    console.warn("⚠️ contactForm not found in DOM.");
  }
});