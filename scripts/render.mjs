import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = JSON.parse(await readFile(path.join(root, 'src/content.json'), 'utf8'));
// Remove spacing used to align text in the former fixed-width layout.
for (const page of Object.values(content)) {
  for (const item of Object.values(page.blocks)) {
    item.html = item.html.replaceAll('\u00a0',' ');
    item.paragraphs.forEach(p => {p.html = p.html.replaceAll('\u00a0',' ');});
  }
}
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const block = (page, id) => content[page].blocks[id];
const copy = (page, id) => block(page,id).html;
const text = (page, id) => escape(block(page,id).text);
const originalFigureSizes = {
  'img_comp-lgpjwbzb':[229,240], 'img_comp-lgpjs8og':[287,240],
  'img_comp-lgpjqzch':[304,240], 'img_comp-lgpjt67h':[307,240],
  'img_comp-lhmipe9j':[600,404], 'img_comp-lhmipe9q':[614,483]
};
const image = (page, id, alt, cls='') => {
  const data = content[page].images[id];
  const eager = cls === 'brand-emblem' || id === 'img_comp-lgpmdfdf';
  return `<img src="${data.src}" alt="${escape(alt ?? data.alt)}" class="${cls}" loading="${eager?'eager':'lazy'}" ${id==='img_comp-lgpmdfdf'?'fetchpriority="high"':''} decoding="async">`;
};
const pages = [
  ['home','/','Home'], ['bio-sketch','/bio-sketch','About Prof. S Mishra'],
  ['team-members','/team-members','Team Members'], ['projects','/projects','Projects'],
  ['publications','/publications','Publications'],
  ['professional-activities-1','/professional-activities-1','Professional Activities']
];

