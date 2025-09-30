from packages.animations.scenes.stack_scene import StackScene


def test_stack_scene_construct():
    """Test StackScene construction."""
    episode_data = {"id": "test-stack", "title": "Stack Test"}
    scene = StackScene(episode_data)
    scene.construct()
    assert len(scene.mobjects) == 1
    assert scene.duration == 3.0


def test_stack_scene_render():
    """Test StackScene rendering."""
    scene = StackScene({"id": "test"})
    metadata = scene.render()
    assert metadata["mobjects"] == 1
    assert metadata["duration"] == 3.0
    assert metadata["episode_id"] == "test"
