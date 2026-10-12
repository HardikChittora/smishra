"""Import public reference markup as standalone, locally routed static pages."""
from pathlib import Path
from lxml import html, etree
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse
import hashlib, json, re, subprocess

ROOT = Path(__file__).resolve().parents[1]
REFERENCE = Path('/private/tmp/smishra-reference')
PAGES = ROOT / 'src/pages'
ASSETS = ROOT / 'src/assets'
PAGES.mkdir(parents=True, exist_ok=True)
ASSETS.mkdir(parents=True, exist_ok=True)
downloads = {}

def asset(url):
    if url.startswith('//'): url = 'https:' + url
    suffix = Path(urlparse(url).path).suffix or '.bin'
    name = hashlib.sha256(url.encode()).hexdigest()[:20] + suffix
    downloads[url] = ASSETS / name
    return '/assets/' + name

def text_component(id, text, size=26, italic=False):
    return f'<div id="{id}" class="N8MGzv _v6ohL AWXfZq PO9MfV {id} wixui-rich-text" data-testid="richTextElement"><p class="font_5 wixui-rich-text__text" style="font-size:{size}px;line-height:normal;text-align:center;font-family:Arial,sans-serif;color:#000;font-weight:normal;{"font-style:italic;" if italic else ""}">{text}</p></div>'

def image_component(id, uri, width, height, alt=''):
    src = asset('https://static.wixstatic.com/media/' + uri)
    return f'<div id="{id}" class="W4V2qg {id} wixui-image"><div class="apPOZK"><img src="{src}" alt="{alt}" class="gRkIq0 sFiSiq" width="{width}" height="{height}" style="object-fit:cover"></div></div>'

def video_component(id, youtube, title):
    return f'<div id="{id}" class="VideoPlayer2054936319__root {id} wixui-video-player"><div class="VideoPlayer2054936319__playerContainer"><iframe data-src="https://www.youtube.com/embed/{youtube}?playsinline=1&amp;rel=0" title="{title}" width="100%" height="100%" frameborder="0" allow="autoplay;encrypted-media;picture-in-picture;fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div></div>'

def slide(id, contents):
    return html.fromstring(f'<div id="{id}" class="{id} vSDtlj replica-slide" hidden><div id="bgLayers_{id}" class="QG9w8P axfISv"><div data-testid="colorUnderlay" class="LNYVZi ayCf9D"></div><div class="ROWgFb"></div></div><div class="thDjwm"></div><div data-mesh-id="{id}inlineContent"><div data-mesh-id="{id}inlineContent-gridContainer">{contents}</div></div></div>')

