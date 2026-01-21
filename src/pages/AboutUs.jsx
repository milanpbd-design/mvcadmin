import Header from "../components/Header";
import FooterSection from "../components/FooterSection";
import { useSiteData } from "../context/SiteDataContext";

export default function AboutUs() {
    const { siteData } = useSiteData() || {};
    const siteName = siteData?.site?.name || "My Vet Corner";

    return (
        <div className="bg-white min-h-screen text-gray-800 font-sans">
            <Header siteName={siteName} navigation={siteData?.navigation} />

            {/* Hero */}
            <section className="relative bg-gray-900 text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-blue-900 opacity-50"></div>
                <div className="relative max-w-5xl mx-auto text-center z-10">
                    <h1 className="text-5xl font-bold mb-6">Empowering Pet Owners</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        We bridge the gap between complex veterinary science and loving pet care, providing you with trusted knowledge to keep your companions healthy.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <img src="https://images.unsplash.com/photo-1554692996-43e950af06fc?auto=format&fit=crop&q=80&w=800" alt="Veterinarian with dog" className="rounded-2xl shadow-2xl" />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Founded in 2024, <span className="text-green-600 font-semibold">My</span><span className="text-blue-800 font-semibold">VetCorner</span> started with a simple question: "Why is accurate veterinary advice so hard to find online?"
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            We gathered a team of passionate veterinarians, researchers, and animal lovers to create a platform that respects the intelligence of pet owners while ensuring absolute medical accuracy.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-blue-50 py-16">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                        <div className="text-gray-600">Articles Published</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">50k+</div>
                        <div className="text-gray-600">Monthly Readers</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">20+</div>
                        <div className="text-gray-600">Vet Experts</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                        <div className="text-gray-600">Fact Checked</div>
                    </div>
                </div>
            </section>

            <FooterSection siteName={siteName} footer={siteData?.footer} />
        </div>
    );
}
