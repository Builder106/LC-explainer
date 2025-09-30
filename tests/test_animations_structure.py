import os


def test_animations_package_exists():
    """Test that the animations package directory exists."""
    animations_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), "packages", "animations"
    )
    assert os.path.exists(animations_path), "Animations package does not exist"
    assert os.path.isdir(animations_path), "Animations path is not a directory"


def test_animations_subdirs_exist():
    """Test that subdirectories exist."""
    base_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), "packages", "animations"
    )
    subdirs = ["scenes", "mobjects", "utils"]
    for subdir in subdirs:
        subdir_path = os.path.join(base_path, subdir)
        assert os.path.exists(subdir_path), (
            f"Subdirectory {subdir} does not exist"
        )
        assert os.path.isdir(subdir_path), f"{subdir} is not a directory"
