import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import Header from '../components/Header';
import FooterSection from '../components/FooterSection';

export default function ResearchPage() {
    const { siteData } = useSiteData() || {};
    const research = siteData?.research || [];

    // Function to strip HTML tags from content
    const stripHtml = (html) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header siteName={siteData.site?.name} navigation={siteData.navigation} />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center text-white">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                            Research & Journals
                        </h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Peer-reviewed studies, case reports, and academic resources to advance veterinary medicine
                        </p>
                    </div>
                </div>
            </section>

            {/* Breadcrumb */}
            <section className="bg-white dark:bg-gray-800 py-3 border-b dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="text-sm text-gray-500 dark:text-gray-400">
                        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                            Home
                        </Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-700 dark:text-gray-300">Research & Journals</span>
                    </nav>
                </div>
            </section>

            {/* Research Papers List */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4">
                    {research.length === 0 ? (
                        <div className="text-center py-16">
                            <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                No research papers yet
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Check back soon for peer-reviewed studies and research articles
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {research.map((paper, idx) => {
                                const typeColorClass = paper.typeColor || 'blue';
                                const hasContent = paper.content && stripHtml(paper.content).trim().length > 0;
                                const hasPdf = paper.pdfUrl && paper.pdfUrl.trim().length > 0;

                                return (
                                    <article
                                        key={paper._id || idx}
                                        className={`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border-l-4 border-${typeColorClass}-600 hover:shadow-md transition-shadow`}
                                    >
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className={`bg-${typeColorClass}-100 dark:bg-${typeColorClass}-900 text-${typeColorClass}-800 dark:text-${typeColorClass}-200 text-sm font-semibold px-4 py-1.5 rounded-full`}>
                                                    {paper.type || 'Research'}
                                                </span>
                                                {hasPdf && (
                                                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                                        </svg>
                                                        PDF Available
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                                {paper.year}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                            {paper.title}
                                        </h2>

                                        {/* Authors & Journal */}
                                        <div className="text-gray-600 dark:text-gray-300 text-sm mb-4 space-y-1">
                                            {paper.authors && (
                                                <p>
                                                    <strong className="font-semibold">Authors:</strong> {paper.authors}
                                                </p>
                                            )}
                                            {paper.journal && (
                                                <p>
                                                    <strong className="font-semibold">Published in:</strong> {paper.journal}
                                                </p>
                                            )}
                                        </div>

                                        {/* Abstract */}
                                        {paper.abstract && (
                                            <div className="mb-6">
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Abstract</h3>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {paper.abstract}
                                                </p>
                                            </div>
                                        )}

                                        {/* Full Content (if available) */}
                                        {hasContent && (
                                            <div className="mb-6 pb-6 border-b dark:border-gray-700">
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Full Content</h3>
                                                <div
                                                    className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
                                                    dangerouslySetInnerHTML={{ __html: paper.content }}
                                                />
                                            </div>
                                        )}

                                        {/* Download Button */}
                                        {hasPdf && (
                                            <div className="flex items-center gap-4">
                                                <a
                                                    href={`http://localhost:5000${paper.pdfUrl}`}
                                                    download
                                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Download Full Paper (PDF)
                                                </a>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {paper.pdfFileName || 'Research paper'}
                                                </span>
                                            </div>
                                        )}

                                        {/* No PDF Available Message */}
                                        {!hasPdf && hasContent && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                                Full content available online only
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <FooterSection siteName={siteData.site?.name} footer={siteData.footer} />
        </div>
    );
}
