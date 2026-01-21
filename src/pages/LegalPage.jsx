import Header from "../components/Header";
import FooterSection from "../components/FooterSection";
import { useSiteData } from "../context/SiteDataContext";

export default function LegalPage({ title, children }) {
    const { siteData } = useSiteData() || {};

    return (
        <div className="bg-white min-h-screen text-gray-800 font-sans">
            <Header siteName={siteData?.site?.name} navigation={siteData?.navigation} />

            <div className="bg-gray-50 border-b py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12 prose md:prose-lg text-gray-600">
                {children || (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Last Updated: {new Date().toLocaleDateString()}</h2>
                        <p className="mb-6">
                            This is a placeholder for the <strong>{title}</strong>.
                            In a real application, this content would be managed via the admin panel or loaded from specific markdown files.
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h3>
                        <p className="mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">2. Terms</h3>
                        <p className="mb-4">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident.
                        </p>
                    </div>
                )}
            </div>

            <FooterSection siteName={siteData?.site?.name} footer={siteData?.footer} />
        </div>
    );
}
