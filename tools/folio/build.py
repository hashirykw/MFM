#!/usr/bin/env python3
"""Builds the Sir Fazil Maniya site in the folio (paper-and-ink) design.

Every page shares one shell (top bar, contents menu, bottom dock, footer, Nexlyr strip),
served as separate files in /assets/folio so the browser caches them after the first page.

  index.html            the folio home (tools/folio/src/index.html)
  every other page      the full V1 page (tools/folio/v1src/*.html: all data, tools, forms
                        and scripts kept) re-dressed in the folio design

Run from the repo root:  python3 tools/folio/build.py
"""
import pathlib, re, html, hashlib
import tinycss2

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = ROOT / 'tools' / 'folio'
SRC, V1 = HERE / 'src', HERE / 'v1src'
OUT = ROOT / 'assets' / 'folio'
R = lambda p: (SRC / p).read_text()

# ------------------------------------------------------------------ pages
# slug: (menu title, menu line, icon, bands for the top-level <section>s of <main>)
#   bands: p paper · i ink · l emerald · s sandstone (first one is the hero)
PAGES = {
    'index':        ('Home', 'The folio, from Hira to the Farewell Sermon', 'i-home', None),
    'courses':      ('Courses', 'O Level 2058, IGCSE 0493, recorded', 'i-book', 'pplpi'),
    'syllabus':     ('Syllabus', 'Every topic, ticked as you learn it', 'i-paper', 'ppi'),
    'lab':          ('Islamiyat Lab', 'Zakat, timeline, passages, Hadiths', 'i-lab', 'ppl'),
    'ai-checker':   ('AI Checker', 'Your answer, marked against the levels', 'i-ai', 'ppippl p'),
    'portal':       ('Student portal', 'Notes, lectures, results, fees', 'i-portal', 'ppp'),
    'parent':       ('Parents', 'Marks, position, attendance, fees', 'i-users', 'pp'),
    'past-papers':  ('Past papers', '2020–2026, side by side, timed', 'i-paper', 'ppip'),
    'notes':        ('Notes & books', 'His book, workbooks and booklets', 'i-book', 'ppipl'),
    'crash-course': ('Crash course', 'The weeks before the exam', 'i-cal', 'ppippip'),
    'reviews':      ('Reviews', 'In his students’ own words', 'i-quote', 'ppl'),
    'about':        ('About Sir Fazil', '15+ years, IBA gold medalist', 'i-star', 'ppipplpp'),
    'contact':      ('Enrol & contact', 'WhatsApp, centres, batches', 'i-phone', 'ppl'),
    '404':          ('Not found', '', 'i-home', 'p'),
}
MENU = ['courses', 'syllabus', 'lab', 'ai-checker', 'portal', 'parent', 'past-papers', 'notes', 'crash-course', 'reviews', 'about', 'contact']
DOCK = [('index', 'Home', 'i-home'), ('courses', 'Courses', 'i-book'), ('lab', 'Lab', 'i-lab'), ('portal', 'Portal', 'i-portal'), ('ai-checker', 'AI Check', 'i-ai')]
BAND = {'p': 's-paper', 'i': 's-ink', 'l': 's-lapis', 's': 's-sandstone'}
TAPE = {
    'courses': ['2058 · O Level', 'Paper 1 · 50 marks', 'Paper 2 · 50 marks', '0493 · IGCSE', 'Part (a) · 10 marks', 'Part (b) · 4 marks', 'Recorded · 54 hours'],
    'syllabus': ['15 passages', '20 Hadiths', 'The Seerah', 'The first community', 'Four Caliphs', 'Articles of Faith', 'Five Pillars'],
    'lab': ['Zakat · 2.5%', 'Nisab', 'Which came first', '570 to 661', '15 passages', '20 Hadiths', 'Key terms'],
    'ai-checker': ['Write it', 'Snap or type', 'Marked in levels', 'Sir Fazil approves', 'Fix and resend', 'Level 1 to Level 4'],
    'portal': ['Notes', 'Lectures', 'Results', 'Rank', 'Fees', 'AI checks', 'Profile'],
    'parent': ['Marks', 'Class position', 'Attendance', 'Fees', 'Every child', 'Read-only'],
    'past-papers': ['2020', '2021', '2022', '2023', '2024', '2025', '2026', 'QP + MS side by side', 'Sit it timed'],
    'notes': ['Paper 1 workbook', 'Paper 2 workbook', 'Notes booklets', 'The MFM book · 2026–27', 'Printed or PDF'],
    'crash-course': ['15 passages', '20 Hadiths', 'The Seerah in order', 'Timed mocks', 'Karachi & online'],
    'reviews': ['When you learn, teach', 'When you get, give', '#IslamiyatWithMFM'],
    'about': ['Since 2012', '7,000+ students', 'IBA gold medalist', 'Cambridge-trained', 'National Tenpin Bowling Champion'],
    'contact': ['0333 2488819', '@mohammadfazilmaniya', 'Jauhar · Gulshan', 'North Nazimabad', 'Defence', 'Bahadurabad', 'Online'],
}
PLATES = {  # heroes without a picture get one of the hand-drawn folio plates
    'lab': ('quran.webp', 'Plate III · the Qur\u2019an', 'fifteen passages'),
    'reviews': ('mihrab.webp', 'Plate V · the mihrab', 'in their own words'),
    '404': ('hira.webp', 'Plate II · Jabal al-Nur', 'start again at Hira'),
}
url = lambda slug: '/' if slug == 'index' else '/' + slug


