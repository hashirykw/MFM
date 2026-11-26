#!/usr/bin/env python3
"""Draws the six Islamiyat folio plates as hand-tinted pencil drawings (SVG with paper,
watercolour and wobbly-ink filters), renders them with headless Chrome and saves WebP files
to assets/folio/img/folio/. Run from the repo root: python3 tools/folio/plates.py"""
import asyncio, pathlib
from playwright.async_api import async_playwright
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets' / 'folio' / 'img' / 'folio'
OUT.mkdir(parents=True, exist_ok=True)

INK = '#2b2a26'
DEFS = '''
<defs>
 <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter>
 <filter id="wash" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="38" result="d"/><feGaussianBlur in="d" stdDeviation="5" result="b"/>
   <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="11" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.1 1.15" result="m"/><feComposite in="b" in2="m" operator="in"/></filter>
 <filter id="wc" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7" result="d"/>
   <feTurbulence type="fractalNoise" baseFrequency=".11" numOctaves="3" seed="9" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -.9 1.12" result="m"/><feComposite in="d" in2="m" operator="in"/></filter>
 <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line x1="0" y1="0" x2="0" y2="7" stroke="#2b2a26" stroke-width=".9" opacity=".55"/></pattern>
 <pattern id="hatch2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-42)"><line x1="0" y1="0" x2="0" y2="6" stroke="#2b2a26" stroke-width=".8" opacity=".45"/></pattern>
 <pattern id="cross" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0V7M0 0H7" stroke="#2b2a26" stroke-width=".7" opacity=".4" fill="none"/></pattern>
</defs>'''

def page(w, h, body, cap):
    return f'''<!doctype html><html><head><style>html,body{{margin:0;background:#f1e8d4}}svg{{display:block}}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{DEFS}
<rect width="{w}" height="{h}" fill="#f1e8d4"/>
{body}
<line x1="{w*.06}" y1="{h-110}" x2="{w*.94}" y2="{h-110}" stroke="{INK}" stroke-width="1.2" opacity=".5" filter="url(#pencil)"/>
<text x="{w/2}" y="{h-58}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="20" letter-spacing="4.5" fill="#7a6a55">{cap}</text>
</svg></body></html>'''

def ink(d, w=2.2, fill='none', extra=''):
    return f'<path d="{d}" fill="{fill}" stroke="{INK}" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round" filter="url(#pencil)" {extra}/>'

def wc(d, color, op=.85):
    return f'<path d="{d}" fill="{color}" opacity="{op}" filter="url(#wc)"/>'

def arch(cx, base, w, h):
    r = w / 2; sh = h - w * .8
    return f'M{cx-r} {base} V{base-sh} Q{cx-r} {base-sh-w*.55} {cx} {base-h} Q{cx+r} {base-sh-w*.55} {cx+r} {base-sh} V{base} Z'

