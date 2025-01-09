import logging
from logging.handlers import RotatingFileHandler

logging.getLogger('werkzeug').disabled = True  # Disable default werkzeug logger if desired

def configure_logging(app):
    """Set up logging for the Flask app."""
    # Define log file and handler
    log_file = 'app.log'
    log_handler = RotatingFileHandler(log_file, maxBytes=100000, backupCount=1)  # Rotate after 100KB, keep 1 backup
    log_handler.setLevel(logging.INFO)

    # Log format
    log_format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    log_handler.setFormatter(log_format)

    # Remove all handlers associated with the app's logger to avoid duplicate logging
    for handler in list(app.logger.handlers):
        app.logger.removeHandler(handler)

    # Attach our file handler to Flask's default logger
    app.logger.addHandler(log_handler)

    # Set the logger level (optional, based on your needs)
    app.logger.setLevel(logging.INFO)

    # Configure werkzeug logger separately if needed
    werkzeug_log = logging.getLogger('werkzeug')
    for handler in list(werkzeug_log.handlers):
        werkzeug_log.removeHandler(handler)  # Remove existing handlers
    werkzeug_log.addHandler(log_handler)
    werkzeug_log.setLevel(logging.WARNING)  # Only log warnings and errors, adjust as needed