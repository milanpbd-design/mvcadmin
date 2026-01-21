import Header from "../components/Header";
import FooterSection from "../components/FooterSection";
import { useSiteData } from "../context/SiteDataContext";

export default function ContactUs() {
    const { siteData } = useSiteData() || {};
    const siteName = siteData?.site?.name || "My Vet Corner";

    return (
        <div className="bg-white min-h-screen text-gray-800 font-sans">
            <Header siteName={siteName} navigation={siteData?.navigation} />

            <section className="bg-gray-50 py-20 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                    <div className="md:w-5/12 bg-blue-900 p-10 text-white flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                            <p className="text-blue-100 mb-8">Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span>support@myvetcorner.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <span>+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-7/12 p-10">
                        <form className="space-y-6" onSubmit={e => { e.preventDefault(); alert("Message Sent!"); }}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none h-32" placeholder="How can we help?"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">Send Message</button>
                        </form>
                    </div>

                </div>
            </section>
            <FooterSection siteName={siteName} footer={siteData?.footer} />
        </div>
    );
}
