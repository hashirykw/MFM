#!/usr/bin/env python3
"""Builds the V3 pages: each page in tools/v3/pages becomes one self-contained file in /v3
(styles and scripts inlined). Run from the repo root:  python3 tools/v3/build.py"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / 'tools' / 'v3'
OUT = ROOT / 'v3'
P = lambda n: (SRC / 'parts' / n).read_text()

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.14 6.44 2.14 11.9c0 1.75.46 3.45 1.32 4.95L2.05 22l5.28-1.38a9.86 9.86 0 0 0 4.71 1.2c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.3-1.94 1.35-.5.05-1.13.07-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.95-4.37-.14-.2-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.26-.29.58-.36.77-.36l.55.01c.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.09.2-.14.32-.28.49l-.42.49c-.14.14-.28.29-.12.57.16.29.72 1.18 1.54 1.91 1.06.94 1.95 1.23 2.23 1.37.28.15.44.12.6-.07.17-.2.7-.81.88-1.09.19-.29.37-.24.63-.14.25.09 1.62.76 1.9.9.28.15.46.22.53.34.07.12.07.68-.17 1.34z"/></svg>'
RIB_A = ''.join(f'<span>{t}</span>' for t in ['The 15 passages', 'The 20 Hadiths', 'The Seerah', 'The first community', 'The Caliphs', 'Articles of Faith', 'The Pillars', 'Part (a)', 'Part (b)'])
RIB_B = ''.join(f'<span>{t}</span>' for t in ['O Level 2058', 'IGCSE 0493', 'Karachi', 'Live online', 'Recorded course', 'AI checker', 'Past papers', 'Crash course'])
ZK = '<i></i>' * 40

PAGES = {  # page: (nav key, v1 url, v2 url, v3 url)
    'index': ('home', '/', '/v2', '/v3'),
    'about': ('about', '/about', '/v2/about', '/v3/about'),
    'courses': ('courses', '/courses', '/v2/courses', '/v3/courses'),
}

def build():
    OUT.mkdir(exist_ok=True)
    for name, (key, v1, v2, v3) in PAGES.items():
        f = SRC / 'pages' / f'{name}.html'
        if not f.exists():
            continue
        s = f.read_text()
        nav = P('nav.html').replace(f'data-k="{key}"', f'data-k="{key}" aria-current="page"')
        for k, v in {'{{NAV}}': nav, '{{FOOTER}}': P('footer.html'), '{{BASE_CSS}}': P('base.css'),
                     '{{BASE_JS}}': P('base.js'), '{{THREE_SCENES}}': P('three-scenes.js'),
                     '{{NEXLYR}}': P('nexlyr.svg'), '{{RIB_A}}': RIB_A, '{{RIB_B}}': RIB_B, '{{ZK}}': ZK,
                     '{{V1}}': v1, '{{V2}}': v2, '{{V3}}': v3}.items():
            s = s.replace(k, v)
        s = s.replace('{{ARROW}}', ARROW).replace('{{WA}}', WA)
        left = re.findall(r'\{\{[A-Z0-9_]+\}\}', s)
        assert not left, f'{name}: unfilled {left}'
        (OUT / f'{name}.html').write_text(s)
        print(f'v3/{name}.html  {len(s)//1024} KB')

if __name__ == '__main__':
    build()
