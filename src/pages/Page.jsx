import Header from "../components/Header";
import FooterSection from "../components/FooterSection";
import { useSiteData } from "../context/SiteDataContext";
import { useLocation, Link, useParams } from "react-router-dom";
import { labelToPath } from "../utils/paths";

export default function Page({ title }) {
  const { siteData } = useSiteData() || {};
  const location = useLocation();
  const { slug } = useParams();

  const siteName = siteData?.site?.name || "My Vet Corner";
  const navigation = siteData?.navigation || [];
  const footer = siteData?.footer || {
    description: "",
    quickLinks: [],
    companyLinks: [],
    legalLinks: [],
    disclaimerText: "",
    copyright: "",
  };

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q');

  const allArticles = siteData?.articles || [];
  let articles = [...allArticles];

  // 1. Check if Single Article
  // Remove leading slash if using location.pathname, but useParams gives clean slug usually
  // However, Router uses /:slug so normal categories like /dogs also match this route!
  // We must first check if it's a category. 

  const path = location.pathname;
  const isCategory = (siteData?.categories || []).some(c => labelToPath(c.name) === path);
  const isSpecialPage = title; // If title prop is passed (e.g. from Router for specific pages)

  // Find article by slug
  // Should normalize: slug in DB might be "my-article", path is "/my-article"
  const singleArticle = !isCategory && !isSpecialPage && !searchQuery
    ? allArticles.find(a => a.slug === slug || ("/" + (a.slug || "")).replace('//', '/') === path)
    : null;

  let currentCategory = null;

  if (singleArticle) {
    // RENDER SINGLE ARTICLE
  } else if (searchQuery) {
    const q = searchQuery.toLowerCase();
    articles = articles.filter(a =>
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
      (a.content && a.content.toLowerCase().includes(q))
    );
  } else {
    // Category View or All Articles
    if (!title) {
      // If no title prop, it's a category page - filter by category
      currentCategory = (siteData?.categories || []).find(c => labelToPath(c.name || "") === path);
      articles = articles.filter(a => labelToPath(a.category || "") === path);
    }
    // If title prop exists (e.g., "Articles" page), show all articles without filtering
  }

  // --- RENDER ---
  if (singleArticle) {
    return (
      <div className="bg-white min-h-screen text-gray-800 font-sans">
        <Header siteName={siteName} navigation={navigation} />
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8 text-center">
            <span className={`inline-block bg-${singleArticle.categoryColor || 'blue'}-100 text-${singleArticle.categoryColor || 'blue'}-800 text-sm font-bold px-3 py-1 rounded-full mb-4`}>
              {singleArticle.category || 'Article'}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{singleArticle.title}</h1>
            <div className="text-gray-500 text-sm flex justify-center items-center space-x-4">
              <span>{singleArticle.date}</span>
              <span>•</span>
              <span>{singleArticle.readTime}</span>
              {singleArticle.author && (
                <>
                  <span>•</span>
                  <span>By {singleArticle.author}</span>
                </>
              )}
            </div>
          </div>

          {singleArticle.image && (
            <div className="mb-10 rounded-2xl overflow-hidden shadow-lg h-[400px] w-full">
              <img src={singleArticle.image} alt={singleArticle.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* CONTENT (HTML/Rich Text) */}
          <div
            className="prose prose-lg prose-blue max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: singleArticle.content || '' }}
          />
        </article>
        <FooterSection siteName={siteName} footer={footer} />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <Header siteName={siteName} navigation={navigation} />
      <section className="bg-gray-50 py-3 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-800">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">{title || currentCategory?.name || 'Archives'}</span>
          </nav>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {currentCategory ? (
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <img src={currentCategory.image} alt={currentCategory.name} className="w-full h-56 md:h-72 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white">{currentCategory.name}</h1>
              {currentCategory.count ? (
                <p className="text-white/80 text-sm">{currentCategory.count}</p>
              ) : null}
              {/* Optional: Add Description from SiteData if available */}
            </div>
          </div>
        ) : (
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{title || 'Articles'}</h1>
        )}

        {articles.length === 0 ? (
          <p className="text-gray-600">No articles found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <Link to={article.slug ? `/${article.slug}` : '#'} key={i} className="group block h-full">
                <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 h-full flex flex-col border border-gray-100">
                  <div className="h-48 overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div>
                      <span className={`inline-block bg-${article.categoryColor}-100 text-${article.categoryColor}-800 text-xs font-semibold px-3 py-1 rounded-full mb-3`}>{article.category}</span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                    </div>
                    <div className="mt-auto text-xs text-gray-500 border-t pt-4 flex justify-between">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
      <FooterSection siteName={siteName} footer={footer} />
    </div>
  );
}
