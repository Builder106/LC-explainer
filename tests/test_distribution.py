from packages.cli.distribution import (
    generate_deep_links,
    generate_youtube_description,
    generate_chapters,
)


def test_generate_deep_links():
    """Test deep link generation."""
    episode_data = {"leetcodeSlug": "two-sum"}
    links = generate_deep_links(episode_data)
    assert links["leetcode"] == "https://leetcode.com/problems/two-sum/"
    assert links["leetcode_cn"] == "https://leetcode.cn/problems/two-sum/"


def test_generate_youtube_description():
    """Test YouTube description generation."""
    episode_data = {
        "title": "Two Sum",
        "difficulty": "Easy",
        "pattern": ["hash-map"],
        "objectives": ["Learn hash maps"],
    }
    desc = generate_youtube_description(episode_data)
    assert "Two Sum | LeetCode Easy Problem Explained" in desc
    assert "🔗 Open on LeetCode" in desc
    assert "#LeetCode" in desc


def test_generate_chapters():
    """Test chapter generation from storyboard."""
    episode_data = {
        "storyboard": [
            {"time": "00:30", "visual": "Introduction"},
            {"time": "01:00", "visual": "Solution"},
        ]
    }
    chapters = generate_chapters(episode_data)
    assert len(chapters) == 2
    assert chapters[0]["time"] == 30
    assert chapters[0]["title"] == "Introduction"
    assert chapters[1]["time"] == 60


def test_generate_chapters_sorting():
    """Test that chapters are sorted by time."""
    episode_data = {
        "storyboard": [
            {"time": "01:00", "visual": "Later"},
            {"time": "00:30", "visual": "Earlier"},
        ]
    }
    chapters = generate_chapters(episode_data)
    assert chapters[0]["time"] == 30
    assert chapters[1]["time"] == 60