def ver(*names):
    h = hashlib.md5()
    for n in names:
        h.update((OUT / n).read_bytes())
    return h.hexdigest()[:8]


# ------------------------------------------------------------------ shell partials
def sprite():
    s = R('index.html')
    i = s.index('<svg width="0" height="0"'); j = s.index('</svg>', i) + 6
    sp = s[i:j]
    extra = (
        '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></symbol>'
        '<symbol id="i-bag" viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6zM9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></symbol>'
        '<symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.4 3.4 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.4 3.5 5.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></symbol>'
        '<symbol id="i-cal" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M3.5 10h17M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></symbol>'
        '<symbol id="i-quote" viewBox="0 0 24 24"><path d="M5 18c2.6-1 4-3.3 4-6.5V6H4v6h4M15 18c2.6-1 4-3.3 4-6.5V6h-5v6h4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></symbol>'
    )
    sp = sp.replace('</defs>', extra + '</defs>')
    nx = R('nexlyr.html')
    m = re.search(r'<svg width="0".*?</svg>', nx, re.S)
    return sp + '\n' + (m.group(0) if m else '')


def nexlyr_strip():
    nx = R('nexlyr.html')
    return re.sub(r'\s*<svg width="0".*?</svg>', '', nx, count=1, flags=re.S).strip()


def tsw():
    return ('<button class="tsw" id="themeBtn" type="button" role="switch" aria-checked="false" aria-label="Switch to the ink theme">'
            '<span class="tsw-sky" aria-hidden="true"><i class="cl c1"></i><i class="cl c2"></i><i class="sk s1"></i><i class="sk s2"></i><i class="sk s3"></i><i class="sk s4"></i></span>'
            '<span class="tsw-knob" aria-hidden="true"><i class="crater k1"></i><i class="crater k2"></i></span>'
            '<span class="tsw-lbl" aria-hidden="true"><b class="d">Paper</b><b class="n">Ink</b></span></button>')


def header(slug, legacy):
    tools = ''
    if legacy:
        tools = ('<button class="iconbtn top-ic" type="button" data-cmdk aria-label="Search the site"><svg><use href="#i-search"/></svg></button>'
                 f'<button class="iconbtn top-ic top-cart{" on" if slug == "notes" else ""}" type="button" data-cart-open aria-label="Notes cart"><svg><use href="#i-bag"/></svg><i data-cart-n></i></button>')
    cta = '#register' if slug == 'index' else '/contact#enrol'
    return f'''<header class="top" id="top">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Sir Fazil Maniya, home">
      <img class="vmark" src="/mfm-logo.webp" alt="" width="38" height="38">
      <span><b>Sir Fazil Maniya</b><small>Islamiyat · 2058 · 0493</small></span>
    </a>
    <div class="top-r">
      {tools}{tsw()}
      <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="menu"><span class="mb-ico" aria-hidden="true"><i></i><i></i></span><span class="mb-t"><b>Menu</b><b>Close</b></span></button>
      <a class="btn btn--sm top-cta" data-plain href="{cta}">Join the class <svg class="arr"><use href="#i-arr"/></svg></a>
    </div>
  </div>
</header>'''


