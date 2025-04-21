from flask import Flask, render_template, request, jsonify, redirect, url_for
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from flask_wtf.csrf import CSRFProtect
import datetime
import torch
import os

MODEL_PATH = "D:\Empathic Computing Project\Roberta_Model"

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)




# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-for-development')
csrf = CSRFProtect(app)

# Routes
@app.route('/')
def index():
    return render_template('index.html', current_year=datetime.datetime.now().year)

@app.route('/facial-emotion')
def facial_emotion():
    return render_template('facial_emotion.html', current_year=datetime.datetime.now().year)

@app.route('/sentiment-analysis')
def sentiment_analysis():
    return render_template('sentiment_analysis.html', current_year=datetime.datetime.now().year)

@app.route('/analyze-emotions', methods=['POST'])
def analyze_emotions():
    """
    Process text for emotion analysis using RoBERTa model.
    """
    if request.method == 'POST':
        text = request.form.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'})
        
        try:
            # Use the RoBERTa model for sentiment analysis
            inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512).to(device)
            
            with torch.no_grad():
                outputs = model(**inputs)
                scores = torch.nn.functional.softmax(outputs.logits, dim=1).squeeze().cpu().numpy()

            # IMPORTANT: These must match the order of outputs from your model!
            labels = ['negative', 'neutral', 'positive']  # Replace with your actual labels
            
            # Create emotion dictionary
            emotions = {label: float(score) for label, score in zip(labels, scores)}
            
            # Generate HTML for the results
            html = generate_emotion_results_html(emotions)
            
            return jsonify({'html': html})
            
        except Exception as e:
            return jsonify({'error': f'Error analyzing emotions: {str(e)}'})
    
    return redirect(url_for('sentiment_analysis'))


def generate_emotion_results_html(emotions):
    """Generate HTML for emotion analysis results."""
    html = '<div class="emotion-results p-3 border rounded">'
    
    # Sort emotions by score (highest first)
    sorted_emotions = sorted(emotions.items(), key=lambda x: x[1], reverse=True)
    
    for emotion, score in sorted_emotions:
        percentage = score * 100
        color_class = get_emotion_color_class(emotion)
        
        html += f'<div class="mb-3">'
        html += f'<div class="mb-2">{emotion.capitalize()}: {percentage:.1f}%</div>'
        html += f'<div class="progress">'
        html += f'<div class="progress-bar {color_class}" role="progressbar" '
        html += f'style="width: {percentage}%" '
        html += f'aria-valuenow="{percentage}" aria-valuemin="0" aria-valuemax="100"></div>'
        html += '</div></div>'
    
    html += '</div>'
    return html


def get_emotion_color_class(emotion):
    """Get Bootstrap color class for emotion."""
    color_map = {
        'positive': 'bg-success',  # Green for positive
        'negative': 'bg-danger',   # Red for negative
        'neutral': 'bg-secondary'  # Grey for neutral
    }
    return color_map.get(emotion.lower(), 'bg-primary')


if __name__ == '__main__':
    app.run(debug=True)