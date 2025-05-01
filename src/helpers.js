import { Datastore } from 'codehooks-js'
import handlebars from 'handlebars';
import yaml from 'js-yaml';
import { Marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import settings from '../raptodoc.config.js';
const CACHE_ON = true;
const ONE_HOUR = 1000*60*60;
const ONE_MONTH = 1000*60*60*24*30;

// Cache helper
async function getCached(key, loader, ttl = ONE_HOUR) {
    if (!CACHE_ON) return await loader();
    const db = await Datastore.open();
    const cached = await db.get(`cache-${key}`, {keyspace: 'cache'});
    
    if (cached) {
        console.log(`Cache hit for db ${key}`);
        return JSON.parse(cached);
    }

    const data = await loader();
    await db.set(`cache-${key}`, JSON.stringify(data), {ttl: ttl, keyspace: 'cache'});
    return data;
}

// Data loaders
async function loadTopFeatures() {
    const db = await Datastore.open();  
    return db.getMany('listings', { topFeature: true }).toArray();
}

async function loadCategoryFeatures(categorySlug) {
    const db = await Datastore.open();
    return db.getMany('listings', { categorySlug }).toArray();
}

async function loadListingById(slug) {
    /*return new Promise(async (resolve, reject) => {
        const db = await Datastore.open();
        console.log('loadListingById', slug);
        const listing = await db.getMany('listings', {slug}, {limit: 1}).toArray();
        if (listing.length > 0) {
            resolve(listing[0]);
        } else {
            reject(new Error('Listing not found'));
        }
    });*/
    const db = await Datastore.open();
    return db.getOne('listings', {slug});
}

async function loadDirectories() {
    const db = await Datastore.open();
    const cursor = db.getMany('listings', {}, {
        hints: { $fields: {directory: 1, category: 1, categorySlug: 1} }
    });
    
    const directories = {};
    let totalCount = 0;
    
    await cursor.forEach((item) => {
        if (!directories[item.categorySlug]) {
            directories[item.categorySlug] = {name: item.category, count: 0, categorySlug: item.categorySlug};
        }
        directories[item.categorySlug].name = item.category;
        directories[item.categorySlug].count++;
        totalCount++;
    });
    
    directories['all'] = {name: 'All', count: totalCount, categorySlug: 'all'};
    
    return Object.values(directories).sort((a, b) => {
        if (a.categorySlug === 'all') return -1;
        if (b.categorySlug === 'all') return 1;
        return a.name.localeCompare(b.name);
    });
}

async function loadAllCategories() {
    const db = await Datastore.open();    
    const result = await db.getMany('listings', {}).toArray();
    return result.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});
}

async function loadBigBrands(brandsArray) {
    const db = await Datastore.open();
    const result = await db.getMany('listings', {companyName: {$in: brandsArray}}).toArray();
    // group by companyName
    return result.reduce((acc, item) => {
        if (!acc[item.companyName]) {
            acc[item.companyName] = {
                name: item.companyName,
                products: []
            };
        }
        acc[item.companyName].products.push(item);
        return acc;
    }, {});
}

// Cached versions
const loadDirectoriesCached = () => getCached('directories', loadDirectories);
const loadTopFeaturesCached = () => getCached('topFeatures', loadTopFeatures);
const loadAllCategoriesCached = () => getCached('allCategories', loadAllCategories);
const loadCategoryFeaturesCached = (slug) => getCached(`categoryFeatures-${slug}`, () => loadCategoryFeatures(slug));
const loadListingByIdCached = (slug) => getCached(`listing-${slug}`, () => loadListingById(slug));
const loadBigBrandsCached = (brandsArray) => getCached(`bigBrands-${brandsArray.join(',')}`, () => loadBigBrands(brandsArray));
// Generate sitemap XML directly to response
async function writeSitemapToResponse(res, host) {
    const db = await Datastore.open();
    const sitename = `https://${host}`;
    const listings = db.getMany('listings');
    
    res.setHeader('Content-Type', 'application/xml');
    
    res.write('<?xml version="1.0" encoding="UTF-8"?>\n');
    res.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');
    
    // Add root URL
    res.write(`  <url>
    <loc>${sitename}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`);
    
    // Add all categories page
    res.write(`  <url>
    <loc>${sitename}/category/all</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>\n`);
    
    // Add all directory entries
    await listings.forEach((listing) => {
        res.write(`  <url>
    <loc>${sitename}/listing/${listing.categorySlug}/${listing.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`);
    });
    
    res.write('</urlset>');
    res.end();
}


// Register the equals Handlebarshelper
handlebars.registerHelper('eq', function(a, b, options) {
    // Get the optional ignoreCase parameter, defaults to false
    const ignoreCase = options.hash.ignoreCase || false;
    
    if (ignoreCase && typeof a === 'string' && typeof b === 'string') {
        return a.toLowerCase() === b.toLowerCase();
    }
    
    return a === b;
});

// Helpers
handlebars.registerHelper('isArray', function(value, options) {
    if (Array.isArray(value)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  
  handlebars.registerHelper('isObject', function(value, options) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  
  // Register partial
  
  handlebars.registerPartial('menuNode', `
  <ul>
    {{#each this}}
      <li>        
        {{#isObject this}}
          {{#if this.items}}
            <details {{#if this.open}}open{{/if}}>
              <summary>{{this.title}}</summary>
              {{> menuNode this.items}}
            </details>
          {{else}}
              {{#if this.url}}
                <a href="{{this.url}}">
                  {{#if this.icon}}{{this.icon}} {{/if}}{{this.title}}
                </a>
              {{else}}
                <a href="/docs/{{this.document}}">
                  {{#if this.icon}}{{this.icon}} {{/if}}{{this.title}}
                </a>
              {{/if}}
          {{/if}}
        {{else}}
          <a href="/docs/{{this}}">
            {{this}}
          </a>
        {{/isObject}}
      </li>
    {{/each}}
  </ul>
  `);

  handlebars.registerHelper('myfunc', (value, options)=>{
    return new handlebars.SafeString('<p>This is a dynamic function, you passed in: ' + value + '</p>');
  });

const setCacheHeaders = (res) => {
    console.log('If you see this, the client cache is invalidated or called for the first time');        
    res.set('Cache-Control', `public, max-age=2592000, s-maxage=2592000`);
    res.setHeader("Expires", new Date(Date.now() + ONE_MONTH).toUTCString());
    //res.set('Vary', '*');
    res.removeHeader('Pragma');
}

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

renderer.image = function(token) {
    console.log('image', token);
    const titleAttr = token.title ? ` title="${token.title}"` : '';
    return `<img src="${token.href}" alt="${token.text}"${titleAttr} class="max-w-full h-auto">`;
};

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
    
    const compiledBody = props.handlebars ? handlebars.compile(markdownBody) : markdownBody;
    const mappedProps = {};
    for (const [key, value] of Object.entries(props)) {
        mappedProps[key] = typeof value === 'string' ? marked.parseInline(value) : value;
    }
    const md = props.handlebars ? compiledBody({...mappedProps, settings}) : compiledBody;
    const htmlContent = marked.parse(md);
    console.log('props', mappedProps);
    return {
        props,
        html: htmlContent
    };
}

// Export the new function along with existing exports
export { setCacheHeaders, writeSitemapToResponse, loadDirectoriesCached, loadTopFeaturesCached, loadAllCategoriesCached, loadCategoryFeaturesCached, loadListingByIdCached, loadListingById, loadBigBrandsCached, parseMarkdown }; 