def sky(cx, cy, rx, ry, color='#bccbd6'):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{color}" opacity=".75" filter="url(#wash)"/>'

def palm(x, base, s=1, lean=0):
    top = base - 150 * s
    parts = [ink(f'M{x} {base} Q{x+lean*.5} {base-75*s} {x+lean} {top}', 5 * s)]
    for k in range(6):
        parts.append(ink(f'M{x+lean} {top} Q{x+lean} {top-2} {x+lean} {top}', 1))
    fr = []
    for a in (-160, -125, -95, -60, -25, 10, 200):
        import math
        dx = math.cos(math.radians(a)) * 80 * s; dy = math.sin(math.radians(a)) * 34 * s
        fr.append(f'M{x+lean} {top} Q{x+lean+dx*.55} {top+dy-30*s} {x+lean+dx} {top+dy+18*s}')
    leaves = ''.join(wc(f'M{x+lean} {top} Q{x+lean+dx} {top-40*s} {x+lean+dx*1.0} {top+20*s} Q{x+lean+dx*.5} {top-6*s} {x+lean} {top}', '#6f9a5c', .8) for dx in (-80*s, 80*s, -50*s, 55*s))
    return leaves + ''.join(ink(d, 1.8) for d in fr) + parts[0] + ''.join(ink(f'M{x+lean*(k/6)-6*s} {base-k*24*s} h{12*s}', 1.1) for k in range(1, 6))

# ---------------- I · The Ka'ba ----------------
def kaaba():
    w, h = 1170, 832
    b = [sky(585, 330, 470, 250)]
    gy = 640
    b.append(wc(f'M70 {gy} Q585 {gy-40} 1100 {gy} L1100 {gy+60} L70 {gy+60}Z', '#e6d6b4', .9))
    # mataf ellipse
    b.append(ink(f'M150 {gy+20} Q585 {gy-55} 1020 {gy+20}', 1.4))
    # cube: front face + side face
    fx, fw, top = 420, 300, 280; sx = fx + fw; sw = 150
    b.append(wc(f'M{fx} {top} H{sx} V{gy-10} H{fx}Z', '#2c2a28', .92))
    b.append(wc(f'M{sx} {top} L{sx+sw} {top-40} V{gy-40} L{sx} {gy-10}Z', '#3d3a36', .9))
    b.append(f'<path d="M{sx} {top} L{sx+sw} {top-40} V{gy-40} L{sx} {gy-10}Z" fill="url(#hatch)"/>')
    # gold band
    b.append(f'<path d="M{fx} {top} H{sx} V{gy-10} H{fx}Z" fill="url(#hatch2)" opacity=".5"/>')
    b.append(wc(f'M{fx-40} {gy-10} H{sx+sw+30} L{sx+sw+30} {gy-2} H{fx-40}Z', '#d9c39b', .9))
    b.append(wc(f'M{fx} {top+70} H{sx} V{top+108} H{fx}Z', '#d4a84a', .95))
    b.append(wc(f'M{sx} {top+70} L{sx+sw} {top+30} V{top+66} L{sx} {top+108}Z', '#c79a3e', .9))
    b.append(''.join(ink(f'M{fx+18+i*36} {top+92} q6 -14 12 0 t12 0', 1.2) for i in range(8)))
    # door
    b.append(wc(f'M{fx+190} {gy-160} H{fx+250} V{gy-60} H{fx+190}Z', '#d4a84a', .95))
    b.append(ink(f'M{fx+190} {gy-160} H{fx+250} V{gy-60} H{fx+190}Z M{fx+220} {gy-160} V{gy-60}', 1.6))
    b.append(ink(f'M{fx} {top} H{sx} V{gy-10} H{fx}Z M{sx} {top} L{sx+sw} {top-40} V{gy-40} L{sx} {gy-10} M{fx} {top} L{fx+sw} {top-40} H{sx+sw}', 2.4))
    # Hijr Ismail semicircle wall
    b.append(wc(f'M{sx+30} {gy-12} Q{sx+260} {gy-30} {sx+250} {gy-90} L{sx+235} {gy-88} Q{sx+240} {gy-38} {sx+40} {gy-30}Z', '#eee5d2', .95))
    b.append(ink(f'M{sx+30} {gy-12} Q{sx+260} {gy-30} {sx+250} {gy-90} M{sx+40} {gy-30} Q{sx+240} {gy-38} {sx+235} {gy-88}', 1.8))
    # Maqam Ibrahim
    b.append(wc(f'M{fx-110} {gy-70} h50 v60 h-50z', '#d4a84a', .8)); b.append(ink(f'M{fx-110} {gy-70} h50 v60 h-50z M{fx-110} {gy-70} q25 -30 50 0', 1.6))
    # people as tiny strokes (no faces)
    for i in range(26):
        x = 130 + i * 36 + (i % 3) * 7; y = gy + 18 - (abs(585 - x) / 585) * -10
        b.append(ink(f'M{x} {y} v-16', 2.2, extra='opacity=".55"'))
    return 'kaaba', w, h, ''.join(b), "THE KA'BA · MAKKA"

# ---------------- II · Cave of Hira ----------------
def hira():
    w, h = 832, 1118
    b = [sky(416, 360, 330, 290, '#c6d2da')]
    base = 900
    mtn = f'M60 {base} L210 560 L300 610 L400 300 L470 360 L560 250 L640 420 L780 {base}Z'
    b.append(wc(mtn, '#b69873', .9)); b.append(f'<path d="{mtn}" fill="url(#hatch)" opacity=".8"/>')
    b.append(ink(mtn, 2.4))
    b.append(ink('M400 300 L430 470 L380 620 M560 250 L520 430 L600 600 M210 560 L260 720', 1.4))
    # cave mouth
    b.append(wc('M470 470 Q500 430 540 470 Q548 520 505 528 Q468 520 470 470Z', '#3a332b', .95))
    b.append(ink('M470 470 Q500 430 540 470 Q548 520 505 528 Q468 520 470 470Z', 2))
    # path
    b.append(ink(f'M150 {base} Q260 820 330 760 T450 640 T505 528', 1.6, extra='stroke-dasharray="7 9"'))
    # first light
    b.append(f'<circle cx="640" cy="200" r="38" fill="#f1d68a" opacity=".8" filter="url(#wc)"/>')
    b.append(ink('M640 140 v-22 M690 160 l16 -16 M590 160 l-16 -16 M700 205 h22', 1.4))
    b.append(wc(f'M40 {base} H792 V{base+40} H40Z', '#d9c39b', .8))
    return 'hira', w, h, ''.join(b), 'JABAL AL-NUR · 610 CE'

# ---------------- III · Masjid an-Nabawi ----------------
def nabawi():
    w, h = 1170, 832
    b = [sky(585, 320, 480, 250)]
    gy = 640
    b.append(wc(f'M60 {gy} H1110 V{gy+40} H60Z', '#e6d6b4', .9))
    # arcade wall
    b.append(wc(f'M170 {gy} V430 H1000 V{gy}Z', '#efe6d3', .95))
    b.append(ink(f'M170 {gy} V430 H1000 V{gy} M160 430 H1010 M160 418 H1010', 2.2))
    for i in range(9):
        cx = 220 + i * 92
        b.append(wc(arch(cx, gy, 58, 150), '#9fb7a8', .55)); b.append(f'<path d="{arch(cx, gy, 58, 150)}" fill="url(#hatch2)"/>')
        b.append(ink(arch(cx, gy, 58, 150), 1.8))
    # green dome on drum
    b.append(wc('M520 430 V380 H700 V430Z', '#efe6d3', .95)); b.append(ink('M520 430 V380 H700 V430', 2))
    dome = 'M512 380 Q505 260 610 215 Q715 260 708 380Z'
    b.append(wc(dome, '#3f8f6a', .95)); b.append(f'<path d="{dome}" fill="url(#hatch)" opacity=".5"/>')
    b.append(ink(dome, 2.4)); b.append(ink('M610 215 V180 M598 200 h24', 2)); b.append(ink('M600 168 a12 12 0 1 0 22 -6', 2))
    # minarets
    for x, ht in ((120, 210), (1050, 210), (410, 260), (820, 260)):
        top = gy - (gy - ht)
        b.append(wc(f'M{x-16} {gy} V{ht} H{x+16} V{gy}Z', '#efe6d3', .95))
        b.append(ink(f'M{x-16} {gy} V{ht} H{x+16} V{gy} M{x-24} {ht+70} H{x+24} M{x-24} {ht+190} H{x+24}', 1.9))
        b.append(wc(f'M{x-16} {ht} Q{x} {ht-60} {x+16} {ht}Z', '#3f8f6a', .9)); b.append(ink(f'M{x-16} {ht} Q{x} {ht-60} {x+16} {ht} M{x} {ht-46} v-22', 1.8))
    b.append(palm(70, gy + 10, .9, 10) + palm(1110, gy + 10, .85, -12))
    return 'nabawi', w, h, ''.join(b), 'MASJID AN-NABAWI · MADINA · 622'

# ---------------- IV · The wells of Badr ----------------
def badr():
    w, h = 910, 1118
    b = [sky(455, 340, 360, 270, '#cfd6d4')]
    gy = 860
    b.append(wc('M40 620 Q200 560 330 600 T620 580 T880 600 V640 H40Z', '#c4a57a', .7))
    b.append(ink('M40 620 Q200 560 330 600 T620 580 T880 600', 1.6))
    b.append(wc(f'M30 {gy-160} Q300 {gy-230} 520 {gy-170} T890 {gy-150} V{gy+60} H30Z', '#e2c99a', .9))
    b.append(f'<path d="M30 {gy-160} Q300 {gy-230} 520 {gy-170} T890 {gy-150} V{gy+60} H30Z" fill="url(#hatch2)" opacity=".35"/>')
    b.append(ink(f'M30 {gy-160} Q300 {gy-230} 520 {gy-170} T890 {gy-150}', 2))
    for cx, cy, r in ((330, gy - 40, 80), (610, gy - 90, 58)):
        b.append(wc(f'M{cx-r} {cy} a{r} {r*.32} 0 1 0 {2*r} 0 v40 a{r} {r*.32} 0 1 1 {-2*r} 0Z', '#b8a58a', .9))
        b.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{r*.8}" ry="{r*.24}" fill="#3a332b" opacity=".85" filter="url(#wc)"/>')
        b.append(ink(f'M{cx-r} {cy} a{r} {r*.32} 0 1 0 {2*r} 0 a{r} {r*.32} 0 1 0 {-2*r} 0 M{cx-r} {cy} v40 a{r} {r*.32} 0 0 0 {2*r} 0 v-40', 2))
        for k in range(5): b.append(ink(f'M{cx-r+k*r*.5} {cy+12} v22', 1.1))
        b.append(ink(f'M{cx-r*.7} {cy-6} L{cx} {cy-r*1.1} L{cx+r*.7} {cy-6} M{cx} {cy-r*1.1} v{r*.6}', 1.8))
    b.append(f'<circle cx="700" cy="250" r="34" fill="#f1d68a" opacity=".75" filter="url(#wc)"/>')
    b.append(ink('M560 692 V590 M560 590 l46 14 l-46 14', 1.8)); b.append(wc('M560 590 l46 14 l-46 14Z', '#3f8f6a', .9))
    b.append(palm(150, gy - 140, 1, 14) + palm(780, gy - 150, .9, -10) + palm(840, gy - 120, .7, 8))
    return 'badr', w, h, ''.join(b), 'THE WELLS OF BADR · 2 AH'

# ---------------- V · The Qur'an on a rehal ----------------
def quran():
    w, h = 988, 806
    b = [sky(494, 300, 400, 220, '#c8d4d6')]
    gy = 640
    b.append(wc(f'M90 {gy} H900 V{gy+30} H90Z', '#d9c39b', .8))
    # rehal: crossed boards
    b.append(wc(f'M330 {gy} L560 360 L610 380 L390 {gy}Z', '#8a6340', .9)); b.append(wc(f'M660 {gy} L430 360 L380 380 L600 {gy}Z', '#9b7048', .9))
    b.append(ink(f'M330 {gy} L560 360 L610 380 L390 {gy}Z M660 {gy} L430 360 L380 380 L600 {gy}Z', 2.2))
    # open book
    left = 'M495 330 Q400 290 270 318 L300 470 Q410 450 495 480Z'; right = 'M495 330 Q590 290 720 318 L690 470 Q580 450 495 480Z'
    b.append(f'<path d="{left} {right}" fill="#f6eedb"/>')
    b.append(wc(left, '#fbf4e2', 1)); b.append(wc(right, '#fbf4e2', 1))
    b.append(wc('M266 312 L296 472 L292 478 L260 318Z M724 312 L694 472 L698 478 L730 318Z', '#1f5a45', .95))
    b.append(ink(left + ' ' + right, 2.2))
    for i in range(7):
        y = 345 + i * 17
        b.append(ink(f'M{300+i*1.6} {y+i*.3} Q{390} {y-12} {480} {y+6}', 1.05, extra='opacity=".7"'))
        b.append(ink(f'M{510} {y+6} Q{600} {y-12} {690-i*1.6} {y+i*.3}', 1.05, extra='opacity=".7"'))
    b.append(wc('M380 352 q20 -12 40 0 q-20 12 -40 0Z M570 352 q20 -12 40 0 q-20 12 -40 0Z', '#c9973c', .9))
    # oil lamp
    b.append(wc(f'M780 {gy} q-50 0 -40 -30 q30 -10 80 -6 q14 10 6 30Z', '#c9973c', .9))
    b.append(ink(f'M780 {gy} q-50 0 -40 -30 q30 -10 80 -6 q14 10 6 30Z M826 {gy-36} q30 -6 34 -22', 1.8))
    b.append(f'<path d="M742 {gy-34} q-6 -28 6 -46 q14 22 -6 46Z" fill="#f3c55e" opacity=".9" filter="url(#wc)"/>')
    return 'quran', w, h, ''.join(b), "THE QUR'AN · THE 15 PASSAGES"

# ---------------- VI · Mihrab ----------------
def mihrab():
    w, h = 832, 1066
    b = [sky(416, 330, 300, 250, '#cfd8d8')]
    gy = 860
    b.append(wc(f'M140 {gy} V200 H692 V{gy}Z', '#eee4cf', .95))
    b.append(f'<path d="M140 {gy} V200 H692 V{gy}Z" fill="url(#cross)" opacity=".35"/>')
    b.append(ink(f'M140 {gy} V200 H692 V{gy} M130 200 H702 M130 186 H702', 2.2))
    outer = arch(416, gy, 330, 560); inner = arch(416, gy, 250, 470)
    b.append(wc(outer, '#d9b46a', .85)); b.append(wc(inner, '#2f6e57', .92)); b.append(f'<path d="{inner}" fill="url(#hatch)" opacity=".45"/>')
    b.append(ink(outer, 2.4) + ink(inner, 2.2))
    for i in range(9):
        y = 300 + i * 24
        b.append(ink(f'M{170} {y} h{30}  M{632} {y} h{30}', 1, extra='opacity=".6"'))
    # hanging lamp
    b.append(ink('M416 200 V430', 1.4)); b.append(wc('M386 430 h60 l-8 50 h-44Z', '#e8b955', .95)); b.append(ink('M386 430 h60 l-8 50 h-44Z', 1.8))
    b.append(f'<circle cx="416" cy="456" r="10" fill="#fff2c6" opacity=".95" filter="url(#wc)"/>')
    # prayer mat in front
    b.append(wc(f'M250 {gy+10} L582 {gy+10} L640 {gy+90} L192 {gy+90}Z', '#9b3a33', .9))
    b.append(wc(f'M290 {gy+22} L542 {gy+22} L588 {gy+78} L244 {gy+78}Z', '#c79a3e', .6))
    b.append(ink(f'M250 {gy+10} L582 {gy+10} L640 {gy+90} L192 {gy+90}Z', 2))
    return 'mihrab', w, h, ''.join(b), 'THE MIHRAB · THE PILLARS'

async def main():
    plates = [kaaba(), hira(), nabawi(), badr(), quran(), mihrab()]
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        for name, w, h, body, cap in plates:
            pg = await b.new_page(viewport={'width': w, 'height': h})
            await pg.set_content(page(w, h, body, cap))
            await pg.wait_for_timeout(300)
            png = OUT / f'{name}.png'
            await pg.screenshot(path=str(png))
            Image.open(png).convert('RGB').save(OUT / f'{name}.webp', 'WEBP', quality=82, method=6)
            png.unlink()
            print(name, w, h)
        await b.close()

asyncio.run(main())
