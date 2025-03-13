import languages from './languages.js';

function populateLanguageSelect(selectElement, selectedLanguage = 'en') {
  for (const [code, name] of Object.entries(languages)) {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = name;
    if (code === selectedLanguage) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  }
}

async function translateText() {
  const text = document.getElementById('textInput').value;
  const sourceLanguage = document.getElementById('sourceLanguageSelect').value;
  const targetLanguage = document.getElementById('targetLanguageSelect').value;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    document.getElementById('translatedText').innerText = data.responseData.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
  }
}

function startSpeechRecognition() {
  const sourceLanguage = document.getElementById('sourceLanguageSelect').value;
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = sourceLanguage;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    document.getElementById('textInput').value = speechResult;
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };
}

function speakTranslation() {
  const text = document.getElementById('translatedText').innerText;
  const utterance = new SpeechSynthesisUtterance(text);
  const targetLanguage = document.getElementById('targetLanguageSelect').value;


  if (languages[targetLanguage]) {
    utterance.lang = targetLanguage;
  } else {
    utterance.lang = 'en-US'; 
  }

  window.speechSynthesis.speak(utterance);
}


document.addEventListener('DOMContentLoaded', () => {
  populateLanguageSelect(document.getElementById('sourceLanguageSelect'), 'en');
  populateLanguageSelect(document.getElementById('targetLanguageSelect'), 'es');

  document.getElementById('startSpeechIcon').addEventListener('click', startSpeechRecognition);
  document.getElementById('translateButton').addEventListener('click', translateText);
  document.getElementById('speakIcon').addEventListener('click', speakTranslation);
});