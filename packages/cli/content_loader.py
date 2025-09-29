import re
import yaml
import os
from typing import Dict, Any
from .schema import validate_episode


def load_markdown_episode(file_path: str) -> Dict[str, Any]:
    """Load and parse a Markdown file with YAML front matter into episode data."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File {file_path} not found")

    with open(file_path, "r") as f:
        content = f.read()

    # Extract YAML front matter (between ---)
    match = re.match(r"^---\n(.*?)\n---\n(.*)", content, re.DOTALL)
    if not match:
        raise ValueError("No valid YAML front matter found")

    front_matter = match.group(1)
    body = match.group(2)

    # Parse YAML
    metadata = yaml.safe_load(front_matter)
    episode_data = dict(metadata)
    episode_data["body"] = body.strip()

    # Validate against schema
    validate_episode(episode_data)
    return episode_data


def save_markdown_episode(file_path: str, episode_data: Dict[str, Any]) -> None:
    """Save episode data as Markdown with YAML front matter."""
    # Remove body if present for front matter only
    front_matter_data = {k: v for k, v in episode_data.items() if k != "body"}
    body = episode_data.get("body", "")

    # Dump YAML
    yaml_str = yaml.dump(front_matter_data, default_flow_style=False)
    content = f"---\n{yaml_str}---\n{body}"

    with open(file_path, "w") as f:
        f.write(content)
