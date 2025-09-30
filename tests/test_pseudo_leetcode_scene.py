from packages.animations.scenes.pseudo_leetcode_scene import PseudoLeetCodeScene


def test_pseudo_leetcode_scene_construct():
    """Test PseudoLeetCodeScene construction."""
    episode_data = {"id": "test-pseudo", "title": "Pseudo Test"}
    scene = PseudoLeetCodeScene(episode_data)
    scene.construct()
    assert len(scene.mobjects) == 4  # Header, desc, editor, console
    assert scene.duration == 10.0


def test_pseudo_leetcode_scene_render():
    """Test PseudoLeetCodeScene rendering."""
    scene = PseudoLeetCodeScene({"id": "test"})
    metadata = scene.render()
    assert metadata["mobjects"] == 4
    assert metadata["duration"] == 10.0
