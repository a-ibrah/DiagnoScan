from flask import Flask
from core.routes import core_bp
from core.log import configure_logging 

# Flask app configuration
app = Flask(__name__)
app.secret_key = 'yoursecretkey'  # Needed for flash messages

# Configure logging
configure_logging(app)

# Register blueprints
app.register_blueprint(core_bp)

if __name__ == '__main__':
    app.run(debug=True)