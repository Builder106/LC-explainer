from packages.animations.scenes.queue_scene import QueueScene


def test_queue_scene_construct():
    """Test QueueScene construction."""
    episode_data = {"id": "test-queue", "title": "Queue Test"}
    scene = QueueScene(episode_data)
    scene.construct()
    assert len(scene.mobjects) == 1
    assert scene.duration == 4.0


def test_queue_scene_render():
    """Test QueueScene rendering."""
    scene = QueueScene({"id": "test"})
    metadata = scene.render()
    assert metadata["mobjects"] == 1
    assert metadata["duration"] == 4.0