for source in sorted(REFERENCE.glob('*.html')):
    doc = html.fromstring(source.read_text())
    # Retain visual styles and public content; replace platform bootstrapping.
    for e in doc.xpath('//script|//link[@rel="preconnect" or @rel="dns-prefetch" or @rel="preload" or @rel="canonical"]|//meta[@property="og:url"]'):
        e.getparent().remove(e)
    doc.set('lang', 'en')
    doc.xpath('//body')[0].set('style', '--scrollbar-width:15px')
    for e in doc.xpath('//*[@class]'):
        e.set('class', e.get('class').replace('hidden-during-prewarmup', ''))
        if 'wixui-' in e.get('class'): e.set('data-motion-enter','done')
    for a in doc.xpath('//a[@href]'):
        href = a.get('href')
        if href.startswith('https://www.sunitamishra.com'):
            a.set('href', href.removeprefix('https://www.sunitamishra.com') or '/')
        elif href.startswith('./#'): a.set('href', href[1:])
        if a.get('target') == '_blank': a.set('rel','noopener noreferrer')
    for i in doc.xpath('//img[@src]'):
        src = i.get('src')
        if i.get('srcset'):
            src = i.get('srcset').split(', ')[-1].rsplit(' ',1)[0]
            i.attrib.pop('srcset', None)
        if 'blur_2' in src:
            info = json.loads(i.getparent().get('data-image-info'))
            src = 'https://static.wixstatic.com/media/' + info['imageData']['uri']
        if src.startswith('http'): i.set('src', asset(src))
        i.attrib.pop('loading', None)
    for e in doc.xpath('//style|//*[@style]'):
        key = 'style' if e.tag != 'style' else None
        css = e.get(key) if key else e.text
        if not css: continue
        css = re.sub(r'url\([\'\"]?((?:https:)?//[^\)\'\"]+)[\'\"]?\)', lambda m: 'url("'+asset(m.group(1))+'")', css)
        if key: e.set(key, css)
        else: e.text = css
    for e in doc.xpath('//link[@href]'):
        if e.get('href').startswith('https://static.wixstatic.com/'): e.set('href',asset(e.get('href')))
    for iframe in doc.xpath('//iframe[not(@src)]'):
        iframe.getparent().remove(iframe)
    for wrapper in doc.xpath('//wix-video'):
        info = json.loads(wrapper.get('data-video-info'))
        video = wrapper.find('video')
        video.set('src', asset('https://video.wixstatic.com/'+info['qualities'][-1]['url']))
        video.set('autoplay',''); video.set('muted',''); video.set('loop','')
        video.attrib.pop('crossorigin',None)
        video.set('style','width:100%;height:100%;object-fit:cover')
        for poster in wrapper.findall('img'): wrapper.remove(poster)
    if source.stem == 'home':
        container = doc.xpath('//*[@data-testid="slidesWrapper"]')[0]
        first_slide = container.find('div')
        first_slide.set('class',first_slide.get('class')+' replica-slide')
        player = doc.get_element_by_id('comp-msn5dow2')
        player.getparent().replace(player,html.fromstring(video_component('comp-msn5dow2','KTz2ZUrIkxw','Mechanical and Electrical Systems of Mining Machines')))
        container.extend([
            slide('comp-mek9j4od',image_component('comp-mek9s3pr','771376_fe15a56643084674a67a36d70bdd8b56~mv2.jpg',600,450,'Faculty Excellence Award ceremony')+image_component('comp-mek9sfrd','771376_d1aa16a1518240dd8845943afecba41b~mv2.jpg',600,450,'Faculty Excellence Award 2025')+text_component('comp-mek9t5l3','Conferred with Faculty Excellence Award 2025 on the 75th Foundation Day of IIT Kharagpur')),
            slide('comp-mek9i0nh',text_component('comp-mek9pkt9','Dr. Sunita Mishra has joined the Editorial Board of Scientific Reports.',40,True)),
            slide('comp-mc91y9w5',text_component('comp-mek9p5vs','Dr. Sunita Mishra has joined the Editorial Board of International Journal of Rock Mechanics and Mining Sciences',40,True)),
            slide('comp-lzx3qbjt',image_component('comp-m06n43sz','771376_6ab0b6850cbe4fa7a4da2f847ff9a09b~mv2.jpg',415,600,'CRD Seminar Series Poster 2024')),
            slide('comp-lxk0fc4y',video_component('comp-lxk1bdo0','WXtuJbEGjbU','Learn all about Mining Engineering from IIT prof (ft. Prof. Sunita Mishra)')+text_component('comp-lxk1dsxa','Get to Know About Mining Engineering: My Perspective (Courtsey: Prof. Jeevanjyoti Chakraborty, Mechanical Engineering, IIT Kharagpur)',18)),
            slide('comp-ltoovhie',video_component('comp-ltop1125','unOISha3U9A','Right usage of Mineral Resources')+text_component('comp-ltopaexl','Right usage of Mineral Resources in important for development of India || Metro Plus || KalingaTV',18))
        ])
    doc.find('head').append(html.fromstring('<link rel="stylesheet" href="/replica.css">'))
    doc.find('body').append(html.fromstring('<script src="/app.js" defer></script>'))
    # lxml's HTML serializer lowercases SVG attributes; retain case required by SVG.
    result = html.tostring(doc,encoding='unicode',doctype='<!DOCTYPE html>')
    result = result.replace('viewbox=','viewBox=').replace('preserveaspectratio=','preserveAspectRatio=')
    name = 'index.html' if source.stem == 'home' else source.stem + '/index.html'
    output = PAGES / name
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(result)

def download(item):
    url, target = item
    if target.exists() and target.stat().st_size: return
    subprocess.run(['curl','-sSL','--fail','--retry','2',url,'-o',str(target)],check=True)

with ThreadPoolExecutor(max_workers=8) as pool: list(pool.map(download, downloads.items()))
(ROOT/'src/assets-manifest.json').write_text(json.dumps({str(path.name):url for url,path in downloads.items()},indent=2))
print(f'Imported {len(list(PAGES.rglob("index.html")))} pages and {len(downloads)} assets.')
