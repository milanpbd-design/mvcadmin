import Header from "../components/Header";
import FooterSection from "../components/FooterSection";
import { useSiteData } from "../context/SiteDataContext";

export default function Careers() {
    const { siteData } = useSiteData() || {};

    const jobs = [
        { title: "Veterinary Content Writer", type: "Remote", dept: "Editorial" },
        { title: "Senior Veterinary Reviewer", type: "Part-time", dept: "Medical Board" },
        { title: "Community Manager", type: "Remote", dept: "Marketing" }
    ];

    return (
        <div className="bg-white min-h-screen text-gray-800 font-sans">
            <Header siteName={siteData?.site?.name} navigation={siteData?.navigation} />

            <section className="py-20 px-4 max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
                <p className="text-gray-600 mb-12">Help us build the most trusted resource for pet health.</p>

                <div className="text-left space-y-4">
                    {jobs.map((job, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-6 flex justify-between items-center hover:shadow-md transition bg-white">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                                <div className="text-sm text-gray-500 space-x-2">
                                    <span>{job.dept}</span>
                                    <span>•</span>
                                    <span>{job.type}</span>
                                </div>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Apply</button>
                        </div>
                    ))}
                </div>
            </section>

            <FooterSection siteName={siteData?.site?.name} footer={siteData?.footer} />
        </div>
    );
}
