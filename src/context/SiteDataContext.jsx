import { createContext, useContext, useEffect, useState } from "react";
import defaultData from "../data";
import {
  articlesService,
  researchService,
  categoriesService,
  mediaService,
  slidesService,
  siteConfigService,
  commentsService,
  usersService,
  subscribeToTable
} from "../services/supabaseService";

const SiteDataContext = createContext();

/**
 * Load all content from Supabase
 */
async function loadContentFromSupabase() {
  try {
    const [
      articles,
      research,
      categories,
      media,
      slides,
      comments,
      users,
      siteConfig
    ] = await Promise.all([
      articlesService.fetchPublished().catch(() => []),
      researchService.fetchAll().catch(() => []),
      categoriesService.fetchAll().catch(() => []),
      mediaService.fetchAll().catch(() => []),
      slidesService.fetchActive().catch(() => []),
      commentsService.fetchAll().catch(() => []),
      usersService.fetchAll().catch(() => []),
      siteConfigService.fetch().catch(() => null)
    ]);

    // Merge with site config or use defaults
    return {
      ...defaultData,
      ...(siteConfig || {}),
      articles,
      research,
      categories,
      media,
      slides,
      comments,
      users
    };
  } catch (error) {
    console.error('Failed to load content from Supabase:', error);
    return defaultData; // Fallback to default data
  }
}

export function SiteDataProvider({ children }) {
  const [siteData, setSiteData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load content from Supabase on mount
  useEffect(() => {
    loadContentFromSupabase()
      .then(data => {
        setSiteData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Subscribe to real-time updates for articles
  useEffect(() => {
    const unsubscribe = subscribeToTable('articles', (payload) => {
      console.log('Article change detected:', payload);
      // Reload articles when changes occur
      articlesService.fetchPublished().then(articles => {
        setSiteData(prev => ({ ...prev, articles }));
      });
    });

    return unsubscribe;
  }, []);

  // Method to reload data manually
  const reloadData = async () => {
    setLoading(true);
    try {
      const data = await loadContentFromSupabase();
      setSiteData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error reloading data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Method to update site data (for admin panel)
  const updateSiteData = (updates) => {
    setSiteData(prev => ({ ...prev, ...updates }));
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div>Loading from Supabase...</div>
        {error && <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>Error: {error}</div>}
      </div>
    );
  }

  return (
    <SiteDataContext.Provider value={{
      siteData,
      setSiteData: updateSiteData,
      reloadData,
      error
    }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
