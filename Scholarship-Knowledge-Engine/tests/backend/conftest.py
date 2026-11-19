import sys
import os

# Add backend/ to sys.path so imports work from tests/backend/
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "backend"))
