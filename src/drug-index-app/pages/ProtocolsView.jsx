import { ArrowLeft, ActivitySquare, HeartPulse, Ambulance, FileCheck2 } from "lucide-react"

export default function ProtocolsView({ onBack }) {
    const links = [
        {
            title: "Emergency Medicine in Animals",
            href: "https://www.msdvetmanual.com/emergency-medicine-and-critical-care/emergency-medicine-introduction/emergency-medicine-in-animals",
            icon: Ambulance,
            description: "Principles, readiness, and approach to veterinary emergencies"
        },
        {
            title: "Initial Triage & Resuscitation (Small Animals)",
            href: "https://www.msdvetmanual.com/emergency-medicine-and-critical-care/evaluation-and-initial-treatment-of-small-animal-emergency-patients/initial-triage-and-resuscitation-of-small-animal-emergency-patients",
            icon: ActivitySquare,
            description: "Primary survey, stabilization steps, and rapid interventions"
        },
        {
            title: "CPR in Small Animals",
            href: "https://www.msdvetmanual.com/emergency-medicine-and-critical-care/specific-diagnostics-and-therapy/cardiopulmonary-resuscitation-of-small-animals",
            icon: HeartPulse,
            description: "Algorithms, drug charts, and post–cardiac arrest care"
        },
        {
            title: "Trauma in Small Animal Emergency Medicine",
            href: "https://www.msdvetmanual.com/emergency-medicine-and-critical-care/specific-diagnostics-and-therapy/trauma-in-emergency-medicine-in-small-animals",
            icon: FileCheck2,
            description: "Assessment, diagnostics, and surgical decision criteria"
        },
        {
            title: "Veterinary Topics Index",
            href: "https://www.msdvetmanual.com/veterinary-topics",
            icon: Ambulance,
            description: "Browse MSD Veterinary Manual topics and use built-in search"
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
            <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="group flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-teal-500 hover:text-teal-600 transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Protocols</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Emergency and critical care references from MSD Veterinary Manual</p>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Quick Reference Algorithms */}
                <section className="mb-12">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <HeartPulse className="h-5 w-5 text-red-600" />
                        Emergency Algorithms (MSD/RECOVER)
                    </h2>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* CPR Basics */}
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">CPR Basic Life Support (BLS)</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-sm">1</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Compression Rate</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">100–120 compressions/minute (Dogs & Cats)</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-sm">2</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Ratio (Single Rescuer)</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">30 compressions : 2 breaths</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-sm">3</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Position</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Lateral recumbency (most patients). Lock elbows, compress 1/3–1/2 chest width.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-sm">4</div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Ventilation</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">10 breaths/min (1 breath every 6 sec). Volume ~10 mL/kg.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Triage ABCs */}
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Primary Survey (Triage ABCs)</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                                    <span className="font-bold text-teal-600 dark:text-teal-400 text-lg">A</span>
                                    <div>
                                        <span className="font-bold text-slate-900 dark:text-white">Airway</span>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Clear obstruction? Patent airway? Intubate if unconscious.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                                    <span className="font-bold text-teal-600 dark:text-teal-400 text-lg">B</span>
                                    <div>
                                        <span className="font-bold text-slate-900 dark:text-white">Breathing</span>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Respiratory rate & effort. Auscultate lungs. Check SpO2.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                                    <span className="font-bold text-teal-600 dark:text-teal-400 text-lg">C</span>
                                    <div>
                                        <span className="font-bold text-slate-900 dark:text-white">Circulation</span>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Heart rate, pulse quality, MM color, CRT, blood pressure.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                                    <span className="font-bold text-teal-600 dark:text-teal-400 text-lg">D</span>
                                    <div>
                                        <span className="font-bold text-slate-900 dark:text-white">Disability (Neuro)</span>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Level of consciousness, spinal reflexes, pupil size/PLR.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">MSD Veterinary Manual Resources</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Reference protocols for triage, CPR, trauma, and general emergency medicine. All links open MSD Veterinary Manual in a new tab.
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
