import io
from packages.animations.thumbnails import ThumbnailGenerator


def test_thumbnail_generator_initialization():
    """Test ThumbnailGenerator initializes correctly."""
    gen = ThumbnailGenerator(width=800, height=600, bg_color="#000000")
    assert gen.width == 800
    assert gen.height == 600
    assert gen.bg_color == "#000000"


def test_generate_thumbnail():
    """Test thumbnail generation."""
    gen = ThumbnailGenerator()
    episode_data = {"title": "Two Sum", "difficulty": "Easy"}
    thumbnail_bytes = gen.generate_thumbnail(episode_data)
    assert isinstance(thumbnail_bytes, bytes)
    assert len(thumbnail_bytes) > 0

    # Verify it's a valid PNG
    img = io.BytesIO(thumbnail_bytes)
    from PIL import Image

    img.seek(0)
    pil_img = Image.open(img)
    assert pil_img.size == (1280, 720)


def test_thumbnail_with_missing_data():
    """Test thumbnail with minimal data."""
    gen = ThumbnailGenerator()
    episode_data = {"title": "Unknown"}
    thumbnail_bytes = gen.generate_thumbnail(episode_data)
    assert isinstance(thumbnail_bytes, bytes)


def test_thumbnail_custom_size():
    """Test thumbnail with custom dimensions."""
    gen = ThumbnailGenerator(width=640, height=360)
    episode_data = {"title": "Custom Size"}
    thumbnail_bytes = gen.generate_thumbnail(episode_data)
    img = io.BytesIO(thumbnail_bytes)
    from PIL import Image

    pil_img = Image.open(img)
    assert pil_img.size == (640, 360)
