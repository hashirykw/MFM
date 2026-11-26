#!/usr/bin/env python3
"""Draws the link-preview (OG) images for every page in the folio design, 1200 x 630.
Needs the site served at http://127.0.0.1:8812 and Playwright. Run: python3 tools/folio/og/make.py"""
import asyncio, pathlib, html
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parents[3]
PAGES = {
 'index': ('Islamiyat, taught the way it is', 'marked.', 'O Level 2058 · IGCSE 0493 · Karachi & online', 'nabawi'),
 'courses': ('Two papers, taught the way', 'they’re marked.', 'O Level 2058 · IGCSE 0493 · recorded course', 'kaaba'),
 'syllabus': ('Every topic, ticked off as', 'you learn it.', '83 topics · passages, Hadiths, Seerah, Caliphs', 'quran'),
 'lab': ('Learn it here before', 'the exam asks.', 'Zakat · timeline · passages · Hadiths · key terms', 'quran'),
 'ai-checker': ('Your answer,', 'marked within hours.', 'Part (a) knowledge · part (b) understanding', 'mihrab'),
 'portal': ('Your course,', 'in one place.', 'Notes · lectures · results · rank · fees', 'nabawi'),
 'parent': ('Your child’s progress,', 'without asking twice.', 'Marks · position · attendance · fees', 'mihrab'),
 'past-papers': ('Sit it like', 'the real thing.', '2058 & 0493 papers 2020–2026 · timed', 'badr'),
 'notes': ('Notes written the way', 'answers get marked.', 'His book · workbooks · notes booklets', 'quran'),
 'crash-course': ('Islamiyat', 'crash course.', 'The weeks before the exam · Karachi & online', 'badr'),
 'reviews': ('In his students’', 'own words.', '7,000+ students since 2012', 'mihrab'),
 'about': ('Sir Fazil', 'Maniya.', 'IBA gold medalist · 15+ years · Cambridge-trained', 'hira'),
 'contact': ('Seats go fast.', 'One message gets you one.', 'WhatsApp 0333 2488819 · @mohammadfazilmaniya', 'nabawi'),
}
TPL = '''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/folio/base.css"><style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:#f3ecdc url(/assets/folio/img/paper/paper-light.webp);background-size:1024px;font-family:var(--f-body);color:oklch(19% .03 163)}
.g{position:absolute;inset:0;background-image:linear-gradient(oklch(19% .03 163 / .055) 1px,transparent 1px),linear-gradient(90deg,oklch(19% .03 163 / .055) 1px,transparent 1px);background-size:28px 28px}
.l{position:absolute;left:72px;top:64px;right:520px;bottom:64px;display:flex;flex-direction:column}
.b{display:flex;align-items:center;gap:14px;font:900 20px/1 var(--f-display);text-transform:uppercase}
.b img{width:54px;height:54px;border-radius:50%}
.b small{display:block;font:700 12px/1 var(--f-display);letter-spacing:.14em;color:oklch(48% .025 163);margin-top:6px}
h1{margin:auto 0 0;font:900 64px/.95 var(--f-display);text-transform:uppercase;letter-spacing:-.01em}
h1 em{font-style:normal;color:oklch(47% .12 163);background:linear-gradient(oklch(80% .145 80),oklch(80% .145 80)) 0 92%/100% .2em no-repeat}
p{margin:26px 0 0;font:700 15px/1.4 var(--f-display);letter-spacing:.12em;text-transform:uppercase;color:oklch(36% .03 163)}
.r{position:absolute;right:64px;top:52px;bottom:0;width:400px;border-radius:200px 200px 0 0;background:oklch(16% .035 163);overflow:hidden;box-shadow:0 40px 80px -30px rgba(0,0,0,.6)}
.r::before{content:"";position:absolute;inset:14px 14px 0;border:2px solid oklch(80% .145 80 / .55);border-bottom:0;border-radius:190px 190px 0 0}
.r .pl{position:absolute;left:34px;right:34px;top:70px;padding:12px;background:#f4eddd;border:1px solid rgba(0,0,0,.2)}
.r .pl img{width:100%;aspect-ratio:4/3;object-fit:contain;display:block}
.r .t{position:absolute;left:0;right:0;bottom:46px;text-align:center;font:900 15px/1 var(--f-display);color:#f3ecdc;text-transform:uppercase}
.r .t span{display:block;margin-top:12px;font:400 26px/1 var(--f-hand);text-transform:none;color:oklch(80% .145 80)}
.tear{position:absolute;left:0;right:0;bottom:0;height:16px;background:oklch(16% .035 163)}
</style></head><body><div class="g"></div><div class="l"><div class="b"><img src="/mfm-logo.webp"><span>Sir Fazil Maniya<small>Islamiyat · 2058 · 0493</small></span></div>
<h1>{a} <em>{b}</em></h1><p>{c}</p></div><div class="r"><div class="pl"><img src="/assets/folio/img/folio/{img}.webp"></div><div class="t">mohammadfazilmaniya.com<span>When you learn, teach.</span></div></div><div class="tear"></div></body></html>'''
async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg = await b.new_page(viewport={'width': 1200, 'height': 630})
        for slug, (a, bb, c, img) in PAGES.items():
            doc = TPL.replace('{a}', html.escape(a)).replace('{b}', html.escape(bb)).replace('{c}', html.escape(c)).replace('{img}', img)
            (ROOT / '_og.html').write_text(doc)
            await pg.goto('http://127.0.0.1:8812/_og.html?' + slug, wait_until='load'); await pg.wait_for_timeout(250)
            await pg.screenshot(path=str(ROOT / 'og' / f'{slug}.jpg'), type='jpeg', quality=86)
        (ROOT / '_og.html').unlink()
        await b.close()
asyncio.run(main())
