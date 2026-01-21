import {
    Pill,
    Heart,
    Brain,
    Zap,
    Syringe,
    Bug,
    Shield,
    Activity,
    Wind,
    Droplets,
    Bone
} from "lucide-react"
import { ArrowRight } from "lucide-react"; // Import individually if preferred or keep grouped

const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes("antibiotic") || t.includes("bacterial")) return Bug;
    if (t.includes("analgesic") || t.includes("pain") || t.includes("opioid")) return Activity;
    if (t.includes("cardio") || t.includes("heart")) return Heart;
    if (t.includes("neuro") || t.includes("convulsant") || t.includes("sedative") || t.includes("anesthetic")) return Brain;
    if (t.includes("inflam")) return Shield;
    if (t.includes("parasit")) return Bug;
    if (t.includes("respiratory") || t.includes("lung")) return Wind;
    if (t.includes("fluid") || t.includes("renal") || t.includes("diuretic")) return Droplets;
    if (t.includes("ortho") || t.includes("bone")) return Bone;
    if (t.includes("emergency") || t.includes("critical")) return Zap;
    if (t.includes("vaccine") || t.includes("immune")) return Syringe;

    return Pill; // Default
}

export default function CategoryCard({ title, count, onClick }) {
    const Icon = getIcon(title);

    return (
        <button
            onClick={onClick}
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-900/5 dark:hover:border-teal-500/50"
        >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-700 text-teal-600 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                <Icon className="h-7 w-7" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{title}</h3>
                <p className="mt-1 text-sm font-medium text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors">{count} formulations</p>
            </div>

            <div className="absolute top-6 right-6 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="h-5 w-5 text-teal-500" />
            </div>
        </button>
    )
}
