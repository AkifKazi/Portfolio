const fs = require('fs');
const { JSDOM } = require('jsdom');

const files = ['index.html', 'projects.html', 'project-detail.html', 'about.html'];

for (let file of files) {
    let html = fs.readFileSync(file, 'utf8');

    // JS and CSS
    html = html.replace(/\.\/[^/]+_files\/([^"'\s]+)\.css([^"'\s]*)/g, 'css/$1.css$2');
    html = html.replace(/\.\/[^/]+_files\/([^"'\s]+)\.js([^"'\s]*)/g, 'js/$1.js$2');
    // Images
    html = html.replace(/\.\/[^/]+_files\/([^"'\s]+)\.(jpg|jpeg|png|webp|svg|gif)([^"'\s]*)/gi, 'assets/images/$1.$2$3');
    // HTML Fragments
    html = html.replace(/\.\/[^/]+_files\/([^"'\s]+)\.html([^"'\s]*)/gi, 'assets/html/$1.html$2');

    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Remove specific subtrees
    document.querySelectorAll('.lang-switch').forEach(el => el.remove());
    document.querySelectorAll('#drifts').forEach(el => el.remove());
    document.querySelectorAll('iframe[src*="mapbox"]').forEach(el => el.remove());
    document.querySelectorAll('.mapboxgl-map').forEach(el => el.remove());
    document.querySelectorAll('script[src*="mapbox"]').forEach(el => el.remove());
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    document.querySelectorAll('link[rel="manifest"]').forEach(el => el.remove());

    // Additional specific removals for remnants
    document.querySelectorAll('.home-news').forEach(el => el.remove());
    document.querySelectorAll('.home-transmision').forEach(el => el.remove());

    // Attempt removing specific IDs
    let elNews = document.getElementById('últimas-publicaciones');
    if (elNews) elNews.remove();
    let elTrans = document.getElementById('transmisión');
    if (elTrans) elTrans.remove();
    let elRoute = document.getElementById('the-route');
    if (elRoute) elRoute.remove();

    // Mapbox iframes disguised as internal assets
    document.querySelectorAll('iframe[src*="cm3"]').forEach(el => el.remove());
    document.querySelectorAll('a[href*="mapbox.com"]').forEach(el => {
        const p = el.closest('p');
        if (p) p.remove();
        else el.remove();
    });

    // Remove any related blocks labeled "Drifts"
    document.querySelectorAll('.cards-title').forEach(el => {
        if (el.textContent.trim() === 'Drifts') {
            const block = el.closest('.related-block');
            if (block) block.remove();
        }
    });

    // Strip out text
    document.querySelectorAll('.cover-hero__eyebrow').forEach(el => {
        el.textContent = el.textContent.replace(' · drifts', '');
    });

    // Remove exclusion links BEFORE path replacements
    const excludePatterns = ['/news', '/transmission', '/libellus', '/series', 'shop.marconoris', '/search'];

    document.querySelectorAll('a').forEach(el => {
        if (!el.href) return;

        if (el.getAttribute('href').startsWith('#')) return;

        const shouldExclude = excludePatterns.some(p => el.href.includes(p));
        if (shouldExclude) {
            const parentLi = el.parentElement;
            if (parentLi && parentLi.tagName === 'LI') {
                parentLi.remove();
            } else if (parentLi && parentLi.classList.contains('nav-dropdown__menu')) {
                el.remove();
            } else {
                el.remove();
            }
            return;
        }

        try {
            const url = new URL(el.href);
            // Replace marconoris links with local HTML files
            if (url.hostname === 'marconoris.com') {
                if (url.pathname === '/en/' || url.pathname === '/en') {
                    el.href = 'index.html';
                } else if (url.pathname === '/en/projects/' || url.pathname === '/en/projects') {
                    el.href = 'projects.html';
                } else if (url.pathname === '/en/about/' || url.pathname === '/en/about') {
                    el.href = 'about.html';
                } else if (url.pathname.startsWith('/en/')) {
                    el.href = 'project-detail.html';
                }
            }
        } catch (e) { }
    });

    // Write back
    fs.writeFileSync(file, dom.serialize());
    console.log(`Processed ${file}`);
}