def menu(slug):
    items = []
    for k, s in enumerate(MENU):
        t, sub, ic, _ = PAGES[s]
        here = ' here' if s == slug else ''
        cur = ' aria-current="page"' if s == slug else ''
        items.append(f'<a class="mi{here}" href="{url(s)}"{cur} style="--i:{k}"><span class="mi-n">{k + 1:02d}</span><svg class="mi-ic"><use href="#{ic}"/></svg>'
                     f'<span class="mi-t"><b>{html.escape(t)}</b><small>{html.escape(sub)}</small></span><svg class="mi-ar"><use href="#i-arr"/></svg></a>')
    join = '#register' if slug == 'index' else '/contact#enrol'
    return f'''<div class="menu-scrim" id="menuScrim" aria-hidden="true"></div>
<div class="menu" id="menu" role="dialog" aria-label="Site menu" aria-hidden="true">
  <div class="menu-in">
    <div class="menu-head"><span class="lbl">Contents · Islamiyat with Sir Fazil</span><span class="hand">turn to any page</span></div>
    <nav class="menu-grid" aria-label="Pages">{"".join(items)}</nav>
    <aside class="menu-feat">
      <div class="mf-plate"><img src="/assets/folio/img/folio/nabawi.webp" alt="" width="1170" height="832" loading="lazy"></div>
      <div class="mf-body">
        <span class="lbl">Batches fill every session</span>
        <b class="mf-h">Register once. Get your login on WhatsApp.</b>
        <p>Evening classes across Karachi, live online, or the recorded course.</p>
        <div class="mf-act"><a class="btn btn--gold btn--sm" data-plain href="{join}">Join the class <svg class="arr"><use href="#i-arr"/></svg></a><a class="btn btn--line btn--sm" data-plain href="https://wa.me/923332488819" target="_blank" rel="noopener">WhatsApp</a></div>
        <p class="mf-tel">0333 2488819 · @mohammadfazilmaniya</p>
      </div>
    </aside>
  </div>
</div>'''


def dock(slug):
    a = []
    for s, t, ic in DOCK:
        cur = 'true' if s == slug else 'false'
        hide = ' class="dk-hide-m"' if s in ('portal', 'ai-checker') else ''
        a.append(f'<a href="{url(s)}"{hide} aria-current="{cur}"><svg><use href="#{ic}"/></svg>{t}</a>')
    join_cur = 'true' if slug == 'contact' else 'false'
    join = '#register' if slug == 'index' else '/contact#enrol'
    return f'''<nav class="dock" id="dock" aria-label="Main">
  {"".join(a)}
  <span class="dk-sep" aria-hidden="true"></span>
  <a href="{join}" class="dk-cta" aria-current="{join_cur}"><svg><use href="#i-dome"/></svg>Join</a>
  <button type="button" id="moreBtn" class="dk-more" aria-expanded="false" aria-controls="menu"><svg><use href="#i-more"/></svg>More</button>
</nav>'''


def footer(torn):
    links = ''.join(f'<a href="{url(s)}">{html.escape(PAGES[s][0])}</a>' for s in MENU)
    return f'''<footer class="foot s-ink{' tear-t' if torn else ''}">
  <div class="wrap">
    <p class="foot-big">When you learn, teach. When you get, <span>give.</span></p>
    <div class="foot-row">
      <a class="brand" href="/"><img class="vmark" src="/mfm-logo.webp" alt="" width="38" height="38" loading="lazy"><span><b>Sir Fazil Maniya</b><small>Islamiyat · Karachi &amp; online · #IslamiyatWithMFM</small></span></a>
      <div class="foot-soc">
        <a href="https://www.instagram.com/mohammadfazilmaniya" target="_blank" rel="noopener" aria-label="Instagram"><svg><use href="#i-ig"/></svg></a>
        <a href="https://www.youtube.com/@mohammadfazilmaniya" target="_blank" rel="noopener" aria-label="YouTube"><svg><use href="#i-ytb"/></svg></a>
        <a href="https://wa.me/923332488819" target="_blank" rel="noopener" aria-label="WhatsApp"><svg><use href="#i-wa"/></svg></a>
      </div>
    </div>
    <nav class="foot-links" aria-label="Footer">{links}</nav>
    <div class="foot-meta">
      <p><small>© <span id="yr">2026</span> Sir Mohammad Fazil Maniya · O Level 2058 &amp; IGCSE 0493 Islamiyat. Syllabus summaries from Cambridge International’s published syllabuses; syllabus codes and past papers belong to Cambridge University Press &amp; Assessment. Not affiliated with Cambridge.</small></p>
    </div>
    {nexlyr_strip()}
  </div>
</footer>'''


def tape(slug, more=True):
    items = TAPE.get(slug)
    if not items:
        return ''
    one = ''.join(f'<span>{html.escape(t)}<svg viewBox="0 0 24 24"><use href="#i-star"/></svg></span>' for t in items * 2)
    return f'<div class="fp-tape s-ink {"tear-tb" if more else "tear-t"}" aria-hidden="true"><div class="fp-tape-in">{one}{one}</div></div>'


FONTS = ('<link rel="preload" href="/assets/folio/fonts/font-archivo-wide-900.woff2" as="font" type="font/woff2" crossorigin>'
         '<link rel="preload" href="/assets/folio/fonts/font-archivo-400.woff2" as="font" type="font/woff2" crossorigin>')
THEME = '<script>(function(){var d=document.documentElement,t="light";try{t=(localStorage.getItem("ra-theme")||"light").replace(/"/g,"");}catch(e){}d.dataset.theme=t==="dark"?"dark":"light";})();</script>'
METAS = '<meta name="theme-color" content="#f3ecdc"><meta name="color-scheme" content="light dark">'


