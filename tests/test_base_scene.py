from packages.animations.scenes.base_scene import LeetCodeScene
from packages.animations.mobjects.base import Mobject


def test_leetcode_scene_initialization():
    """Test LeetCodeScene initializes correctly."""
    episode_data = {"id": "test", "title": "Test"}
    scene = LeetCodeScene(episode_data)
    assert scene.episode_data == episode_data
    assert len(scene.mobjects) == 0
    assert scene.duration == 0.0


def test_scene_add_mobject():
    """Test adding Mobjects to a scene."""
    scene = LeetCodeScene({"id": "test"})
    mobj = Mobject()
    scene.add_mobject(mobj)
    assert len(scene.mobjects) == 1


def test_scene_render_without_construct():
    """Test that render calls construct and returns metadata."""

    class TestScene(LeetCodeScene):
        def construct(self):
            self.duration = 5.0
            self.add_mobject(Mobject())

    scene = TestScene({"id": "test"})
    metadata = scene.render()
    assert metadata["mobjects"] == 1
    assert metadata["duration"] == 5.0
    assert metadata["episode_id"] == "test"


def test_mobject_initialization():
    """Test Mobject initializes correctly."""
    mobj = Mobject(position=(10, 20), color="blue", size=2.0)
    assert mobj.position == (10, 20)
    assert mobj.color == "blue"
    assert mobj.size == 2.0
    assert mobj.visible is True


def test_mobject_animate():
    """Test Mobject animation definition."""
    mobj = Mobject()
    anim = mobj.animate("fade_in", duration=2.0)
    assert anim["type"] == "fade_in"
    assert anim["duration"] == 2.0
    assert anim["mobject"] == "Mobject"


def test_mobject_to_dict():
    """Test Mobject serialization."""
    mobj = Mobject(color="red")
    data = mobj.to_dict()
    assert data["color"] == "red"
    assert data["position"] == (0, 0)
    assert data["visible"] is True
