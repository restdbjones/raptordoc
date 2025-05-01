/*
* Codehooks (c) API docs template
* An API docs web site with dynamic content
*/
import { app, Datastore, filestore } from 'codehooks-js'
import handlebars from 'handlebars';
import { URL } from 'url';
import fetch from 'node-fetch';
import layouts from 'handlebars-layouts';
import about from './web/templates/about.hbs';
import layout from './web/templates/layout.hbs';
import docpage from './web/templates/docpage.hbs';
import {
    loadDirectoriesCached,
    loadTopFeaturesCached,
    loadAllCategoriesCached,
    loadCategoryFeaturesCached,
    loadListingById,
    writeSitemapToResponse,
    setCacheHeaders,
    loadBigBrandsCached
} from './helpers.js';
import settings from '../raptodoc.config.js';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';
//import sidebars from '../sidebars.js';
//const matter = require('gray-matter');
import { Marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

console.log('Worker node active for the first time');

import sidebarsYaml from '../sidebars.yaml';
const sidebars = yaml.load(sidebarsYaml);

// Define the page templates
const templates = {
    about: handlebars.compile(about),
    layout: handlebars.compile(layout),
    docpage: handlebars.compile(docpage),
}

const bigBrandsArray = settings.brands;


// Render the page
const renderPage = async (page, data) => {
    /*const db = await Datastore.open();
    const cache = await db.get(`pagecache-${page}`);
    if (cache) {
        console.log(`Cache hit for ${page}`);
        return cache;
    }*/
    const content = templates[page](data);
    //await db.set(`pagecache-${page}`, content, {ttl: 1000*60*60});
    return content;
}

// Setting up the page views and layout template
handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('layout', layout);

// cache breaker variable
let cacheBreaker = process.env.CACHE_BREAKER || '0';

// Create a new renderer instance
const renderer = {};
    
// Configure marked to use highlight.js

const marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
  );

// Override renderer methods
renderer.heading = function({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/-+$/, '');

    return `
            <h${depth}>
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${depth}>`;
};
/*
renderer.heading = function({text, depth, tokens}) {
    console.log('heading', arguments);
    const sizes = {
        1: 'text-4xl font-bold',
        2: 'text-3xl font-bold',
        3: 'text-2xl font-bold',
        4: 'text-xl font-bold',
        5: 'text-lg font-bold',
        6: 'text-base font-bold'
    };
    return `<h${depth} class="${sizes[depth]} mb-4">${text}</h${depth}>`;
};

renderer.paragraph = function({text}) {
    console.log('paragraph', arguments);
    return `<p class="mb-4">${text}</p>`;
};

renderer.code = function({text, lang}) {        
    console.log('code', arguments);
    return `<div class="mockup-code w-full"><pre data-prefix="$"><code>${text}</code></pre></div>`;
};


renderer.list = function({body, ordered, items}) {
    console.log('list', arguments);
    const type = ordered ? 'ol' : 'ul';
    const classes = ordered ? 'list-decimal list-inside' : 'list-disc list-inside';
    const listItems = items.map(item => `<li class="mb-1">${item.text}</li>`).join('');
    return `<${type} class="${classes} mb-4">${listItems}</${type}>`;
};

renderer.blockquote = function({quote}) {
    console.log('blockquote', arguments);
    return `<blockquote class="border-l-4 border-base-300 pl-4 my-4 italic">${quote}</blockquote>`;
};

renderer.table = function({header, body}) {
    console.log('table', arguments);
    return `<div class="overflow-x-auto"><table class="table w-full my-4"><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
};

renderer.tablerow = function({content}) {
    console.log('tablerow', arguments);
    return `<tr class="hover:bg-base-200">${content}</tr>`;
};

renderer.tablecell = function({content, flags}) {
    console.log('tablecell', arguments);
    const type = flags.header ? 'th' : 'td';
    return `<${type} class="px-4 py-2">${content}</${type}>`;
};
*/
/*
// Inline-level renderer methods
renderer.strong = function(token) {
    console.log('strong', token);
    return `<strong class="font-bold">${token.text}</strong>`;
};

renderer.em = function(token) {
    console.log('em', token);
    return `<em class="italic">${token.text}</em>`;
};

renderer.codespan = function(token) {
    console.log('codespan', token);
    return `<code class="bg-base-300 px-1 py-0.5 rounded">${token.text}</code>`;
};

renderer.br = function(token) {
    console.log('br', token);
    return '<br>';
};

renderer.del = function(token) {
    console.log('del', token);
    return `<del class="line-through">${token.text}</del>`;
};

renderer.link = function(token) {
    console.log('link', token);
    const titleAttr = token.title ? ` title="${token.title}"` : '';
    return `<a href="${token.href}"${titleAttr} class="link link-primary">${token.text}</a>`;
};
*/
renderer.image = function(token) {
    console.log('image', token);
    const titleAttr = token.title ? ` title="${token.title}"` : '';
    return `<img src="${token.href}" alt="${token.text}"${titleAttr} class="max-w-full h-auto">`;
};

