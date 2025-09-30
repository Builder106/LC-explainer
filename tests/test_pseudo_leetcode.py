import pytest
import os
from unittest.mock import Mock, patch
from packages.integrations.pseudo_leetcode import PseudoLeetCodeInterface
from packages.integrations.gemini import GeminiClient


@pytest.fixture
def mock_gemini():
    with patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}):
        return GeminiClient()


@patch("packages.integrations.pseudo_leetcode.requests.get")
def test_fetch_problem(mock_get, mock_gemini):
    """Test fetching problem data from API."""
    mock_response = Mock()
    mock_response.raise_for_status.return_value = None
    mock_response.json.return_value = {"title": "Two Sum", "difficulty": "Easy"}
    mock_get.return_value = mock_response

    interface = PseudoLeetCodeInterface(mock_gemini)
    data = interface.fetch_problem("two-sum")

    assert data["title"] == "Two Sum"
    mock_get.assert_called_once_with(
        "https://alfa-leetcode-api.onrender.com/problems/two-sum"
    )


@patch("packages.integrations.pseudo_leetcode.requests.get")
@patch.object(GeminiClient, "generate_umpire_script")
def test_solve_problem(mock_generate_umpire, mock_get, mock_gemini):
    """Test solving problem with UMPIRE script generation."""
    # Mock API response
    mock_response = Mock()
    mock_response.raise_for_status.return_value = None
    mock_response.json.return_value = {
        "title": "Two Sum",
        "description": "Find two numbers that sum to target.",
    }
    mock_get.return_value = mock_response

    # Mock Gemini UMPIRE response
    mock_generate_umpire.return_value = {"objectives": ["Test objective"]}

    interface = PseudoLeetCodeInterface(mock_gemini)
    result = interface.solve_problem("two-sum")

    assert "objectives" in result
    mock_get.assert_called_once()
    mock_generate_umpire.assert_called_once()


def test_suggest_recognition_cues(mock_gemini):
    """Test recognition cues suggestion (skip if no API key)."""
    # Skip if no API key (real API call)
    if not os.environ.get("GEMINI_API_KEY"):
        pytest.skip("GEMINI_API_KEY not set for real API test")

    interface = PseudoLeetCodeInterface(mock_gemini)
    problem_data = {"title": "Two Sum"}
    cues = interface.suggest_recognition_cues(problem_data)

    assert isinstance(cues, list)
    assert len(cues) > 0