# ------------------------------------------------------------------ legacy CSS (V1 layout, pruned)
SHELL_CLASSES = {
    'nav', 'nav-links', 'nav-more', 'nav-drop', 'nav-r', 'nav-search', 'nav-cart', 'nav-theme', 'btn-enrol', 'burger', 'nl-opt',
    'menu', 'menu-foot', 'ft', 'ft-top', 'ft-brand', 'ft-bt', 'ft-tag', 'ft-soc', 'ft-links', 'ft-nx', 'ft-nx-id', 'ft-nx-mk', 'ft-nx-t',
    'ft-nx-mid', 'ft-nx-go', 'ft-meta', 'dock', 'fab', 'mbar', 'mb-ask', 'mb-t', 'mb-enrol', 'mb-ic', 'mb-hide', 'cursor', 'c-dot', 'c-ring',
    'bg-base', 'aurora', 'bg-veil', 'grain', 'sprog', 'brand', 'brand-t', 'tdock', 'tpill', 'tpill-k', 'tpill-lab', 'tpill-l', 'tpill-d',
    'tsnd', 'tmini', 'app-card', 'ldx', 'pt', 'menu-open', 'foot-mark', 'fm-o', 'top', 'skip', 'chat-fab', 'top-r', 'nxb', 'nxb__id', 'nxb__mk', 'nxb__nm', 'nxb__go', 'foot', 'foot-big', 'foot-row', 'foot-links', 'foot-meta', 'foot-soc',
}
WORD = re.compile(r'[A-Za-z_][\w-]*')


def alive_words():
    words = set()
    for p in list(V1.glob('*.html')) + [SRC / 'mfm.js', SRC / 'core.js', ROOT / 'config.js']:
        t = p.read_text()
        if p.suffix == '.html':
            t = re.sub(r'<style[^>]*>.*?</style>', ' ', t, flags=re.S)
        words.update(WORD.findall(t))
    return words


def prune_css(text, alive):
    rules = tinycss2.parse_stylesheet(text, skip_comments=True, skip_whitespace=True)

    def keep_sel(sel):
        classes = re.findall(r'\.([A-Za-z_][\w-]*)', re.sub(r'url\([^)]*\)', '', sel))
        if any(c in SHELL_CLASSES for c in classes):
            return False
        if any(c not in alive for c in classes):
            return False
        return True

    def walk(rs):
        out = []
        for r in rs:
            if r.type == 'qualified-rule':
                sel = tinycss2.serialize(r.prelude).strip()
                parts = split_selectors(sel)
                kept = [s for s in parts if keep_sel(s)]
                if not kept:
                    continue
                out.append(','.join(kept) + '{' + tinycss2.serialize(r.content).strip() + '}')
            elif r.type == 'at-rule':
                kw = r.at_keyword.lower()
                if kw in ('media', 'supports', 'layer', 'container') and r.content is not None:
                    inner = walk(tinycss2.parse_rule_list(r.content, skip_comments=True, skip_whitespace=True))
                    if inner:
                        out.append('@' + r.at_keyword + tinycss2.serialize(r.prelude).rstrip() + '{' + ''.join(inner) + '}')
                else:
                    out.append(tinycss2.serialize([r]).strip())
        return out
    return '\n'.join(walk(rules))


def split_selectors(sel):
    parts, depth, cur = [], 0, ''
    for ch in sel:
        if ch in '([':
            depth += 1
        elif ch in ')]':
            depth -= 1
        if ch == ',' and depth == 0:
            parts.append(cur.strip()); cur = ''
        else:
            cur += ch
    if cur.strip():
        parts.append(cur.strip())
    return parts


BG_MAP = [
    (r'rgba?\(\s*218[ ,]+241[ ,]+222\s*(?:[/,]\s*[\d.]+\s*)?\)', 'var(--card)'),
    (r'rgba?\(\s*5[ ,]+31[ ,]+32\s*[/,]\s*0?\.(?:8|9)\d*\s*\)', 'var(--card)'),
    (r'rgba?\(\s*237[ ,]+241[ ,]+239\s*[/,]\s*[\d.]+\s*\)', 'var(--card)'),
    (r'linear-gradient\(180deg,\s*#FFFFFF,\s*#F6F7F8\)', 'var(--card)'),
    (r'#(?:fff|FFF|ffffff|FFFFFF)\b', 'var(--card)'),
    (r'rgba?\(\s*255[ ,]+255[ ,]+255\s*[/,]\s*0?\.[5-9]\d*\s*\)', 'var(--card)'),
]


