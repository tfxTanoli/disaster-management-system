from fastapi import FastAPI
from mangum import Mangum
import sys
import os

# Add the parent directory to sys.path so we can import backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.fast_server import app

# Wrap FastAPI app with Mangum for serverless deployment
handler = Mangum(app)