function shell(page, main) {
  const title = pages.find(item => item[0] === page)[2];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | Material Dynamics Laboratory</title><meta name="description" content="Material Dynamics Laboratory"><link rel="icon" href="${content.home.images.img_hyio97wf.src}"><link rel="stylesheet" href="/replica.css?v=powr-counter-style-20261013"><script src="/app.js?v=powr-counter-style-20261013" defer></script></head><body data-page="${page}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="masthead container"><a class="brand" href="/">${image('home','img_hyio97wf','IIT Kharagpur emblem','brand-emblem')}<span class="brand-title">Material Dynamics Laboratory</span></a>${image('home','img_comp-lgpmdfdf','Split Hopkinson pressure bar apparatus','header-instrument')}<button class="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="site-navigation"><span class="menu-icon" aria-hidden="true"></span><span>Menu</span></button></div>
  <div class="nav-rule"><nav id="site-navigation" class="site-nav container" aria-label="Main navigation">${pages.map(([key,url,label]) => `<a href="${url}" ${key===page?'aria-current="page"':''}>${label}</a>`).join('')}</nav></div></header>
  <main id="main">${main}</main>
  <footer class="site-footer"><div class="footer-main container"><div class="footer-brand">${image('home','img_hyio97wf','IIT Kharagpur emblem')}<div><strong>Material Dynamics Laboratory</strong><span>Indian Institute of Technology Kharagpur</span></div></div><address>Room No.: 105, Department Main Building, Department of Mining Engineering<br>Indian Institute of Technology Kharagpur<br>West Bengal, India. 721 302</address><div class="footer-contact"><a href="mailto:smishra@mining.iitkgp.ac.in">Email: smishra@mining.iitkgp.ac.in</a><a href="tel:+913222214824">Tel: +91-3222-214824</a><div class="scholar-links"><a href="https://scholar.google.com/citations?user=iOQkbH8AAAAJ&hl=en&oi=ao" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar">${image('home','img_0_comp-kfv5knfb', 'Google Scholar')}</a><a href="https://www.researchgate.net/profile/Sunita_Mishra10" target="_blank" rel="noopener noreferrer" aria-label="ResearchGate">${image('home','img_1_comp-kfv5knfb', 'ResearchGate')}</a><a href="https://www.scopus.com/authid/detail.uri?authorId=58704695800" target="_blank" rel="noopener noreferrer" aria-label="Scopus">${image('home','img_2_comp-kfv5knfb', 'Scopus')}</a></div></div></div><div class="footer-bottom container"><span>Copyrights with Material Dynamics Laboratory, Sunita Mishra</span><span class="visit-counter" title="Local preview: visits counted in this browser, separate from the original POWR total."><span class="visit-digits" data-visit-count aria-label="Local preview visit count"></span><span class="visit-label">Visits</span></span></div></footer>
  <dialog class="image-dialog" aria-label="Research figure"><button class="dialog-close" aria-label="Close figure">×</button><img alt=""></dialog></body></html>`;
}

function figure(id, caption, page='home') {
  const [width,height] = originalFigureSizes[id];
  return `<figure class="research-figure" style="--figure-width:${width}px;--figure-ratio:${width}/${height}"><button class="figure-button" data-image-viewer aria-label="Enlarge ${escape(caption)}">${image(page,id,caption)}</button></figure>`;
}
const embed = (id, title) => `<iframe data-src="https://www.youtube.com/embed/${id}?playsinline=1&amp;rel=0" title="${escape(title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
function homepage() {
  const imageByAlt = alt => image('home',Object.keys(content.home.images).find(key=>content.home.images[key].alt===alt));
  const announcements = [
    ['comp-msn55562',`<div class="slide-video">${embed('KTz2ZUrIkxw','Mechanical and Electrical Systems of Mining Machines')}</div>`,text('home','comp-msn5559t2'),'video-slide'],
    ['comp-mek9j4od',`<div class="award-images">${imageByAlt('Faculty Excellence Award ceremony')}${imageByAlt('Faculty Excellence Award 2025')}</div>`,text('home','comp-mek9t5l3'),'award-slide'],
    ['comp-mek9i0nh','',text('home','comp-mek9pkt9'),'text-slide'],
    ['comp-mc91y9w5','',text('home','comp-mek9p5vs'),'text-slide'],
    ['comp-lzx3qbjt',`<div class="poster-image">${imageByAlt('CRD Seminar Series Poster 2024')}</div>`,'','poster-slide'],
    ['comp-lxk0fc4y',`<div class="slide-video">${embed('WXtuJbEGjbU','Learn all about Mining Engineering from IIT prof')}</div>`,text('home','comp-lxk1dsxa'),'video-slide'],
    ['comp-ltoovhie',`<div class="slide-video">${embed('unOISha3U9A','Right usage of Mineral Resources')}</div>`,text('home','comp-ltopaexl'),'video-slide']
  ];
  return `<div class="container"><section class="home-introduction"><h2>${text('home','comp-lhmippgq')}</h2></section>
  <section class="research-section"><div class="section-heading"><h2>${text('home','comp-lhp5eoki')}</h2></div><div class="results-grid"><figure class="research-figure testing-video" style="--figure-width:288px;--figure-ratio:288/240"><video src="${content.home.video}" autoplay muted loop playsinline disablepictureinpicture disableremoteplayback preload="metadata" aria-label="Material testing under dynamic loading"></video></figure>${figure('img_comp-lgpjwbzb','Basaltic rock specimen')}${figure('img_comp-lgpjs8og','Incident and transmission waves')}${figure('img_comp-lgpjqzch','Force response over time')}${figure('img_comp-lgpjt67h','Stress–strain response')}</div></section>
  <section class="aeration-section"><div class="aeration-copy"><h2>${text('home','comp-lhmipe9d')}</h2></div><div class="aeration-images">${figure('img_comp-lhmipe9j','Aeration system design')}${figure('img_comp-lhmipe9q','Experimental aeration system')}</div></section>
  <section class="updates-section" aria-label="Laboratory announcements"><div class="slide-controls"><button data-slide-prev aria-label="Previous announcement">←</button><button data-slide-next aria-label="Next announcement">→</button></div><div class="announcement-slides">${announcements.map(([id,media,caption,cls],i)=>`<article id="${id}" class="announcement-slide ${cls}" ${i?'hidden':''}>${media}${caption?`<div class="announcement-copy"><h3>${caption}</h3></div>`:''}</article>`).join('')}</div><div class="slide-bottom"><div class="slide-dots" aria-label="Choose announcement">${announcements.map(([, ,caption],i)=>`<button data-slide-index="${i}" aria-label="${escape(caption || 'Announcement '+(i+1))}" aria-current="${i===0}"></button>`).join('')}</div></div></section></div>`;
}

const pageHeading = title => `<div class="page-heading"><h1>${title}</h1></div>`;
function section(id,title,body,cls='') {return `<section id="${id}" class="content-section ${cls}"><h2>${title}</h2>${body}</section>`;}
function indexedLayout(page, title, sections) {
  return `<div class="container">${pageHeading(title)}<div class="indexed-layout"><aside class="section-index"><nav aria-label="Page sections">${sections.map(([id,title])=>`<a href="#${id}">${title}</a>`).join('')}</nav></aside><div class="page-content">${sections.map(([id,title,body,cls])=>section(id,title,body,cls)).join('')}</div></div></div>`;
}
function biography() {
  return `<div class="container">${pageHeading('About Prof. S Mishra')}<section class="biography-layout"><div class="prose biography-copy">${copy('bio-sketch','comp-lgpjgg8h')}</div><figure class="portrait">${image('bio-sketch','img_comp-lgpjgymu','Prof. Sunita Mishra')}</figure></section><div class="biography-columns">${section('education',text('bio-sketch','hy736r5y'),`<div class="prose">${copy('bio-sketch','hy737jks')}</div>`)}${section('experience',text('bio-sketch','comp-k6b4sg2n'),`<div class="prose">${copy('bio-sketch','comp-k6b4y426')}</div>`)}</div></div>`;
}
function profile(imageId, blockId) {
  const paragraphs = block('team-members',blockId).paragraphs;
  const details = [];
  for (const p of paragraphs.slice(2)) {
    if (!details.length || /^(Joint Supervisor|B\.Tech|M\.Tech|Ph\.?D\.?|Project|Topic|Email)/.test(p.text)) details.push(p.html);
    else details[details.length-1] += ' '+p.html;
  }
  return `<article class="member">${image('team-members',imageId,paragraphs[0].text,'member-portrait')}<div class="member-copy"><h3>${paragraphs[0].html}</h3><p class="member-role">${paragraphs[1].html}</p><div class="member-details">${details.map(p=>`<p>${p}</p>`).join('')}</div></div></article>`;
}
function members() {
  const ids = [['img_comp-l6925cqs','comp-l6925cqx'],['img_comp-l1zy9uah','comp-l1zy9uar'],['img_comp-lzcyduxs','comp-lzcyduxv'],['img_comp-lzcymta2','comp-lzcymta41'],['img_comp-ms9ba294','comp-ms9ba29l'],['img_comp-ms9bz7f5','comp-ms9bz7fb'],['img_comp-mt39a9gc','comp-mt39a9hr'],['img_comp-m17vpq87','comp-m17vpq8h1']];
  let alumni = '';
  for (const p of block('team-members','comp-kg2h78op').paragraphs) {
    if (/^(MS\(R\)|M\.Tech|Dual Degree|B\.Tech|Intern):$/.test(p.text)) alumni += `<h3 class="alumni-heading">${p.html}</h3>`;
    else alumni += `<p class="${/^\d+[.)]/.test(p.text)?'alumni-name':''}">${p.html}</p>`;
  }
  return `<div class="container">${pageHeading('Team Members')}<section class="people-section"><div class="members-grid">${ids.map(pair=>profile(...pair)).join('')}</div></section>${section('past-members',text('team-members','comp-koaij4o4'),`<div class="members-grid">${profile('img_comp-knvreo4d','comp-knvrf7wb')}</div><div class="alumni-list prose">${alumni}</div>`)}</div>`;
}
function citations(page,id) {
  const records = [];
  for (const p of block(page,id).paragraphs) {
    if (/^\d+[.)]/.test(p.text)) records.push([p.html.replace(/\d+[.)]\s*/,'')]);
    else if (records.length) records.at(-1).push(p.html);
  }
  return `<ol class="citations">${records.map(parts=>`<li>${parts.join(' ')}</li>`).join('')}</ol>`;
}
function publications() {
  const sections = [['patents',text('publications','comp-mlv931fy'),citations('publications','comp-mlv92dmi')],['journals',text('publications','hy8mmr5n'),citations('publications','hy8mrop8')],['conferences',text('publications','hy8mnvqy_0'),citations('publications','hyisappx')],['reports',text('publications','comp-ldxexboc'),citations('publications','comp-mlv7xdqb')]];
  return indexedLayout('publications',text('publications','hy8l3b1w'),sections);
}
function projects() {
  const groups = [[],[]];let group = 0;
  for (const p of block('projects','comp-kg2huxdn').paragraphs) {
    if (/^\d+\.\s*Project Title:/.test(p.text)) {
      if (/^1\./.test(p.text) && groups[0].length) group = 1;
      groups[group].push([p]);
    } else if (groups[group].length) groups[group].at(-1).push(p);
  }
  const projectList = records => `<ol class="project-list">${records.map(parts=> {
    let title = parts[0].text.replace(/^\d+\.\s*Project Title:\s*/,'');let details = [];
    for (const p of parts.slice(1)) {
      if (/^(Funding Agency|Amount and Duration|Status):/.test(p.text)) details.push(p.text);
      else if (details.length) details[details.length-1] += ' '+p.text;
      else title += ' '+p.text;
    }
    return `<li><h3>${escape(title)}</h3><dl>${details.map(item=>{const [label,...rest]=item.split(':');return `<div><dt>${escape(label)}</dt><dd>${escape(rest.join(':').trim())}</dd></div>`;}).join('')}</dl></li>`;
  }).join('')}</ol>`;
  return indexedLayout('projects','Projects',[['research-projects',text('projects','comp-kwrzubb1'),projectList(groups[0])],['consultancy-projects',text('projects','comp-kwrzv1yg'),projectList(groups[1])]]);
}
function activities() {
  const p='professional-activities-1';
  const sections = [
    ['teaching','comp-je7ahhs8','comp-je7ai9o1'],['editorial','comp-meka9ot0','comp-mekaa3zc'],
    ['institute','comp-kg2i5rpp','comp-kg2i97jb'],['department','comp-lgpks9ml','comp-lgpkvqtt'],
    ['honours','comp-je79ss1d','comp-je79sxq8'],['talks','comp-je79t6qn','comp-je79u6b4'],
    ['bodies','comp-lzu31nnk','comp-lzu338tl'],['memberships','comp-kf9lw53j','comp-kf9lxu1o']
  ].map(([id,heading,key])=>[id,text(p,heading),`<div class="prose activity-list">${copy(p,key)}</div>`]);
  return indexedLayout(p,'Professional Activities',sections);
}
const renders = {'home':homepage,'bio-sketch':biography,'team-members':members,'projects':projects,'publications':publications,'professional-activities-1':activities};
for (const [page] of pages) {
  const dir = path.join(root,'src/pages',page==='home'?'':page);
  await mkdir(dir,{recursive:true});
  await writeFile(path.join(dir,'index.html'),shell(page,renders[page]()));
}
console.log('Rendered six pages from preserved laboratory content.');