FG_MAP = [
    (r'#051f20\b|#051F20\b|rgba?\(\s*5[ ,]+31[ ,]+32\s*\)|#0b2b26\b|#0B2B26\b|#020f0f\b', 'var(--text)'),
    (r'#163832\b|rgba?\(\s*22[ ,]+56[ ,]+50\s*\)|#235347\b|rgba?\(\s*35[ ,]+83[ ,]+71\s*\)|#366556\b|#396758\b|#447261\b', 'var(--text-2)'),
    (r'#517e6b\b|#648f7a\b|#54806d\b|#608c77\b|#5a8672\b', 'var(--text-3)'),
    (r'rgba?\(\s*5[ ,]+31[ ,]+32\s*[/,]\s*0?\.(?:[5-8]\d*)\s*\)', 'var(--text-2)'),
]


def remap_fg(css):
    """V1 hard-coded dark text colours follow the band (so they read on ink and emerald too)."""
    def fix(m):
        v = m.group(2)
        for pat, rep in FG_MAP:
            v = re.sub(pat, rep, v)
        return m.group(1) + v
    return re.sub(r'((?<![\w-])color\s*:\s*)([^;}]+)', fix, css)


def remap_bg(css):
    """V1 hard-coded light panels (mint glass, white) become folio cards, in every band and theme."""
    def fix(m):
        v = m.group(2)
        for pat, rep in BG_MAP:
            v = re.sub(pat, rep, v)
        return m.group(1) + v
    return remap_fg(re.sub(r'(background(?:-color)?\s*:\s*)([^;}]+)', fix, css))


def legacy_css():
    alive = alive_words() | set(WORD.findall(R('bridge.css')))
    A = ROOT / 'assets'
    l1 = prune_css((A / 'mfm-1.css').read_text(), alive)
    l2 = prune_css('\n'.join((A / n).read_text() for n in ('mfm-2.css', 'mfm-3.css', 'mfm.css')), alive)
    # V1 asset paths are relative to /assets
    fix = lambda s: s.replace('url(../fonts/', 'url(/fonts/').replace('url("../fonts/', 'url("/fonts/').replace("url('../fonts/", "url('/fonts/")
    (OUT / 'legacy-1.css').write_text('/* V1 layout (pruned) · generated by tools/folio/build.py */\n' + remap_bg(fix(l1)))
    (OUT / 'legacy-2.css').write_text('/* V1 layout (pruned) · generated by tools/folio/build.py */\n' + remap_bg(fix(l2)))
    return alive


# ------------------------------------------------------------------ bridge tokens
ALIAS = '''--v-glow:var(--text);--ink:var(--text);--ink-2:var(--text-2);--ink-3:var(--text-3);--ink-4:color-mix(in oklch,var(--text) 32%,transparent);
  --v-soft:var(--text-2);--v-mute:var(--text-3);--v-line:var(--rule);--v-line-2:var(--rule-2);--line:var(--rule);--line-w:var(--rule);--rule-3:var(--rule-2);
  --v-pur:var(--royal);--v-pur-2:var(--royal);--v-pur-d:var(--paper-3);--brass:var(--royal);--brass-2:var(--text);--brass-3:var(--royal);--v-gold:var(--royal);--v-gold-2:var(--text);--green:var(--royal);--green-2:var(--royal-soft);--v-steel:var(--paper-3);
  --v-ink:var(--paper-2);--v-ink-2:var(--paper-3);--v-ink-3:var(--paper-2);--v-disc:var(--paper);
  --glass:var(--card);--glass-solid:var(--card);--panel:var(--card);--panel-solid:var(--card);--panel-2:var(--paper-2);--panel-hi:var(--paper-2);--bg:var(--paper);--bg-2:var(--paper-2);--bg-3:var(--paper-3);
  --chrome:linear-gradient(var(--text),var(--text));--chrome-x:var(--chrome);--gold:var(--chrome);--gold-text:var(--chrome);--metal:var(--chrome);
  --hi:0 0 0 0 transparent;--shadow-s:var(--shadow);--red:var(--danger);--bad:var(--danger);--ruling:var(--grid-c);
  --f-mono:var(--f-display);--r-3:14px;--r-4:18px;--e-out:var(--ease-out);--e-io:var(--ease-in-out);--e-spring:cubic-bezier(.34,1.56,.64,1);
  --tx:var(--text);--tx-2:var(--text-2);--tx-3:var(--text-3);--em:var(--royal);--acc:var(--royal);--violet:var(--royal);--acc-soft:var(--royal-soft);
  --glass-sh:0 1px 0 oklch(19% .03 163 / .04),0 22px 40px -30px oklch(19% .03 163 / .5);--frost:none;--glass-2:var(--paper-2);--glass-b:var(--rule-2);
  --edge-a:var(--rule-2);--edge-b:var(--rule);--chrome-edge:linear-gradient(var(--rule-2),var(--rule-2));--chrome-soft:var(--chrome);--chrome-text:var(--chrome);
  --silver-line:linear-gradient(90deg,transparent,var(--rule-2) 18%,var(--rule-2) 82%,transparent);--inset:inset 0 0 0 1px var(--rule-2);--raise:var(--shadow);
  --surf:var(--card);--surf-2:var(--paper-2);--line-2:var(--rule-2);--glow-sm:0 0 0 transparent;--glow-lg:0 0 0 transparent;--brass-ink:var(--paper);
  --margin:oklch(55% .2 27 / .3);--emerald-fill:var(--text);'''
