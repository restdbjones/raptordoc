/*
* Codehooks (c) API docs template
* An API docs web site with dynamic content
*/
import { app, Datastore, filestore } from 'codehooks-js'
import handlebars from 'handlebars';
import { URL } from 'url';
import fetch from 'node-fetch';
import layouts from 'handlebars-layouts';
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
    loadBigBrandsCached,
    parseMarkdown
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
    res.send(await renderPage('docpage', { sidebars: sidebars, props, title: settings.title, html, baseUrl: settings.baseUrl, cacheBreaker }));
});

// get a file text content
app.get('/docs/*', async (req, res) => {
    try {
        console.log('docs', req.apiPath);
        const file = await filestore.readFile(req.apiPath, { source: true });
        const { html, props } = parseMarkdown(file);
        res.send(await renderPage('docpage', { sidebars: sidebars, props, title: settings.title, html, baseUrl: settings.baseUrl, cacheBreaker }));
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