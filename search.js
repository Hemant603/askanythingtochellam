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
