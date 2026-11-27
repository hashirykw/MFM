"""Renders the six folio plates from tools/folio/src/models3d.js into assets/folio/img/folio/*.webp.
Run from the repo root: python3 tools/folio/render/render.py [name ...]   (needs Playwright + Chromium)"""
import sys, os, io, base64, threading, functools, http.server, socketserver, pathlib
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parents[3]
OUT = ROOT / 'assets' / 'folio' / 'img' / 'folio'
# name: (width, height, turn, fill) at 2x the size the page lays them out
PLATES = {'kaaba': (2340, 1664, .1, .9), 'hira': (1664, 2236, 0, .86), 'quran': (1976, 1612, -1.0, .92),
          'badr': (1820, 2236, 0, .88), 'mihrab': (1664, 2132, 0, .86), 'nabawi': (2340, 1664, -.08, .9)}
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(H, directory=str(ROOT))); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
names = sys.argv[1:] or list(PLATES)


def fit(im, w, h, margin=.06):
    """Crop to the model (alpha), then centre it on a transparent canvas of the plate's shape."""
    bb = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    im = im.crop(bb); iw, ih = im.size
    s = min(w * (1 - 2 * margin) / iw, h * (1 - 2 * margin) / ih)
    im = im.resize((round(iw * s), round(ih * s)), Image.LANCZOS)
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0)); out.alpha_composite(im, ((w - im.width) // 2, (h - im.height) // 2 + round(h * .01)))
    return out

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    for n in names:
        w, h, ry, fill = PLATES[n]
        pg = b.new_page(viewport={'width': 400, 'height': 300}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        pg.goto(f'http://127.0.0.1:{port}/tools/folio/render/render.html?m={n}&w={round(w*1.7)}&h={round(h*1.7)}&ry={ry}&fill={fill}')
        pg.wait_for_function('window.done === true', timeout=120000)
        data = base64.b64decode(pg.evaluate('window.png').split(',', 1)[1])
        im = Image.open(io.BytesIO(data)).convert('RGBA')
        im = fit(im, w, h)
        im.save(OUT / f'{n}.webp', 'WEBP', quality=86, method=6)
        print(n, im.size, (OUT / f'{n}.webp').stat().st_size // 1024, 'KB', errs[:2])
        pg.close()
    b.close()
srv.shutdown()
