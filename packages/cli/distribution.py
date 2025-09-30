from typing import Dict, Any, List


def generate_deep_links(episode_data: Dict[str, Any]) -> Dict[str, str]:
    """Generate deep links for the episode."""
    slug = episode_data.get("leetcodeSlug", "")
    base_url = "https://leetcode.com/problems/"
    return {
        "leetcode": f"{base_url}{slug}/",
        "leetcode_cn": f"https://leetcode.cn/problems/{slug}/",  # Optional Chinese site
    }


def generate_youtube_description(episode_data: Dict[str, Any]) -> str:
    """Generate YouTube description with deep links and metadata."""
    title = episode_data.get("title", "LeetCode Explainer")
    difficulty = episode_data.get("difficulty", "Unknown")
    pattern = ", ".join(episode_data.get("pattern", []))
    objectives = "\n".join(f"- {obj}" for obj in episode_data.get("objectives", []))

    deep_links = generate_deep_links(episode_data)

    description = f"""
{title} | LeetCode {difficulty} Problem Explained

Pattern: {pattern}

Learning Objectives:
{objectives}

🔗 Open on LeetCode: {deep_links["leetcode"]}
🔗 LeetCode CN: {deep_links["leetcode_cn"]}

Subscribe for more LeetCode explainers! 🚀

#LeetCode #Algorithm #DataStructures #CodingInterview
"""
    return description.strip()


def generate_chapters(episode_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate YouTube chapters from storyboard."""
    storyboard = episode_data.get("storyboard", [])
    chapters = []

    for item in storyboard:
        if "time" in item and "visual" in item:
            # Parse time (assume MM:SS format)
            time_str = item["time"]
            minutes, seconds = map(int, time_str.split(":"))
            total_seconds = minutes * 60 + seconds
            chapters.append({"time": total_seconds, "title": item["visual"]})

    # Sort by time
    chapters.sort(key=lambda x: x["time"])

    return chapters
