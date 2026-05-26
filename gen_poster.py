#!/usr/bin/env python3
"""
Wake-Up Service poster generator.

Takes the puppeteer screenshot of the lobby LCD (_poster_raw.png) and
centers it on a 1080×1080 dark canvas with theme-matched rotated branding
text on the side panels — same compositional pattern as the mugshot-booth
poster, but in the LCD alarm-clock palette.

Run:
  ( cd ../mugshot-booth && node ../wake-up-service/gen_poster.cjs )
  ~/miniconda3/bin/python3 gen_poster.py
"""
import os
import random
from PIL import Image, ImageDraw, ImageFont

W = 1080  # poster is 1080×1080 square
HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(HERE, 'public')
RAW = os.path.join(HERE, '_poster_raw.png')
OUTPUT_GAMES = '/Users/yin/code/games/games/posters/wake-up-service.png'

# Crimson palette (default theme)
BG       = (8, 7, 10)         # body background
BEZEL    = (12, 10, 9)         # bezel-3
ON       = (255, 42, 28)       # --led-on
ON_SOFT  = (255, 106, 85)      # --led-soft
DIM      = (122, 28, 18)       # --led-dim
AMBER    = (255, 167, 38)      # --led-amber


def load_font(size):
    candidates = [
        '/System/Library/Fonts/Supplemental/Andale Mono.ttf',
        '/System/Library/Fonts/Menlo.ttc',
        '/System/Library/Fonts/Courier.ttc',
        '/System/Library/Fonts/Helvetica.ttc',
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return None


def main():
    if not os.path.exists(RAW):
        raise SystemExit(f"missing {RAW} — run gen_poster.cjs first")

    raw = Image.open(RAW).convert('RGBA')
    rw, rh = raw.size
    # The raw is 1080×1920 (360×640 @ DPR 3). Scale to fill height 1020 of 1080.
    target_h = 1020
    scale = target_h / rh
    new_h = target_h
    new_w = int(rw * scale)
    raw_scaled = raw.resize((new_w, new_h), Image.LANCZOS)

    canvas = Image.new('RGBA', (W, W), BG + (255,))
    d = ImageDraw.Draw(canvas)

    # Soft red vignette glow behind the device
    glow = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for i, alpha in enumerate([28, 22, 14, 8]):
        pad = 40 + i * 60
        gd.ellipse((pad, pad, W - pad, W - pad), fill=ON + (alpha,))
    glow = glow.filter(ImageFilterBlur(60))
    canvas.alpha_composite(glow)

    # Compute device x position (centered)
    side_w = (W - new_w) // 2
    device_y = (W - new_h) // 2

    # Side-panel rotated labels — LCD-data tag aesthetic
    f_side = load_font(28)
    f_caption = load_font(22)
    f_small = load_font(14)

    label_left = "WAKE-UP DISPATCH  ·  CONSOLE MOD-3A  ·  CH 0117"
    label_right = "EST. 2026  ·  ALTERU AFTER DARK  ·  24 / 7 LIVE"

    if f_side:
        # Left side: rotated text from bottom to top
        text_img = Image.new('RGBA', (W - 80, 40), (0, 0, 0, 0))
        td = ImageDraw.Draw(text_img)
        td.text((0, 4), label_left, font=f_side, fill=ON_SOFT + (220,))
        text_rot = text_img.rotate(90, resample=Image.BICUBIC, expand=True)
        canvas.alpha_composite(text_rot, (16, (W - text_rot.size[1]) // 2))

        # Right side: rotated text from top to bottom
        text_img2 = Image.new('RGBA', (W - 80, 40), (0, 0, 0, 0))
        td2 = ImageDraw.Draw(text_img2)
        td2.text((0, 4), label_right, font=f_side, fill=ON_SOFT + (220,))
        text_rot2 = text_img2.rotate(-90, resample=Image.BICUBIC, expand=True)
        canvas.alpha_composite(
            text_rot2,
            (W - 16 - text_rot2.size[0], (W - text_rot2.size[1]) // 2),
        )

    # Drop the screenshot onto the canvas
    canvas.alpha_composite(raw_scaled, (side_w, device_y))

    # Scattered LED-dot residue on the letterbox area
    random.seed(42)
    for _ in range(40):
        # left strip
        rx = random.randint(60, max(60, side_w - 30))
        ry = random.randint(40, W - 40)
        a = random.randint(120, 220)
        r = random.choice([2, 2, 3])
        d.ellipse((rx, ry, rx + r, ry + r), fill=ON + (a,))
    for _ in range(40):
        rx2 = random.randint(side_w + new_w + 30, W - 60)
        ry2 = random.randint(40, W - 40)
        a = random.randint(120, 220)
        r = random.choice([2, 2, 3])
        d.ellipse((rx2, ry2, rx2 + r, ry2 + r), fill=ON + (a,))

    # Tiny top-left and top-right corner brand chips
    if f_small:
        d.text((28, 22), 'WAKE-UP DISPATCH CO.', font=f_small, fill=DIM + (255,))
        right_t = '· LIVE ·'
        bbox = d.textbbox((0, 0), right_t, font=f_small)
        d.text((W - 28 - (bbox[2] - bbox[0]), 22), right_t, font=f_small, fill=AMBER + (220,))

    # Bottom caption
    if f_caption:
        cap = 'WAKE-UP SERVICE  ·  ALTERU AFTER DARK'
        bb = d.textbbox((0, 0), cap, font=f_caption)
        tw = bb[2] - bb[0]
        d.text(((W - tw) // 2, W - 38), cap, font=f_caption, fill=ON_SOFT + (240,))

    out = canvas.convert('RGB')
    out.save(OUTPUT_GAMES, optimize=True)
    print(f"saved {OUTPUT_GAMES} ({os.path.getsize(OUTPUT_GAMES) // 1024} KB)")

    # In-game cover image — 1024×1024 copy
    public_out = os.path.join(PUBLIC, 'poster.png')
    out.resize((1024, 1024), Image.LANCZOS).save(public_out, optimize=True)
    print(f"saved {public_out}")


def ImageFilterBlur(radius):
    from PIL import ImageFilter
    return ImageFilter.GaussianBlur(radius)


if __name__ == '__main__':
    main()
