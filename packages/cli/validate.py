#!/usr/bin/env python3
import argparse
import json
import sys
from schema import load_episode_from_file


def main():
    parser = argparse.ArgumentParser(
        description="Validate LeetCode episode JSON files."
    )
    parser.add_argument("file", help="Path to the JSON file to validate")
    args = parser.parse_args()

    try:
        episode = load_episode_from_file(args.file)
        print(f"✓ Valid episode: {episode['title']} ({episode['id']})")
        return 0
    except FileNotFoundError:
        print(f"Error: File {args.file} not found.")
        return 1
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {args.file}: {e}")
        return 1
    except Exception as e:
        print(f"Error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
