from playwright.sync_api import sync_playwright
import json
res = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    for name in ['bootstrap','tailwind']:
        r = {}
        ctx = b.new_context(viewport={'width':1280,'height':900}, reduced_motion='reduce')  # анимацийг түр унтрааж харьцуулна
        pg = ctx.new_page()
        errs=[]; failed=[]
        pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('requestfailed', lambda q: failed.append(q.url))
        pg.goto(f'http://localhost:8099/{name}/index.html', wait_until='networkidle')
        attr = 'data-bs-theme' if name=='bootstrap' else 'data-theme'
        pg.screenshot(path=f'/tmp/{name}-light.png', full_page=True)
        # Grid багана
        cols = lambda sel: pg.evaluate("s=>{const t=[...document.querySelectorAll(s)].map(i=>Math.round(i.getBoundingClientRect().top+scrollY));return t.filter(x=>Math.abs(x-t[0])<3).length}", sel)
        r['photo_cols_1280'] = cols('#gallery img')
        r['menu_cols_1280'] = cols('#menu article')
        r['sidebar_beside_main'] = pg.evaluate("()=>{const m=document.querySelector('main').getBoundingClientRect(),a=document.querySelector('aside').getBoundingClientRect();return a.left>m.right-5}")
        # Dark mode
        pg.click('#theme-btn'); pg.wait_for_timeout(200)
        r['theme_after_click'] = pg.get_attribute('html', attr)
        r['body_bg_dark'] = pg.evaluate("getComputedStyle(document.body).backgroundColor")
        r['btn_text'] = pg.inner_text('#theme-btn')
        pg.screenshot(path=f'/tmp/{name}-dark.png', full_page=True)
        pg.reload(wait_until='networkidle')
        r['theme_persisted'] = pg.get_attribute('html', attr)
        pg.click('#theme-btn'); pg.wait_for_timeout(200)
        r['body_bg_light'] = pg.evaluate("getComputedStyle(document.body).backgroundColor")
        # Брэнд товч
        pg.mouse.move(5,5); pg.wait_for_timeout(600)
        r['brand_btn_bg'] = pg.evaluate("getComputedStyle(document.querySelector('#theme-btn')).backgroundColor")
        # Flip card: hover
        card = pg.locator('#menu article').first
        card.scroll_into_view_if_needed()
        inner = card.locator('.flip-inner')
        mat = lambda: pg.evaluate("e=>getComputedStyle(e).transform", inner.element_handle())
        r['flip_idle'] = mat()
        card.hover(); pg.wait_for_timeout(1000)
        r['flip_hover'] = mat()
        pg.mouse.move(5,5); pg.wait_for_timeout(1000)
        card.locator('.flip-btn').click(); pg.mouse.move(5,5); pg.wait_for_timeout(1000)
        r['flip_clicked'] = mat()
        r['flip_aria'] = card.locator('.flip-btn').get_attribute('aria-pressed')
        card.locator('.flip-btn').hover(); pg.wait_for_timeout(1000)
        r['flip_clicked_hover'] = mat()
        # Form
        pg.locator('#feedback').scroll_into_view_if_needed()
        pg.click('#feedback-form button[type=submit]'); pg.wait_for_timeout(200)
        sel = '.invalid-feedback' if name=='bootstrap' else '#feedback-form p'
        r['invalid_msgs_visible'] = pg.evaluate("s=>[...document.querySelectorAll(s)].filter(e=>getComputedStyle(e).display!=='none').length", sel)
        pg.screenshot(path=f'/tmp/{name}-invalid.png')
        pg.fill('#name','Энхжин'); pg.fill('#email','test@example.com'); pg.fill('#message','Маш сайхан кофе байна'); pg.check('#agree')
        pg.click('#feedback-form button[type=submit]'); pg.wait_for_timeout(200)
        r['form_ok_visible'] = pg.evaluate("getComputedStyle(document.getElementById('form-ok')).display!=='none'")
        r['errors'] = errs; r['failed'] = [u for u in failed if 'about:blank' not in u]
        ctx.close()
        # Tablet 800px
        ctx = b.new_context(viewport={'width':800,'height':900}, reduced_motion='reduce'); pg = ctx.new_page()
        pg.goto(f'http://localhost:8099/{name}/index.html', wait_until='networkidle')
        r['photo_cols_800'] = pg.evaluate("()=>{const t=[...document.querySelectorAll('#gallery img')].map(i=>Math.round(i.getBoundingClientRect().top+scrollY));return t.filter(x=>Math.abs(x-t[0])<3).length}")
        r['tablet_overflow'] = pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
        pg.screenshot(path=f'/tmp/{name}-tablet.png', full_page=True)
        ctx.close()
        # Mobile 375
        ctx = b.new_context(viewport={'width':375,'height':800}, reduced_motion='reduce'); pg = ctx.new_page()
        pg.goto(f'http://localhost:8099/{name}/index.html', wait_until='networkidle')
        r['mobile_overflow'] = pg.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
        r['photo_cols_375'] = pg.evaluate("()=>{const t=[...document.querySelectorAll('#gallery img')].map(i=>Math.round(i.getBoundingClientRect().top+scrollY));return t.filter(x=>Math.abs(x-t[0])<3).length}")
        navvis = lambda: pg.evaluate("()=>{const n=document.getElementById('main-nav');const r=n.getBoundingClientRect();return getComputedStyle(n).display!=='none' && r.height>5}")
        r['mobile_nav_closed_hidden'] = not navvis()
        pg.click('#menu-btn' if name=='tailwind' else '.navbar-toggler'); pg.wait_for_timeout(600)
        r['mobile_nav_open_visible'] = navvis()
        pg.screenshot(path=f'/tmp/{name}-mobile-open.png')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(600)
        r['mobile_nav_escape_closes'] = not navvis()
        pg.click('#menu-btn' if name=='tailwind' else '.navbar-toggler'); pg.wait_for_timeout(600)
        pg.click('#main-nav a[href="#video"]'); pg.wait_for_timeout(800)
        r['mobile_nav_link_closes'] = not navvis()
        ctx.close()
        # No-JS: цэс харагдах ёстой
        ctx = b.new_context(viewport={'width':375,'height':800}, java_script_enabled=False); pg = ctx.new_page()
        pg.goto(f'http://localhost:8099/{name}/index.html')
        r['nojs_nav_visible_mobile'] = pg.evaluate("()=>{const n=document.getElementById('main-nav');return getComputedStyle(n).display!=='none' && n.getBoundingClientRect().height>5}")
        ctx.close()
        res[name]=r
    b.close()
print(json.dumps(res, ensure_ascii=False, indent=1))
