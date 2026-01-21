const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const BACKUP_DIR = path.join(CONTENT_DIR, 'backups');

// Ensure directories exist
function ensureDirectories() {
    if (!fs.existsSync(CONTENT_DIR)) {
        fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
}

// Load data from a JSON file
function loadData(filename, defaultValue = null) {
    ensureDirectories();
    const filePath = path.join(CONTENT_DIR, filename);

    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error(`[Storage] Error loading ${filename}:`, err.message);
    }

    return defaultValue;
}

// Save data to a JSON file with backup
function saveData(filename, data) {
    ensureDirectories();
    const filePath = path.join(CONTENT_DIR, filename);
    const tempPath = filePath + '.tmp';

    try {
        // Create backup if file exists
        if (fs.existsSync(filePath)) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = path.join(BACKUP_DIR, `${filename}.${timestamp}.bak`);
            fs.copyFileSync(filePath, backupPath);

            // Keep only last 10 backups
            cleanupBackups(filename);
        }

        // Write to temp file first (atomic write)
        fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');

        // Rename temp to actual file
        fs.renameSync(tempPath, filePath);

        return true;
    } catch (err) {
        console.error(`[Storage] Error saving ${filename}:`, err.message);
        // Clean up temp file if it exists
        if (fs.existsSync(tempPath)) {
            try {
                fs.unlinkSync(tempPath);
            } catch { }
        }
        return false;
    }
}

// Cleanup old backups, keep only the last 10
function cleanupBackups(filename) {
    try {
        const backupFiles = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.startsWith(filename + '.'))
            .map(f => ({
                name: f,
                path: path.join(BACKUP_DIR, f),
                time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        // Keep only last 10
        if (backupFiles.length > 10) {
            backupFiles.slice(10).forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch { }
            });
        }
    } catch (err) {
        console.error(`[Storage] Error cleaning backups:`, err.message);
    }
}

// Load all site data
function loadAllData() {
    const data = {
        site: loadData('site.json', null),
        articles: loadData('articles.json', []),
        categories: loadData('categories.json', []),
        experts: loadData('experts.json', []),
        research: loadData('research.json', []),
        slides: loadData('slides.json', []),
        stats: loadData('stats.json', null),
        navigation: loadData('navigation.json', null),
        newsletter: loadData('newsletter.json', null),
        footer: loadData('footer.json', null),
        media: loadData('media.json', []),
        settings: loadData('settings.json', null),
        integrations: loadData('integrations.json', null),
        security: loadData('security.json', null),
        performance: loadData('performance.json', null)
    };

    return data;
}

// Save all site data
function saveAllData(data) {
    const results = {
        site: data.site ? saveData('site.json', data.site) : true,
        articles: data.articles ? saveData('articles.json', data.articles) : true,
        categories: data.categories ? saveData('categories.json', data.categories) : true,
        experts: data.experts ? saveData('experts.json', data.experts) : true,
        research: data.research ? saveData('research.json', data.research) : true,
        slides: data.slides ? saveData('slides.json', data.slides) : true,
        stats: data.stats ? saveData('stats.json', data.stats) : true,
        navigation: data.navigation ? saveData('navigation.json', data.navigation) : true,
        newsletter: data.newsletter ? saveData('newsletter.json', data.newsletter) : true,
        footer: data.footer ? saveData('footer.json', data.footer) : true,
        media: data.media ? saveData('media.json', data.media) : true,
        settings: data.settings ? saveData('settings.json', data.settings) : true,
        integrations: data.integrations ? saveData('integrations.json', data.integrations) : true,
        security: data.security ? saveData('security.json', data.security) : true,
        performance: data.performance ? saveData('performance.json', data.performance) : true
    };

    // Return true if all saves succeeded
    return Object.values(results).every(r => r === true);
}

module.exports = {
    loadData,
    saveData,
    loadAllData,
    saveAllData,
    ensureDirectories
};
