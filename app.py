from flask import Flask, jsonify, render_template
import random

app = Flask(__name__)

@app.route('/')
def index():
    # Render the front-end template
    return render_template('index.html')

@app.route('/flip', methods=['GET'])
def flip_coin():
    # Return "heads" or "tails" randomly
    result = random.choice(["heads", "tails"])
    return jsonify({"result": result})  # Return the result as JSON

if __name__ == '__main__':
    app.run(debug=True)