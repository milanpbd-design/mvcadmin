import { Link } from "react-router-dom";
import Header from "../components/Header";
import FooterSection from "../components/FooterSection";
import { useSiteData } from "../context/SiteDataContext";
import { labelToPath } from "../utils/paths";

export default function CategoryHub({ title, subCategoryNames = [] }) {
    const { siteData } = useSiteData() || {};
    const siteName = siteData?.site?.name || "My Vet Corner";
    const navigation = siteData?.navigation || [];
    const footer = siteData?.footer || {
        description: "",
        quickLinks: [],
        companyLinks: [],
        legalLinks: [],
    };

    const allCategories = siteData?.categories || [];

    // Filter categories to show based on the provided names
    const categoriesToShow = allCategories.filter(c => subCategoryNames.includes(c.name));

    return (
        <div className="bg-white min-h-screen text-gray-800 font-sans">
            <Header siteName={siteName} navigation={navigation} />

            {/* Breadcrumb / Title Section */}
            <section className="bg-gray-50 py-12 border-b">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
                    <nav className="text-sm text-gray-500 flex justify-center items-center">
                        <Link to="/" className="hover:text-blue-800 transition">Home</Link>
                        <span className="mx-2">›</span>
                        <span className="text-gray-700">{title}</span>
                    </nav>
                </div>
            </section>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {categoriesToShow.length === 0 ? (
                    <p className="text-center text-gray-600">No categories found for this section.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoriesToShow.map((cat, i) => (
                            <Link key={i} to={labelToPath(cat.name)} className="group relative rounded-2xl overflow-hidden aspect-video shadow-md hover:shadow-xl transition duration-300 block">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-white font-bold text-2xl mb-1">{cat.name}</h3>
                                    {cat.count && <p className="text-white/80 text-sm">{cat.count}</p>}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <FooterSection siteName={siteName} footer={footer} />
        </div>
    );
}