BAND_TOK = {
    ':root:root:root': '--acc-rgb:0 111 71;--card:oklch(97.8% .011 85);--field:oklch(99% .006 85);',
    ':root:root:root[data-theme="dark"]': '--acc-rgb:114 181 150;--card:oklch(21.5% .04 163);--field:oklch(17% .035 163);',
    '.s-paper': '',
    '.s-ink': '--acc-rgb:114 181 150;--card:oklch(21% .04 163);--field:oklch(15% .03 163);--danger:oklch(72% .15 30);',
    '.s-lapis': '--acc-rgb:238 178 61;--card:oklch(35% .084 163);--field:oklch(27% .07 163);--danger:oklch(78% .13 40);',
    '.s-sandstone': '--acc-rgb:238 178 61;--card:oklch(47% .13 38);--field:oklch(42% .12 36);--danger:oklch(88% .1 60);',
}


def boost(css):
    """Selectors written as `.fp …` are raised to (0,4,1) so they beat the V1 theme stacks."""
    return re.sub(r'(^[ \t]*|[,{}]\s*)\.fp(?=[ .:\[])', r'\1:root:root:root:root:root body.fp.fp', css, flags=re.M)


def bridge_tokens():
    b = R('base.css')
    root = re.search(r'(?ms)^:root\{(.*?)^\}', b).group(1)
    dark = re.search(r'(?ms)^\[data-theme="dark"\]\{(.*?)^\}', b).group(1)
    out = ['/* generated by tools/folio/build.py: the folio tokens win over the V1 ones, and every V1 token points at a folio token */',
           ':root:root:root{' + root + '}', ':root:root:root[data-theme="dark"]{' + dark + '}']
    for sel, extra in BAND_TOK.items():
        out.append(sel + '{' + extra + '}')
    out.append(':root:root:root,.s-paper,.s-ink,.s-lapis,.s-sandstone{\n  ' + ALIAS + '}')
    return '\n'.join(out) + '\n'


# ------------------------------------------------------------------ helpers
def balanced(s, start, tag):
    """Index just past the element that opens at s[start] (a <tag ...>)."""
    pat = re.compile(r'<(/?)' + tag + r'\b[^>]*>', re.I)
    depth = 0
    for m in pat.finditer(s, start):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return m.end()
    raise ValueError('unbalanced ' + tag)


def drop_el(s, opener, tag):
    i = s.find(opener)
    while i != -1:
        s = s[:i] + s[balanced(s, i, tag):]
        i = s.find(opener)
    return s


PHOTO = {'photos/course-2058.webp': 'photos/in-class.webp', 'photos/online-class.webp': 'fazil-maniya.webp',
         'photos/recorded-course.webp': 'photos/study-pack.webp', 'photos/badr-lesson.webp': 'photos/crash-course.webp',
         'photos/course-0493.webp': 'photos/sir-fazil-event.webp', 'photos/marked-answer.webp': 'fazil-desk.webp'}


def fix_photos(s):
    for a, b in PHOTO.items():
        if not (ROOT / a).exists():
            s = s.replace(a, b)
    return s


def fix_links(s):
    s = re.sub(r'href="index\.html#register"', 'href="/#register"', s)
    s = re.sub(r'href="index\.html(#[\w-]+)?"', 'href="/"', s)
    s = re.sub(r'href="([a-z0-9-]+)\.html(#[^"]*)?"', lambda m: f'href="/{m.group(1)}{m.group(2) or ""}"', s)
    return s


