import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const base = (process.env.KB_PUBLIC_URL || 'https://ivanndlezz.github.io/kol-basilea-lectura/').replace(/\/?$/, '/');
const site = 'Kol Basilea Lectura';
const escape = s => String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const titleCase = s => s.replace(/-/g,' ').replace(/\b\p{L}/gu, c => c.toUpperCase());
const read = p => fs.readFileSync(p,'utf8');
const files = [];
function walk(dir) { for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(entry.name==='index.html')files.push(p)} }
walk(root);
let count=0;
for(const file of files) {
  let html=read(file);
  if(!/<head\b/i.test(html)) continue;
  const rel=path.relative(root,path.dirname(file)).split(path.sep).join('/');
  const segments=rel ? rel.split('/') : [];
  const slug=segments.at(-1) || '';
  const isHome=!rel;
  const isStory=slug.startsWith('relato-');
  const isHistory=segments[0]==='history';
  const pageTitle=isHome?'Lee la Biblia a tu ritmo':rel==='history/biblia'?'Historia de la Biblia':isStory?'Relato bíblico: '+titleCase(slug.replace(/^relato-/,'')):titleCase(slug);
  const fullTitle=isHome?'Kol Basilea Lectura | Lee la Biblia a tu ritmo':pageTitle+' | '+site;
  const description=isHome?'Lee los 66 libros de la Biblia a tu ritmo, sigue tu progreso y descubre historias, personajes y contexto histórico de las Escrituras.':isStory?'Explora este relato bíblico en su contexto histórico y descubre sus personajes y pasajes relacionados en Kol Basilea Lectura.':isHistory?'Explora '+pageTitle.toLowerCase()+' con cronologías, historias y contexto bíblico en Kol Basilea Lectura.':'Explora la Biblia, sus libros, capítulos e historias en Kol Basilea Lectura.';
  const url=base+(rel?rel+'/':'');
  const imageSlug=isStory?slug+'.webp':'';
  const localImage=imageSlug&&fs.existsSync(path.join(root,'assets/images/history',imageSlug))?'assets/images/history/'+imageSlug:'assets/images/atlas/eras-y-epocas.PNG';
  const image=new URL(localImage,base).href;
  const structured={'@context':'https://schema.org','@type':isHome?'WebSite':isStory?'Article':isHistory?'CollectionPage':'WebPage',name:pageTitle,headline:isStory?pageTitle:undefined,description,inLanguage:'es-MX',url,image, publisher:{'@type':'Organization',name:site,url:base}};
  const tags=[
    '<title>'+escape(fullTitle)+'</title>',
    '<meta name="description" content="'+escape(description)+'">',
    '<link rel="canonical" href="'+escape(url)+'">',
    '<meta name="robots" content="index,follow,max-image-preview:large">',
    '<meta property="og:locale" content="es_MX">',
    '<meta property="og:site_name" content="'+site+'">',
    '<meta property="og:type" content="'+(isStory?'article':'website')+'">',
    '<meta property="og:title" content="'+escape(fullTitle)+'">',
    '<meta property="og:description" content="'+escape(description)+'">',
    '<meta property="og:url" content="'+escape(url)+'">',
    '<meta property="og:image" content="'+escape(image)+'">',
    '<meta property="og:image:alt" content="'+escape(pageTitle)+'">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="'+escape(fullTitle)+'">',
    '<meta name="twitter:description" content="'+escape(description)+'">',
    '<meta name="twitter:image" content="'+escape(image)+'">',
    '<script type="application/ld+json">'+JSON.stringify(structured).replace(/</g,'\\u003c')+'</script>'
  ].join('\n');
  html=html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi,'').replace(/<meta\s+name=["']description["'][^>]*>/gi,'').replace(/<\/head>/i,tags+'\n</head>');
  fs.writeFileSync(file,html);
  count++;
}
const urls=files.map(file=>{const rel=path.relative(root,path.dirname(file)).split(path.sep).join('/');return base+(rel?rel+'/':'')}).sort();
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(url=>'  <url><loc>'+escape(url)+'</loc></url>').join('\n')+'\n</urlset>\n');
fs.writeFileSync(path.join(root,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+new URL('sitemap.xml',base).href+'\n');
console.log('SEO generated for '+count+' HTML pages; '+urls.length+' sitemap URLs.');
