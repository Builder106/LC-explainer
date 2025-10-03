import os
import tempfile
from typing import Tuple

from PIL import Image, ImageDraw
import moviepy as mp


def _draw_interface(size: Tuple[int, int]) -> Image.Image:
    width, height = size
    bg = (18, 18, 18)
    panel = (32, 32, 32)
    outline = (70, 70, 70)
    accent = (255, 196, 0)
    text = (235, 235, 235)

    img = Image.new("RGB", (width, height), bg)
    draw = ImageDraw.Draw(img)

    header_h = 64
    draw.rectangle([0, 0, width, header_h], fill=panel)
    draw.rectangle([20, 18, 44, 46], fill=accent)
    draw.text((60, 22), "LeetCode", fill=text)

    left_w = int(width * 0.42)
    right_w = width - left_w - 40
    top_y = header_h + 20
    bottom_y = height - 140

    draw.rectangle([20, top_y, 20 + left_w, bottom_y], outline=outline, width=2)
    draw.text((32, top_y + 12), "Description / Examples / Constraints", fill=text)

    rx = 40 + left_w
    draw.rectangle([rx, top_y, rx + right_w, bottom_y], outline=outline, width=2)
    draw.text((rx + 12, top_y + 12), "JavaScript — Code Editor", fill=text)

    c_top = bottom_y + 20
    draw.rectangle([20, c_top, width - 20, height - 20], outline=outline, width=2)
    draw.text((32, c_top + 12), "Console — Testcases / Output", fill=text)

    return img


def render_demo(output_path: str = "pseudo_leetcode_demo.mp4", duration: float = 6.0) -> str:
    img = _draw_interface((1280, 800))
    with tempfile.TemporaryDirectory() as tmpdir:
        frame_path = os.path.join(tmpdir, "frame.png")
        img.save(frame_path)
        clip = mp.ImageClip(frame_path).with_duration(duration)
        clip.write_videofile(output_path, fps=24, audio=False)
    return output_path


def main() -> None:
    path = render_demo()
    try:
        os.system(f"open '{path}'")
    except Exception:
        pass


if __name__ == "__main__":
    main()


