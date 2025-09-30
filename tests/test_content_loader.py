import os
from packages.cli.content_loader import (
    load_markdown_episode, save_markdown_episode
)

# Sample Markdown content
SAMPLE_MARKDOWN = """---
id: two-sum
title: Two Sum
leetcodeSlug: two-sum
difficulty: Easy
pattern: [hash-map]
objectives:
  - Recognize when value-pair problems map to complements
---

# Two Sum Explanation
This is the body content.
"""


def test_load_markdown_episode():
    """Test loading and validating a Markdown episode."""
    # Create a temporary Markdown file
    with open("temp_episode.md", "w") as f:
        f.write(SAMPLE_MARKDOWN)

    loaded = load_markdown_episode("temp_episode.md")
    assert loaded["id"] == "two-sum"
    assert loaded["title"] == "Two Sum"
    assert loaded["body"] == "# Two Sum Explanation\nThis is the body content."
    assert "objectives" in loaded

    # Clean up
    os.remove("temp_episode.md")


def test_save_markdown_episode():
    """Test saving episode data to Markdown."""
    episode_data = {
        "id": "test-episode",
        "title": "Test Episode",
        "leetcodeSlug": "test-slug",
        "difficulty": "Medium",
        "pattern": ["test"],
        "objectives": ["Test objective"],
        "body": "Test content",
    }

    save_markdown_episode("test_episode.md", episode_data)

    # Verify file was created and can be loaded
    loaded = load_markdown_episode("test_episode.md")
    assert loaded["id"] == "test-episode"

    # Clean up
    os.remove("test_episode.md")
