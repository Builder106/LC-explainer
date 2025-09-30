import pytest
import os
from unittest.mock import Mock, patch
from packages.integrations.gemini import GeminiClient


# Mock environment for testing
@pytest.fixture
def mock_api_key():
    return "test-api-key"


@pytest.fixture
def gemini_client(mock_api_key):
    with patch.dict(os.environ, {"GEMINI_API_KEY": mock_api_key}):
        return GeminiClient()


def test_gemini_client_initialization():
    """Test GeminiClient initializes with API key."""
    with patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}):
        client = GeminiClient()
        assert client.api_key == "test-key"
        assert client.model == "gemini-1.5-flash"


def test_gemini_client_missing_api_key():
    """Test initialization fails without API key."""
    with patch.dict(os.environ, {}, clear=True):
        with pytest.raises(ValueError, match="GEMINI_API_KEY"):
            GeminiClient()


@patch("packages.integrations.gemini.genai.Client")
def test_generate_umpire_script(mock_client_class):
    """Test UMPIRE script generation with mocked response."""
    mock_client = Mock()
    mock_client_class.return_value = mock_client
    mock_response = Mock()
    mock_response.text = '{"objectives": ["Test objective"]}'
    mock_client.models.generate_content.return_value = mock_response

    with patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}):
        client = GeminiClient()
        problem_data = {"title": "Test Problem", "description": "Test desc"}
        result = client.generate_umpire_script(problem_data)

        assert "objectives" in result
        mock_client.models.generate_content.assert_called_once()


@patch("packages.integrations.gemini.genai.Client")
def test_analyze_video(mock_client_class):
    """Test video analysis with mocked response."""
    mock_client = Mock()
    mock_client_class.return_value = mock_client
    mock_response = Mock()
    mock_response.text = "Video analysis result"
    mock_client.models.generate_content.return_value = mock_response

    with patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}):
        client = GeminiClient()
        result = client.analyze_video("test_video.mp4", "Analyze this video")

        assert result == "Video analysis result"
        mock_client.models.generate_content.assert_called_once()
