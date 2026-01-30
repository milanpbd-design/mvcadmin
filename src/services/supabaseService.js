import { supabase } from './supabase';

/**
 * Supabase Service Layer
 * Provides CRUD operations for all database tables
 */

// ============= ARTICLES =============

export const articlesService = {
    async fetchAll() {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async fetchPublished() {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('published', true)
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async fetchById(id) {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(article) {
        const { data, error } = await supabase
            .from('articles')
            .insert([{
                ...article,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('articles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

// ============= RESEARCH =============

export const researchService = {
    async fetchAll() {
        const { data, error } = await supabase
            .from('research')
            .select('*')
            .order('year', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async create(research) {
        const { data, error } = await supabase
            .from('research')
            .insert([{
                ...research,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('research')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('research')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

// ============= CATEGORIES =============

export const categoriesService = {
    async fetchAll() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async create(category) {
        const { data, error } = await supabase
            .from('categories')
            .insert([category])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

export const mediaService = {
    async fetchAll() {
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async upload(file, uploadedBy) {
        // Upload file to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('media')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(fileName);

        // Save metadata to database with correct field names
        const { data, error } = await supabase
            .from('media')
            .insert([{
                file_name: file.name,
                url: publicUrl,
                file_type: file.type,
                file_size: file.size,
                uploaded_by: uploadedBy,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        // First get the media record to get URL
        const { data: mediaRecord } = await supabase
            .from('media')
            .select('url')
            .eq('id', id)
            .single();

        if (mediaRecord?.url) {
            // Extract file name from URL
            const fileName = mediaRecord.url.split('/').pop();

            // Delete from storage (ignore errors if file doesn't exist)
            await supabase.storage
                .from('media')
                .remove([fileName]);
        }

        // Delete from database
        const { error } = await supabase
            .from('media')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

// ============= SLIDES =============

export const slidesService = {
    async fetchAll() {
        const { data, error } = await supabase
            .from('slides')
            .select('*')
            .order('order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async fetchActive() {
        const { data, error } = await supabase
            .from('slides')
            .select('*')
            .eq('active', true)
            .order('order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    async create(slide) {
        const { data, error } = await supabase
            .from('slides')
            .insert([{
                ...slide,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('slides')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('slides')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

// ============= SITE CONFIG =============

export const siteConfigService = {
    async fetch() {
        const { data, error } = await supabase
            .from('site_config')
            .select('*')
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        return data || {};
    },

    // Alias for backward compatibility
    async fetchConfig() {
        return this.fetch();
    },

    async updateConfig(config) {
        return this.upsert(config);
    },

    async upsert(config) {
        // Check if config exists
        const existing = await this.fetch();

        if (existing && existing.id) {
            // Update existing
            const { data, error } = await supabase
                .from('site_config')
                .update({
                    ...config,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            // Create new
            const { data, error } = await supabase
                .from('site_config')
                .insert([{
                    ...config,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    }
};

// ============= COMMENTS =============

export const commentsService = {
    async fetchAll() {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async fetchByArticle(articleId) {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('article_id', articleId)
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async moderate(id, status) {
        const { data, error } = await supabase
            .from('comments')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};

// ============= USERS =============

export const usersService = {
    async fetchAll() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async fetchById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('users')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};

// ============= REALTIME SUBSCRIPTIONS =============

export const subscribeToTable = (table, callback) => {
    const subscription = supabase
        .channel(`public:${table}`)
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: table
        }, callback)
        .subscribe();

    return () => {
        subscription.unsubscribe();
    };
};
