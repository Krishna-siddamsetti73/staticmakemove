from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# Load FAQs from JSON file
try:
    with open("responses.json", "r") as f:
        faq_data = json.load(f).get("faqs", [])
except Exception as e:
    print("Error loading responses.json:", e)
    faq_data = []

@app.route("/", methods=["POST"])
def chat():
    try:
        user_message = request.json.get("message", "").lower()
    except Exception:
        return jsonify({"error": "Invalid JSON payload"}), 400

    for faq in faq_data:
        keywords = faq.get("keywords", [])
        if any(keyword in user_message for keyword in keywords):
            return jsonify({
                "reply": faq.get("response", "No response provided."),
                "intent": faq.get("intent", "unknown")
            })

    return jsonify({
        "reply": "Sorry, I didn't understand that. Please ask something else.",
        "intent": "not_understood"
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)
