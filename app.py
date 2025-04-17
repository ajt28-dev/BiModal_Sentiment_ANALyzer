from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_wtf.csrf import CSRFProtect
import datetime
import os

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
    Process text for emotion analysis.
    This is where you would integrate your actual emotion analysis model.
    """
    if request.method == 'POST':
        text = request.form.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'})
        
        try:
            # This is where you would call your emotion analysis model
            # For now, we'll return a placeholder result
            
            # In a real implementation, you would:
            # 1. Preprocess the text
            # 2. Pass it to your emotion model
            # 3. Get the emotion scores
            # 4. Format the results
            
            # Placeholder results
            emotions = {
                'joy': 0.65,
                'sadness': 0.10,
                'anger': 0.05,
                'fear': 0.03,
                'surprise': 0.12,
                'neutral': 0.05
            }
            
            # Generate HTML for the results
            html = generate_emotion_results_html(emotions)
            
            return jsonify({'html': html})
            
        except Exception as e:
            return jsonify({'error': f'Error analyzing emotions: {str(e)}'})
    
    return redirect(url_for('sentiment_analysis'))

def generate_emotion_results_html(emotions):
    """Generate HTML for emotion analysis results."""
    # Find the dominant emotion
    dominant_emotion = max(emotions.items(), key=lambda x: x[1])[0]
    
    html = f"""
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Emotion Analysis Results</h5>
        <div class="emotion-indicator {dominant_emotion.lower()}">
          <strong>Dominant Emotion:</strong> {dominant_emotion.capitalize()}
        </div>
        
        <div class="mt-3">
    """
    
    # Add emotion bars
    for emotion, score in emotions.items():
        percentage = round(score * 100, 2)
        color_class = get_emotion_color_class(emotion)
        
        html += f"""
          <div class="mb-2">{emotion.capitalize()}: {percentage}%</div>
          <div class="progress mb-3">
            <div class="progress-bar {color_class}" role="progressbar" 
              style="width: {percentage}%;" aria-valuenow="{percentage}" 
              aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        """
    
    html += """
        </div>
      </div>
    </div>
    """
    
    return html

def get_emotion_color_class(emotion):
    """Get Bootstrap color class for emotion."""
    color_map = {
        'joy': 'bg-success',
        'sadness': 'bg-info',
        'anger': 'bg-danger',
        'fear': 'bg-warning',
        'surprise': 'bg-primary',
        'neutral': 'bg-secondary'
    }
    return color_map.get(emotion.lower(), 'bg-primary')

if __name__ == '__main__':
    app.run(debug=True)