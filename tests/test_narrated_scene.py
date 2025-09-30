from packages.animations.scenes.narrated_scene import NarratedStackScene


def test_narrated_stack_scene_construct():
    """Test NarratedStackScene construction with TTS and captions."""
    episode_data = {"id": "test-narrated", "title": "Narrated Stack"}
    scene = NarratedStackScene(episode_data)
    scene.construct()
    assert len(scene.mobjects) == 1
    assert scene.duration == 5.0


def test_narrated_stack_scene_render():
    """Test NarratedStackScene rendering."""
    scene = NarratedStackScene({"id": "test"})
    metadata = scene.render()
    assert metadata["mobjects"] == 1
    assert metadata["duration"] == 5.0
