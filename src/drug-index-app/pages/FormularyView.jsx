import { ArrowLeft, Pill, Syringe, Shield, Activity, BookOpenCheck } from "lucide-react"

export default function FormularyView({ onBack }) {
    const links = [
        {
            title: "Analgesics Used in Animals",
            href: "https://www.msdvetmanual.com/therapeutics/pain-assessment-and-management/analgesics-used-in-animals",
            icon: Activity,
            description: "Overview of analgesic drug classes and dosing considerations"
        },
        {
            title: "NSAIDs: Pain Management Table (Dogs & Cats)",
            href: "https://www.msdvetmanual.com/multimedia/table/nsaids-used-for-pain-management-in-dogs-and-cats",
            icon: Shield,
            description: "Quick-reference table of NSAID options and cautions"
        },
        {
            title: "Nonsteroidal Anti-inflammatory Drugs",
            href: "https://www.msdvetmanual.com/pharmacology/inflammation/nonsteroidal-anti-inflammatory-drugs-in-animals",
            icon: Shield,
            description: "Pharmacology and indications of NSAIDs in veterinary medicine"
        },
        {
            title: "Beta-Lactam Antimicrobial Use",
            href: "https://www.msdvetmanual.com/pharmacology/antibacterial-agents/beta-lactam-antimicrobial-use-in-animals",
            icon: Syringe,
            description: "Penicillins, cephalosporins, cephamycins — spectrum and use"
        },
        {
            title: "Antimicrobial Drug Factors",
            href: "https://www.msdvetmanual.com/pharmacology/antimicrobials/antimicrobial-drug-factors-for-animals",
            icon: Syringe,
            description: "Mechanisms, PK/PD, resistance, and regimen design"
        },
        {
            title: "Routes & Dosage Forms",
            href: "https://www.msdvetmanual.com/pharmacology/pharmacology-introduction/routes-of-administration-and-dosage-forms-of-drugs?autoredirectid=21721&ruleredirectid=458",
            icon: BookOpenCheck,
            description: "Veterinary-specific dosage forms and administration routes"
        },
        {
            title: "Veterinary Topics Index",
            href: "https://www.msdvetmanual.com/veterinary-topics",
            icon: Pill,
            description: "Browse MSD Veterinary Manual topics and use built-in search"
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
            <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="group flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Formulary</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Links reference exclusively MSD Veterinary Manual</p>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Quick Reference Section */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <BookOpenCheck className="h-5 w-5 text-teal-600" />
                        Quick Reference Dosages (MSD)
                    </h2>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Emergency Drugs */}
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-red-500" />
                                Emergency Drugs (Dogs & Cats)
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                        <tr>
                                            <th className="px-3 py-2 rounded-l-lg">Drug</th>
                                            <th className="px-3 py-2 rounded-r-lg">Dosage / Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">Lidocaine (Dogs)</td>
                                            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">2 mg/kg IV bolus over ~1 min (to effect). Max cumulative 8 mg/kg over 30 min.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">Lidocaine (Cats)</td>
                                            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">0.1–0.4 mg/kg IV bolus over ~1 min. Use caution (sensitive).</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">Epinephrine</td>
                                            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">High dose no longer recommended. Administer every second CPR cycle.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">Atropine</td>
                                            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">Give early and once if bradycardia or high vagal tone suspected.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Common Antibiotics */}
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                <Syringe className="h-4 w-4 text-blue-500" />
                                Common Antibiotics (Antistaphylococcal)
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                        <tr>
                                            <th className="px-3 py-2 rounded-l-lg">Drug</th>
                                            <th className="px-3 py-2 rounded-r-lg">Dosage (PO)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">Cephalexin</td>
                                            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">20–30 mg/kg q 12 h</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">Amoxicillin-clavulanate</td>
                                            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">13.75 mg/kg q 12 h</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">Enrofloxacin</td>
                                            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">5 mg/kg q 24 h</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">Clindamycin</td>
                                            <td className="px-3 py-3 text-slate-600 dark:text-slate-300">Dogs: 10–20 mg/kg q 12 h<br />Cats: 12.5–25 mg/kg q 12 h</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">MSD Veterinary Manual Resources</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Use these authoritative resources for full details. All links open the MSD Veterinary Manual in a new tab.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {links.map((l, i) => {
                        const Icon = l.icon
                        return (
                            <a
                                key={l.href}
                                href={l.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-left shadow-sm transition-all hover:border-teal-500/50 hover:shadow-md hover:ring-1 hover:ring-teal-500/50"
                                style={{ animationDelay: `${i * 30}ms` }}
                            >
                                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 dark:bg-slate-700 text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{l.title}</div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{l.description}</div>
                            </a>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