# ------------------------------------------------------------------ V1 page → folio page
def build_v1(slug, v):
    t = (V1 / f'{slug}.html').read_text()
    head = t[t.index('<head>') + 6:t.index('</head>')]
    styles = re.findall(r'<style[^>]*>(.*?)</style>', head, re.S)
    head = re.sub(r'<style[^>]*>.*?</style>', '', head, flags=re.S)
    head = re.sub(r'<link rel="(?:stylesheet|preload)"[^>]*>', '', head)
    head = re.sub(r'<script>\(function\(\)\{var d=document.*?</script>', '', head, flags=re.S)
    head = re.sub(r'<meta name="theme-color"[^>]*>\s*', '', head)
    head = head.replace('href="favicon.png"', 'href="/favicon.png"').replace('href="apple-touch-icon.png"', 'href="/apple-touch-icon.png"').replace('href="manifest.webmanifest"', 'href="/manifest.webmanifest"')
    page_css = remap_bg('\n'.join(styles))

    main = t[t.index('<main id="main">') + len('<main id="main">'):t.index('</main>')]
    main = re.sub(r'\s+data-shape[\w-]*="[^"]*"', '', main)
    # top-level sections get their band
    bands = (PAGES[slug][3] or 'p').replace(' ', '')
    out, depth, k, pos, last_band = [], 0, 0, 0, 'p'
    tops = []
    for m in re.finditer(r'<(/?)section\b([^>]*)>', main):
        if m.group(1):
            depth -= 1
            continue
        if depth == 0:
            tops.append(m)
        depth += 1
    vis = [i for i, m in enumerate(tops) if not re.search(r'\shidden(?![\w-])', m.group(2))]
    for idx, m in enumerate(tops):
        b = bands[idx] if idx < len(bands) else 'p'
        later = [i for i in vis if i > idx]
        cls = [BAND[b]]
        if idx == 0:
            cls.append('fp-hero')
        elif b != 'p':
            cls.append('tear-tb' if later else 'tear-t')
        if idx in vis:
            last_band = b
        attrs = m.group(2)
        if 'class="' in attrs:
            attrs = attrs.replace('class="', 'class="' + ' '.join(cls) + ' ', 1)
        else:
            attrs = f' class="{" ".join(cls)}"' + attrs
        out.append(main[pos:m.start()] + f'<section{attrs}>')
        pos = m.end()
        if idx == 0:
            # the tape sits right after the hero; plate-less heroes get a folio plate
            end = balanced(main, m.start(), 'section')
            hero = main[pos:end]
            if slug in PLATES:
                img, cap, hand = PLATES[slug]
                w0 = hero.index('<div class="wrap'); w1 = hero.index('>', w0) + 1
                w2 = balanced(hero, w0, 'div') - len('</div>')
                fig = (f'<figure class="fp-plate" aria-hidden="true"><div class="fp-plate-mat"><img src="/assets/folio/img/folio/{img}" alt="" width="1170" height="832" fetchpriority="high"></div>'
                       f'<figcaption><b>{cap}</b><span>{hand}</span></figcaption></figure>')
                hero = hero[:w1] + '<div class="fp-hero-copy">' + hero[w1:w2] + '</div>' + fig + hero[w2:]
            out.append(hero + '\n' + tape(slug, bool([i for i in vis if i > 0])))
            pos = end
    out.append(main[pos:])
    if slug in TAPE and not [i for i in vis if i > 0]:
        last_band = 'i'
    main = fix_photos(fix_links(''.join(out)))

    post = t[t.index('</footer>') + 9:t.index('<div class="cursor"')]
    post = drop_el(post, '<div class="dock"', 'div')
    post = drop_el(post, '<button class="fab"', 'button')
    post = drop_el(post, '<nav class="mbar"', 'nav')
    post = fix_links(post)

    tail = t[t.index('<div class="cursor"'):]
    inline = [s for s in re.findall(r'<script>(.*?)</script>', tail, re.S) if s.strip()]

    fab = ('<button class="fab chat-fab" type="button" aria-controls="bot" aria-expanded="false" aria-label="Ask Sir Fazil’s Assistant">'
           '<svg><use href="#i-chat"/></svg><span class="fab-t">Ask Sir Fazil’s Assistant</span></button>')
    doc = f'''<!doctype html>
<html lang="en" data-theme="light">
<head>
{head.strip()}
{METAS}
{THEME}
{FONTS}
<style>@layer fpbridge, base;</style>
<link rel="stylesheet" href="/assets/folio/legacy-1.css?v={v['l1']}">
<style>{page_css}</style>
<link rel="stylesheet" href="/assets/folio/legacy-2.css?v={v['l2']}">
<link rel="stylesheet" href="/assets/folio/base.css?v={v['base']}">
<link rel="stylesheet" href="/assets/folio/bridge.css?v={v['bridge']}">
</head>
<body data-page="{slug}" class="fp fp-{slug}">
<a class="skip" href="#main">Skip to content</a>
{sprite()}
{header(slug, True)}
{menu(slug)}
<main id="main">
{main.strip()}
</main>
{footer(last_band == 'p')}
{dock(slug)}
{fab}
{post.strip()}
<script src="/config.js?v=5"></script>
<script src="/assets/folio/mfm.js?v={v['mfm']}"></script>
<script src="/assets/folio/core.js?v={v['core']}"></script>
<script src="/assets/folio/shell.js?v={v['shell']}"></script>
{''.join('<script>' + s + '</script>' for s in inline)}
</body>
</html>
'''
    (ROOT / f'{slug}.html').write_text(doc)
    return len(doc)


