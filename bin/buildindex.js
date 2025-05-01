const lunr = require('lunr'),
    fs = require('fs');

/*
* Build the lunr index
* Read the docs folder recursively and build a lunr index. 
* Add each file to the index and to a kev-val store where the key is the file path and the value is the file content.
*/

// Read and parse the JSON file
const documents = JSON.parse(fs.readFileSync('build/database-listings.json', 'utf8'))
const showHitsData = {}

const idx = lunr(function () {
     
    this.ref('_id')
    this.field('title')
    this.field('content')
    this.field('ingress')
    this.field('category')
    this.field('siteUrl')    
    this.field('companyName')
    this.field('details', {
        extractor: doc => doc.details?.map(detail => `${detail.label} ${detail.value}`).join(' ')
    })

    

    documents.forEach(function (doc) {        
        this.add(doc)
        showHitsData[doc._id] = {
            title: doc.title,
            siteUrl: doc.siteUrl,
            altImageUrl: doc.altImageUrl,
            content: doc.content,
            category: doc.category,
            categorySlug: doc.categorySlug,
            slug: doc.slug,
            companyName: doc.companyName,
            ingress: doc.ingress,
            details: doc.details
        }
    }, this)
})

const serialized = JSON.stringify(idx)
fs.writeFileSync('src/web/js/lunr-index.json', serialized)
fs.writeFileSync('src/web/js/show-hits-data.json', JSON.stringify(showHitsData))