/*
renderer.text = function(token) {
    console.log('text', token);
     if (text.startsWith(':::tip')) {
         text = '<div class="alert alert-info mt-6"><div>' + 
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>' +
            '</svg><span>' + text.substring(6) + '</span>';
    }
    if (text.endsWith(':::')) {
        text = '</div></div>';
    }
    return token.text;
}; 
*/

// Set marked options
marked.use({ renderer });

function parseMarkdown(markdownContent) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?/;
    const match = frontmatterRegex.exec(markdownContent);

    let props = {};
    let markdownBody = markdownContent;

    if (match) {
        const yamlRaw = match[1];
        props = yaml.load(yamlRaw) || {};
        markdownBody = markdownContent.slice(match[0].length);
    }
    
    // Parse the markdown content
    const htmlContent = marked.parse(markdownBody);
    const compiledBody = handlebars.compile(htmlContent);
    const mappedProps = {};
    for (const [key, value] of Object.entries(props)) {
        mappedProps[key] = typeof value === 'string' ? marked.parseInline(value) : value;
    }
    const html = compiledBody({...mappedProps, settings});
    console.log('props', mappedProps);
    return {
        props,
        html: html
    };
}

// load static images for markdown
app.static({ route: "/images", directory: "/docs/img", notFound: "/404.html" }, (req, res, next) => {
    console.log('static images', req);
    setCacheHeaders(res);
    next();
})

// render the index page
app.get('/', async (req, res) => {
    console.log('docs', req.apiPath);
    const file = await filestore.readFile('/docs/index.md', { source: true });
    const { html, props } = parseMarkdown(file);
    res.send(await renderPage('docpage', { sidebars: sidebars, title: settings.title, html, baseUrl: settings.baseUrl, cacheBreaker }));
});

// get a file text content
app.get('/docs/*', async (req, res) => {
    try {
        console.log('docs', req.apiPath);
        const file = await filestore.readFile(req.apiPath, { source: true });
        const { html, props } = parseMarkdown(file);
        res.send(await renderPage('docpage', { sidebars: sidebars, title: settings.title, html, baseUrl: settings.baseUrl, cacheBreaker }));
    } catch (error) {
        console.error(error);
        res.status(404).end('No file here')
    }
})

// Generate sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
    await writeSitemapToResponse(res, req.headers.host);
});


// load contact
app.get('/contact', async (req, res) => {
    console.log('contact');
    const directories = await loadDirectoriesCached();
    res.send(await renderPage('contact', { directories, title: settings.title, baseUrl: settings.baseUrl, cacheBreaker }));
});

// load about
app.get('/about', async (req, res) => {
    console.log('about');
    const directories = await loadDirectoriesCached();
    res.send(await renderPage('about', { sidebars, title: settings.title, baseUrl: settings.baseUrl, cacheBreaker }));
});


// Define the authentication middleware for open pages
app.auth('/*', (req, res, next) => {
    if (req.method === 'GET') {
        console.log('auth OK', req.originalUrl);
        next()
    } else {
        console.log('auth NOT OK', req.originalUrl);
        res.status(401).end('Unauthorized');
    }

});

// load static files (client cache)
app.static({ route: "/", directory: "/src/web", notFound: "/404.html" }, (_, res, next) => {
    setCacheHeaders(res);
    next();
})


// bind to serverless runtime
export default app.init(async () => {
    console.log('app.init');
    const db = await Datastore.open();
    // create index for slug
    db.createIndex('listings', ['slug']);
});