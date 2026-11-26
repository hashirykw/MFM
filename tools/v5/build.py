#!/usr/bin/env python3
"""Builds V5 (paper-and-ink folio): tools/v5/src/index.html becomes one self-contained
v5/index.html with the CSS, data, behaviour and the 3D masjid module inlined.
Run from the repo root:  python3 tools/v5/build.py"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / 'tools' / 'v5' / 'src'
OUT = ROOT / 'v5'
R = lambda n: (SRC / n).read_text()


def build():
    s = R('index.html')
    css = R('site.css') + '\n' + R('v5.css')
    for k, v in {'{{CSS}}': css, '{{DATA}}': R('data.js'), '{{JS}}': R('site.js'),
                 '{{MOSQUE}}': R('mosque3d.js'), '{{NEXLYR}}': R('nexlyr.html')}.items():
        s = s.replace(k, v)
    left = re.findall(r'\{\{[A-Z0-9_]+\}\}', s)
    assert not left, f'unfilled {left}'
    OUT.mkdir(exist_ok=True)
    (OUT / 'index.html').write_text(s)
    print(f'v5/index.html  {len(s) // 1024} KB')


if __name__ == '__main__':
    build()
