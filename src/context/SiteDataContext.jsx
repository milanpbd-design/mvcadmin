import { createContext, useContext, useEffect, useState } from "react";
import defaultData from "../data";

const SiteDataContext = createContext();

/**
 * Load content from static JSON files in public/content/
 */
async function loadContentFromJSON() {
  try {
    const [
      articles,
      research,
      experts,
      categories,
      media,
      slides,
      users,
      comments,
      siteConfig
    ] = await Promise.all([
      fetch('/content/articles.json').then(r => r.json()).catch(() => []),
      fetch('/content/research.json').then(r => r.json()).catch(() => []),
      fetch('/content/experts.json').then(r => r.json()).catch(() => []),
      fetch('/content/categories.json').then(r => r.json()).catch(() => []),
      fetch('/content/media.json').then(r => r.json()).catch(() => []),
      fetch('/content/slides.json').then(r => r.json()).catch(() => []),
      fetch('/content/users.json').then(r => r.json()).catch(() => []),
      fetch('/content/comments.json').then(r => r.json()).catch(() => []),
      fetch('/content/site-config.json').then(r => r.json()).catch(() => ({})),
    ]);

    return {
      ...siteConfig,
      articles,
      research,
      experts,
      categories,
      media,
      slides,
      users,
      comments,
    };
  } catch (error) {
    console.error('Failed to load content from JSON:', error);
    return defaultData; // Fallback to default data
  }
}

export function SiteDataProvider({ children }) {
  const [siteData, setSiteData] = useState(() => {
    // Try localStorage first for admin edits
    const stored = localStorage.getItem("vetCornerData");
    return stored ? JSON.parse(stored) : defaultData;
  });

  const [loading, setLoading] = useState(true);

  // Load content from static JSON files on mount
  useEffect(() => {
    loadContentFromJSON().then(data => {
      // Merge with localStorage (localStorage takes priority for admin edits)
      const stored = localStorage.getItem("vetCornerData");
      if (stored) {
        const localData = JSON.parse(stored);
        setSiteData({ ...data, ...localData });
      } else {
        setSiteData(data);
      }
      setLoading(false);
    });
  }, []);

  // Save to localStorage when data changes (for admin panel editing)
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("vetCornerData", JSON.stringify(siteData));
    }
  }, [siteData, loading]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <SiteDataContext.Provider value={{ siteData, setSiteData }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
