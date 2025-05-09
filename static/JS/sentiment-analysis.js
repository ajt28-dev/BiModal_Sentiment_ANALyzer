// DOM Elements
const sentimentText = document.getElementById('sentiment-text');
const analyzeButton = document.getElementById('analyze-button');
const clearButton = document.getElementById('clear-button');
const sentimentResult = document.getElementById('sentiment-result');
const sentimentLoading = document.getElementById('sentiment-loading');
const joyExample = document.getElementById('joy-example');
const sadnessExample = document.getElementById('sadness-example');
const neutralExample = document.getElementById('neutral-example');
const mixedExample = document.getElementById('mixed-example');
const emotionForm = document.getElementById('emotion-form');

// Clear text
function clearText() {
  sentimentText.value = '';
  sentimentResult.innerHTML = '<div class="alert alert-info">Enter text and click "Analyze Emotions" to see results.</div>';
}

// Set example text
function setExampleText(text) {
  sentimentText.value = text;
  // Auto-scroll to the analyze button
  analyzeButton.scrollIntoView({ behavior: 'smooth' });
}

// Handle form submission with AJAX
emotionForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const text = sentimentText.value.trim();
  
  if (!text) {
    sentimentResult.innerHTML = '<div class="alert alert-warning">Please enter some text to analyze.</div>';
    return;
  }
  
  sentimentLoading.style.display = 'block';
  
  // Get CSRF token
  const csrfToken = document.querySelector('input[name="csrf_token"]').value;
  
  // Send AJAX request to the server
  fetch(emotionForm.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': csrfToken
    },
    body: new URLSearchParams({
      'text': text,
      'csrf_token': csrfToken
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    sentimentLoading.style.display = 'none';
    
    if (data.error) {
      sentimentResult.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
    } else {
      sentimentResult.innerHTML = data.html;
    }
  })
  .catch(error => {
    sentimentLoading.style.display = 'none';
    sentimentResult.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    console.error('Error:', error);
  });
});

// Event listeners
clearButton.addEventListener('click', clearText);

// Example text event listeners
joyExample.addEventListener('click', () => {
  setExampleText(joyExample.textContent.replace('Joy Example:', '').trim());
});

sadnessExample.addEventListener('click', () => {
  setExampleText(sadnessExample.textContent.replace('Sadness Example:', '').trim());
});

neutralExample.addEventListener('click', () => {
  setExampleText(neutralExample.textContent.replace('Neutral Example:', '').trim());
});

mixedExample.addEventListener('click', () => {
  setExampleText(mixedExample.textContent.replace('Mixed Emotions Example:', '').trim());
});