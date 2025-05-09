// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startButton = document.getElementById('start-camera');
const stopButton = document.getElementById('stop-camera');
const faceInfo = document.getElementById('face-info');
const faceLoading = document.getElementById('face-loading');

let stream = null;
let isModelLoaded = false;
let detectionInterval = null;

/**
 * =====================================================================
 * INTEGRATION POINT 2: Load your emotion recognition models
 * 
 * This function should:
 * 1. Load your emotion recognition models
 * 2. Set isModelLoaded = true when complete
 * 3. Update the UI to show loading status
 * 
 * Examples:
 * - For face-api.js:
 *   async function loadModels() {
 *     faceLoading.style.display = 'block';
 *     try {
 *       await faceapi.nets.tinyFaceDetector.loadFromUri('/static/models/');
 *       await faceapi.nets.faceLandmark68Net.loadFromUri('/static/models/');
 *       await faceapi.nets.faceExpressionNet.loadFromUri('/static/models/');
 *       isModelLoaded = true;
 *       faceLoading.style.display = 'none';
 *       faceInfo.innerHTML = '<div class="alert alert-success">Emotion recognition models loaded!</div>';
 *     } catch (error) {
 *       faceLoading.style.display = 'none';
 *       faceInfo.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
 *     }
 *   }
 * 
 * - For TensorFlow.js:
 *   async function loadModels() {
 *     faceLoading.style.display = 'block';
 *     try {
 *       model = await tf.loadGraphModel('/static/models/emotion/model.json');
 *       isModelLoaded = true;
 *       faceLoading.style.display = 'none';
 *       faceInfo.innerHTML = '<div class="alert alert-success">Emotion recognition models loaded!</div>';
 *     } catch (error) {
 *       faceLoading.style.display = 'none';
 *       faceInfo.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
 *     }
 *   }
 * =====================================================================
 */
async function loadModels() {
  faceLoading.style.display = 'block';
  
  // Simulate model loading for demonstration
  setTimeout(() => {
    faceLoading.style.display = 'none';
    faceInfo.innerHTML = '<div class="alert alert-warning">No emotion recognition model loaded. Please implement the loadModels() function.</div>';
  }, 1000);
  
  // TODO: Replace this with your actual model loading code
  // isModelLoaded = true; // Set this to true when your model is loaded
}

// Start camera
async function startCamera() {
  if (!isModelLoaded) {
    faceInfo.innerHTML = '<div class="alert alert-warning">No emotion recognition model loaded. Please implement the loadModels() function.</div>';
    return;
  }
  
  try {
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      } 
    });
    
    video.srcObject = stream;
    startButton.disabled = true;
    stopButton.disabled = false;
    
    // Set canvas dimensions to match video
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    });
    
    // Start emotion detection
    startEmotionDetection();
  } catch (error) {
    faceInfo.innerHTML = `<div class="alert alert-danger">Error accessing camera: ${error.message}</div>`;
    console.error('Error accessing camera:', error);
  }
}

// Stop camera
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    startButton.disabled = false;
    stopButton.disabled = true;
    
    // Clear detection interval
    if (detectionInterval) {
      clearInterval(detectionInterval);
      detectionInterval = null;
    }
    
    // Clear canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    faceInfo.innerHTML = '<div class="alert alert-info">Camera stopped. Click "Start Camera" to begin again.</div>';
  }
}

/**
 * =====================================================================
 * INTEGRATION POINT 3: Implement emotion detection
 * 
 * This function should:
 * 1. Process video frames to detect faces and emotions
 * 2. Draw face detection results on the canvas
 * 3. Call updateEmotionInfo() with the detection results
 * 
 * Example with face-api.js:
 * function startEmotionDetection() {
 *   if (detectionInterval) clearInterval(detectionInterval);
 *   
 *   detectionInterval = setInterval(async () => {
 *     if (video.paused || video.ended || !isModelLoaded) return;
 *     
 *     const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
 *       .withFaceLandmarks()
 *       .withFaceExpressions();
 *       
 *     // Clear canvas before drawing
 *     const ctx = canvas.getContext('2d');
 *     ctx.clearRect(0, 0, canvas.width, canvas.height);
 *     
 *     // Draw detections
 *     faceapi.draw.drawDetections(canvas, detections);
 *     faceapi.draw.drawFaceLandmarks(canvas, detections);
 *     
 *     // Update emotion info
 *     updateEmotionInfo(detections);
 *   }, 100);
 * }
 * =====================================================================
 */
