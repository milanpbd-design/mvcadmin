/**
 * Migration Script: Split data.js into separate JSON files
 * 
 * This script converts the monolithic src/data.js file into
 * separate JSON files in public/content/ for static hosting.
 */

const fs = require('fs');
const path = require('path');

// Import the default data
const defaultData = require('../src/data.js').default;

const contentDir = path.join(__dirname, '../public/content');

// Ensure content directory exists
if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
}

// Define how to split the data
const contentFiles = {
    'articles.json': defaultData.articles || [],
    'research.json': defaultData.research || [],
    'experts.json': defaultData.experts || [],
    'categories.json': defaultData.categories || [],
    'media.json': defaultData.media || [],
    'slides.json': defaultData.slides || [],
    'users.json': defaultData.users || [],
    'comments.json': defaultData.comments || [],

    'site-config.json': {
        site: defaultData.site,
        adminPassword: defaultData.adminPassword,
        stats: defaultData.stats,
        navigation: defaultData.navigation,
        newsletter: defaultData.newsletter,
        footer: defaultData.footer,
        theme: defaultData.theme,
        settings: defaultData.settings,
        integrations: defaultData.integrations,
        security: defaultData.security,
        performance: defaultData.performance,
        homeLayout: defaultData.homeLayout,
        tags: defaultData.tags,
        locales: defaultData.locales,
        defaultLocale: defaultData.defaultLocale,
        translations: defaultData.translations,
        versions: defaultData.versions,
        logs: defaultData.logs,
    }
};

// Write each file
console.log('🚀 Starting migration...\n');

let successCount = 0;
let errorCount = 0;

Object.entries(contentFiles).forEach(([filename, content]) => {
    try {
        const filepath = path.join(contentDir, filename);
        fs.writeFileSync(
            filepath,
            JSON.stringify(content, null, 2),
            'utf8'
        );
        console.log(`✅ Created ${filename} (${JSON.stringify(content).length} bytes)`);
        successCount++;
    } catch (error) {
        console.error(`❌ Failed to create ${filename}:`, error.message);
        errorCount++;
    }
});

console.log(`\n📊 Migration Summary:`);
console.log(`   ✅ Success: ${successCount} files`);
console.log(`   ❌ Errors: ${errorCount} files`);
console.log(`\n📁 Content files created in: ${contentDir}`);

if (errorCount === 0) {
    console.log('\n🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Review the JSON files in public/content/');
    console.log('2. Update SiteDataContext.jsx to fetch from these files');
    console.log('3. Test your frontend with: npm start');
} else {
    console.log('\n⚠️  Migration completed with errors. Please review above.');
    process.exit(1);
}