# ------------------------------------------------------------------ home
def build_home(v):
    s = R('index.html')
    s = s.replace('<meta name="robots" content="noindex, follow">\n', '')
    s = re.sub(r'<title>(.*?) · V5</title>', r'<title>\1</title>', s)
    s = s.replace("<script>try{var t=localStorage.getItem('mfmTheme5');if(t)document.documentElement.dataset.theme=t;}catch(e){}</script>", THEME)
    s = s.replace('<style>\n{{CSS}}\n</style>', f'<link rel="stylesheet" href="/assets/folio/base.css?v={v["base"]}">\n<link rel="stylesheet" href="/assets/folio/home.css?v={v["home"]}">')
    # one shell for every page
    i = s.index('<svg width="0" height="0"'); j = s.index('</svg>', i) + 6
    s = s[:i] + sprite() + s[j:]
    i = s.index('<header class="top"'); j = s.index('<main id="main">')
    s = s[:i] + header('index', False) + '\n\n' + menu('index') + '\n\n' + s[j:]
    i = s.index('<footer class="foot'); j = s.index('</footer>') + 9
    s = s[:i] + footer(False) + s[j:]
    i = s.index('<!-- bottom dock'); j = s.index('</nav>', i) + 6
    s = s[:i] + dock('index') + s[j:]
    s = s.replace('<script>\n{{DATA}}\n</script>', f'<script src="/assets/folio/home-data.js?v={v["data"]}"></script>')
    s = s.replace('<script>\n{{JS}}\n</script>', f'<script src="/assets/folio/shell.js?v={v["shell"]}"></script>\n<script src="/assets/folio/home.js?v={v["homejs"]}"></script>')
    s = s.replace('<script type="module">\n{{MOSQUE}}\n</script>', f'<script type="module" src="/assets/folio/mosque3d.js?v={v["mosque"]}"></script>')
    s = s.replace('{{NEXLYR}}', '')
    # the home is the front page of a multi-page site: each section opens its full page
    s = s.replace('<a class="btn btn--line" href="#lab">Open the Islamiyat Lab</a>', '<a class="btn btn--line" href="/lab">Open the Islamiyat Lab</a>')
    s = s.replace('id="contact"', 'id="register"').replace('href="#contact"', 'href="#register"')
    MORE = {'about': ('/about', 'His full profile'), 'courses': ('/courses', 'Both papers in full'), 'timeline': ('/syllabus', 'Open the syllabus tracker'),
            'lab': ('/lab', 'Open the full Islamiyat Lab'), 'faq': ('/contact', 'Enrolment and every question'), 'folio': ('/syllabus', 'Every topic, plate by plate'),
            'notes': ('/past-papers', 'Go to past papers')}
    for sid, (href, label) in MORE.items():
        m = re.search(r'<section class="[^"]*" id="' + sid + r'"', s)
        if not m:
            continue
        h = s.index('</h2>', m.end()) + 5
        s = s[:h] + f'<a class="more-link" href="{href}">{label} <svg class="arr"><use href="#i-arr"/></svg></a>' + s[h:]
    left = re.findall(r'\{\{[A-Z0-9_]+\}\}', s)
    assert not left, f'unfilled {left}'
    (ROOT / 'index.html').write_text(s)
    return len(s)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'base.css').write_text(R('base.css'))
    (OUT / 'home.css').write_text(R('home.css'))
    br = boost(R('bridge.css'))
    # V1 wraps mfm-1.css and each page's own CSS in @layer base, and !important inside a layer beats
    # unlayered !important. So the bridge is written twice: in a layer ordered before base (its
    # !important rules win) and unlayered (its normal rules win).
    (OUT / 'bridge.css').write_text(bridge_tokens() + br + '\n@layer fpbridge{\n' + br + '\n}\n')
    (OUT / 'shell.js').write_text(R('shell.js'))
    (OUT / 'home.js').write_text(R('home.js'))
    (OUT / 'home-data.js').write_text(R('data.js'))
    (OUT / 'mosque3d.js').write_text(R('mosque3d.js'))
    (OUT / 'core.js').write_text(R('core.js'))
    (OUT / 'mfm.js').write_text(R('mfm.js'))
    legacy_css()
    v = {'l1': ver('legacy-1.css'), 'l2': ver('legacy-2.css'), 'base': ver('base.css'), 'bridge': ver('bridge.css'), 'home': ver('home.css'),
         'core': ver('core.js'), 'mfm': ver('mfm.js'), 'shell': ver('shell.js'), 'homejs': ver('home.js'), 'data': ver('home-data.js'), 'mosque': ver('mosque3d.js')}
    print('index.html', build_home(v) // 1024, 'KB')
    for slug in PAGES:
        if slug == 'index':
            continue
        print(f'{slug}.html', build_v1(slug, v) // 1024, 'KB')
    for n in ('legacy-1.css', 'legacy-2.css', 'base.css', 'bridge.css'):
        print(n, (OUT / n).stat().st_size // 1024, 'KB')


if __name__ == '__main__':
    main()