function startEmotionDetection() {
  if (detectionInterval) {
    clearInterval(detectionInterval);
  }
  
  // This is a placeholder - replace with your actual emotion detection code
  detectionInterval = setInterval(() => {
    if (video.paused || video.ended || !isModelLoaded) return;
    
    // Display a message indicating that emotion detection needs to be implemented
    faceInfo.innerHTML = '<div class="alert alert-warning">Emotion detection not implemented. Please implement the startEmotionDetection() function.</div>';
  }, 1000);
}

/**
 * =====================================================================
 * INTEGRATION POINT 4: Update emotion information display
 * 
 * This function should:
 * 1. Take detection results and display emotion information in the UI
 * 2. Format the results in a user-friendly way with visual indicators
 * 
 * Example:
 * function updateEmotionInfo(detections) {
 *   if (detections.length === 0) {
 *     faceInfo.innerHTML = '<div class="alert alert-warning">No faces detected.</div>';
 *     return;
 *   }
 *   
 *   let infoHTML = '<div class="card"><div class="card-body">';
 *   infoHTML += `<h5 class="card-title">Detected ${detections.length} face(s)</h5>`;
 *   
 *   detections.forEach((detection, index) => {
 *     // Extract emotion data
 *     const expressions = detection.expressions;
 *     
 *     // Get dominant emotion
 *     let dominantEmotion = '';
 *     let maxProbability = 0;
 *     
 *     Object.entries(expressions).forEach(([emotion, probability]) => {
 *       if (probability > maxProbability) {
 *         maxProbability = probability;
 *         dominantEmotion = emotion;
 *       }
 *     });
 *     
 *     // Create emotion display with colorful indicators
 *     infoHTML += `<div class="mt-3 p-3 bg-light rounded">`;
 *     infoHTML += `<h6>Face #${index + 1}</h6>`;
 *     infoHTML += `<div class="emotion-indicator ${dominantEmotion.toLowerCase()}">
 *                    Dominant Emotion: ${dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)}
 *                  </div>`;
 *     
 *     // Emotion bars
 *     infoHTML += `<div class="mt-2"><strong>Emotions:</strong></div>`;
 *     Object.entries(expressions).forEach(([emotion, probability]) => {
 *       const percentage = (probability * 100).toFixed(2);
 *       infoHTML += `<div class="mb-1">${emotion.charAt(0).toUpperCase() + emotion.slice(1)}: ${percentage}%</div>`;
 *       infoHTML += `<div class="progress mb-2" style="height: 10px;">
 *                     <div class="progress-bar ${getEmotionColorClass(emotion)}" role="progressbar" 
 *                       style="width: ${percentage}%;" aria-valuenow="${percentage}" 
 *                       aria-valuemin="0" aria-valuemax="100"></div>
 *                   </div>`;
 *     });
 *     
 *     infoHTML += `</div>`;
 *   });
 *   
 *   infoHTML += '</div></div>';
 *   faceInfo.innerHTML = infoHTML;
 * }
 * 
 * // Helper function to get color classes for emotions
 * function getEmotionColorClass(emotion) {
 *   const colorMap = {
 *     happy: 'bg-success',
 *     sad: 'bg-info',
 *     angry: 'bg-danger',
 *     surprised: 'bg-warning',
 *     neutral: 'bg-secondary',
 *     // Add more emotions as needed
 *   };
 *   return colorMap[emotion.toLowerCase()] || 'bg-primary';
 * }
 * =====================================================================
 */
function updateEmotionInfo(detections) {
  // This is a placeholder - replace with your actual emotion info update code
  faceInfo.innerHTML = '<div class="alert alert-warning">Emotion information display not implemented. Please implement the updateEmotionInfo() function.</div>';
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadModels);
startButton.addEventListener('click', startCamera);
stopButton.addEventListener('click', stopCamera);