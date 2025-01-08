import logging
from logging.handlers import RotatingFileHandler

logging.getLogger('werkzeug').disabled = True

def configure_logging(app):
    """Set up logging for the Flask app."""
    # Define log file and handler
    log_file = 'app.log'
    log_handler = RotatingFileHandler(log_file, maxBytes=100000, backupCount=1)  # Rotate after 100KB, keep 1 backup
    log_handler.setLevel(logging.INFO)

    # Log format
    log_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    log_handler.setFormatter(log_format)

    # Attach handler to Flask's default logger
    app.logger.addHandler(log_handler)

    # Suppress Werkzeug logs (optional)
    werkzeug_log = logging.getLogger('werkzeug')
    werkzeug_log.setLevel(logging.WARNING)  # Only log warnings and errors
    werkzeug_log.addHandler(log_handler)