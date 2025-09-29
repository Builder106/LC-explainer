import os

REQUIRED_DIRS = [
    "packages/animations",
    "packages/cli",
    "packages/integrations",
    "content/",
    "infrastructure/",
    "tests/",
    "docs/",
]


def test_required_directories_exist():
    """Test that all required directories are present and writable."""
    project_root = os.path.dirname(os.path.dirname(__file__))
    for dir_path in REQUIRED_DIRS:
        full_path = os.path.join(project_root, dir_path)
        assert os.path.exists(full_path), f"Directory {dir_path} does not exist"
        assert os.path.isdir(full_path), f"{dir_path} is not a directory"
        assert os.access(full_path, os.W_OK), f"Directory {dir_path} is not writable"


def test_packages_structure():
    """Test that packages/ contains expected subdirectories."""
    packages_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "packages")
    assert os.path.exists(packages_path)
    expected_packages = ["animations", "cli", "integrations"]
    for package in expected_packages:
        package_path = os.path.join(packages_path, package)
        assert os.path.exists(package_path), f"Package {package} does not exist"
        assert os.path.isdir(package_path), f"{package} is not a directory"
