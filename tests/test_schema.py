import json
import pytest
from packages.cli.schema import validate_episode, load_episode_from_file
import jsonschema

# Sample valid episode data
VALID_EPISODE = {
    "id": "two-sum",
    "title": "Two Sum",
    "leetcodeSlug": "two-sum",
    "difficulty": "Easy",
    "pattern": ["hash-map"],
    "objectives": ["Recognize complement pairs"],
    "recognitionCues": [
        "Look for pairs summing to target"
    ],
    "approaches": [{"name": "Hash Map", "intuition": "Store seen values"}],
    "codeSnippets": [],
    "storyboard": [],
    "quizzes": [],
    "accessibility": {},
    "distribution": {},
}


def test_valid_episode_passes():
    """Test that a valid episode passes validation."""
    validate_episode(VALID_EPISODE)  # Should not raise


def test_missing_required_field_fails():
    """Test that missing required fields raise ValidationError."""
    invalid_episode = VALID_EPISODE.copy()
    del invalid_episode["id"]
    with pytest.raises(jsonschema.ValidationError):
        validate_episode(invalid_episode)


def test_invalid_difficulty_fails():
    """Test that invalid difficulty raises ValidationError."""
    invalid_episode = VALID_EPISODE.copy()
    invalid_episode["difficulty"] = "Invalid"
    with pytest.raises(jsonschema.ValidationError):
        validate_episode(invalid_episode)


def test_load_episode_from_file():
    """Test loading and validating an episode from a JSON file."""
    # Create a temporary JSON file
    with open("temp_episode.json", "w") as f:
        json.dump(VALID_EPISODE, f)

    loaded = load_episode_from_file("temp_episode.json")
    assert loaded == VALID_EPISODE

    # Clean up
    import os

    os.remove("temp_episode.json")
