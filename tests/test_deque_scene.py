from packages.animations.scenes.deque_scene import DequeScene


def test_deque_scene_construct():
    """Test DequeScene construction."""
    episode_data = {"id": "test-deque", "title": "Deque Test"}
    scene = DequeScene(episode_data)
    scene.construct()
    assert len(scene.mobjects) == 1
    assert scene.duration == 5.0


def test_deque_scene_render():
    """Test DequeScene rendering."""
    scene = DequeScene({"id": "test"})
    metadata = scene.render()
    assert metadata["mobjects"] == 1
    assert metadata["duration"] == 5.0
