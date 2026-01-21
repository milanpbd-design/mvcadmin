import Header from "../components/Header";
import FooterSection from "../components/FooterSection";
import { useSiteData } from "../context/SiteDataContext";

export default function MedicalReviewBoard() {
    const { siteData } = useSiteData() || {};
    const siteName = siteData?.site?.name || "My Vet Corner";

    return (
        <div className="bg-white min-h-screen text-gray-800 font-sans">
            <Header siteName={siteName} navigation={siteData?.navigation} />

            {/* Hero Section */}
            <section className="bg-blue-900 text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Medical Review Board</h1>
                <p className="max-w-2xl mx-auto text-blue-100 text-lg">
                    Our team of veterinary professionals ensures every article is accurate, up-to-date, and safe for your pets.
                </p>
            </section>

            {/* Intro */}
            <section className="max-w-5xl mx-auto px-4 py-16 text-center">
                <p className="text-xl text-gray-600 leading-relaxed">
                    At <span className="text-green-600 font-semibold">My</span><span className="text-blue-800 font-semibold">VetCorner</span>, we believe in accurate, science-backed information.
                    Our Medical Review Board consists of board-certified veterinarians and veterinary experts
                    who rigorously review our content to maintain the highest standards of veterinary care.
                </p>
            </section>

            {/* Experts Grid */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(siteData?.experts || []).map((expert, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition duration-300 text-center border border-gray-100">
                                <img
                                    src={expert.image}
                                    alt={expert.name}
                                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-blue-50"
                                />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{expert.name}</h3>
                                <p className="text-blue-600 font-semibold mb-2">{expert.title}</p>
                                <p className="text-gray-500">{expert.specialty}</p>
                            </div>
                        ))}
                    </div>
                    {(siteData?.experts || []).length === 0 && (
                        <p className="text-center text-gray-500">No experts listed yet.</p>
                    )}
                </div>
            </section>

            <FooterSection siteName={siteName} footer={siteData?.footer} />
        </div>
    );
}
