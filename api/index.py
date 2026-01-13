import sys
import os

# Add the parent directory to sys.path so we can import backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.fast_server import app

# Vercel expects 'app' to be the ASGI application
# FastAPI is already an ASGI app, no wrapper needed
