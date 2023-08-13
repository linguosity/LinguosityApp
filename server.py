
from flask import Flask, request, jsonify
import api  # Assuming api.py contains the necessary Suno functions

app = Flask(__name__)

@app.route('/generate_audio', methods=['POST'])
def generate_audio_endpoint():
    text = request.json.get('text')
    audio_data = api.generate_audio(text)
    # Process the audio_data if necessary, e.g., convert to a URL or base64
    return jsonify({"audio": audio_data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
