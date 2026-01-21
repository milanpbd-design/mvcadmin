import { X, Copy, Star, FileText, CheckCircle2, AlertCircle, Calculator } from "lucide-react"
import { useState, useEffect } from "react"

const formatTextToPoints = (text) => {
    if (!text || text === "Not specified in source") return [];

    // Remove common headers that might be in the text
    let cleanText = text
        .replace(/^Indications and Clinical Uses\s*/i, "")
        .replace(/^Dosage\s*/i, "")
        .replace(/^Contraindications and Precautions\s*/i, "")
        .trim();

    // If text contains bullets, split by them
    if (cleanText.includes("•")) {
        return cleanText
            .split("•")
            .map(t => t.trim())
            .filter(t => t.length > 0);
    }

    // Otherwise split by sentences for better readability
    // We use a simple split by period followed by space, avoiding some common abbreviations if possible
    // For simplicity, we'll just split by ". " and filter
    return cleanText
        .split(/\.\s+/)
        .map(t => t.trim())
        .filter(t => t.length > 0)
        .map(t => t.endsWith(".") || t.endsWith(":") ? t : t + ".");
}

const formatDosage = (text) => {
    if (!text || text === "Not specified in source") return [];

    let clean = text.replace(/^Dosage\s*/i, "").trim();

    // Split by bullet
    const rawParts = clean.split("•").map(t => t.trim());

    const groups = [];
    let currentSpecies = "General";

    const speciesList = [
        "Dogs and Cats", "Dogs", "Cats",
        "Horses", "Cattle", "Calves", "Ruminants", "Sheep", "Goats",
        "Pigs", "Swine",
        "Birds", "Poultry",
        "Rabbits", "Ferrets", "Exotics", "Wildlife"
    ];

    for (let i = 0; i < rawParts.length; i++) {
        let part = rawParts[i];
        if (!part) continue;

        // Handle first part starting with species name (e.g. "Dogs Follow...")
        if (i === 0 && rawParts.length === 1) {
            for (const sp of speciesList) {
                if (part.toLowerCase().startsWith(sp.toLowerCase() + " ")) {
                    currentSpecies = sp;
                    part = part.substring(sp.length).trim();
                    break;
                }
            }
        }

        // Check if this part ENDS with a species name that belongs to the NEXT bullet
        let nextSpeciesCandidate = null;

        if (i < rawParts.length - 1) {
            for (const sp of speciesList) {
                // Check for "PO. Cats" or "Cats" at end
                // We use a regex to ensure word boundary
                const escaped = sp.replace(" ", "\\s");
                const regex = new RegExp(`(?:^|[\\.\\s])${escaped}\\s*$`, "i");

                if (part.match(regex)) {
                    nextSpeciesCandidate = sp;
                    // Remove it from current part
                    // We want to remove the species name from the end
                    // Use replace with $ to only replace at end
                    part = part.replace(new RegExp(`${escaped}\\s*$`, "i"), "").trim();
                    // Remove trailing dot if valid
                    // part = part.replace(/\.$/, "").trim(); // Maybe keep the dot? "PO."
                    break;
                }
            }
        }

        // If this part ITSELF is just a species name (e.g. part 0 = "Dogs")
        const isJustSpecies = speciesList.some(sp => sp.toLowerCase() === part.toLowerCase() || sp.toLowerCase() === part.replace(/\.$/, "").toLowerCase());
        if (isJustSpecies) {
            // Find the matching species case
            const match = speciesList.find(sp => sp.toLowerCase() === part.replace(/\.$/, "").toLowerCase());
            currentSpecies = match || part.replace(/\.$/, "");
            continue; // Don't add as a point
        }

        // Clean tabs and extra spaces
        part = part.replace(/\t/g, " ").replace(/\s+/g, " ").trim();

        if (part) {
            let group = groups.find(g => g.species === currentSpecies);
            if (!group) {
                group = { species: currentSpecies, points: [] };
                groups.push(group);
            }
            group.points.push(part);
        }

        if (nextSpeciesCandidate) {
            currentSpecies = nextSpeciesCandidate;
        }
    }

    return groups;
}

export default function DrugModal({ drug, onClose, onOpenCalculator }) {
    const [note, setNote] = useState("")
    const [selectedSpecies, setSelectedSpecies] = useState("All")
    const [activeCalcKey, setActiveCalcKey] = useState(null)
    const [calcWeight, setCalcWeight] = useState("")
    const [calcWeightUnit, setCalcWeightUnit] = useState("kg")
    const [calcConcentration, setCalcConcentration] = useState("")
    const [calcConcentrationUnit, setCalcConcentrationUnit] = useState("mg/mL")
    const [calcParsed, setCalcParsed] = useState(null)

    useEffect(() => {
        if (drug) {
            // Load note from local storage
            const saved = localStorage.getItem(`note-${drug.name}`)
            setNote(saved || "")
        }
    }, [drug])

    const handleSaveNote = (val) => {
        setNote(val)
        if (drug) {
            localStorage.setItem(`note-${drug.name}`, val)
        }
    }

    const handleCopyDosage = () => {
        if (drug?.dosage) {
            navigator.clipboard.writeText(drug.dosage)
            alert("Dosage copied to clipboard!")
        }
    }

    const parseDosagePoint = (text) => {
        if (!text) return null
        const t = text.replace(/\s+/g, " ").trim()
        let route
        const routeMatch = t.match(/\b(IV|IM|SC|SQ|PO|PR|IO|Topical|Transdermal)\b/i)
        if (routeMatch) route = routeMatch[1].toUpperCase()
        let frequency
        const freqMatch =
            t.match(/\b(SID|BID|TID|QID)\b/i) ||
            t.match(/\bq\s*(\d+)\s*h\b/i) ||
            t.match(/\bevery\s+(\d+)\s*(?:hours?|h)\b/i)
        if (freqMatch) {
            if (freqMatch[0].toUpperCase() === "SID" || freqMatch[0].toUpperCase() === "BID" || freqMatch[0].toUpperCase() === "TID" || freqMatch[0].toUpperCase() === "QID") {
                frequency = freqMatch[0].toUpperCase()
            } else if (freqMatch[1]) {
                frequency = `q${freqMatch[1]}h`
            } else {
                frequency = freqMatch[0].replace(/every\s+/i, "q").replace(/\s*hours?/i, "h")
            }
        }
        let duration
        const durMatch = t.match(/\bfor\s+(\d+)\s*(days?|d|weeks?)\b/i)
        if (durMatch) duration = `${durMatch[1]} ${durMatch[2].toLowerCase().startsWith("d") ? "days" : "weeks"}`
        let dose
        const rangeMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:–|-|to)\s*(\d+(?:\.\d+)?)\s*(mg|mcg|ug)\s*\/\s*(kg|m2)\b/i)
        const singleMatch = t.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|ug)\s*\/\s*(kg|m2)(?:\s*bw)?\b/i)
        if (rangeMatch) {
            const u = rangeMatch[3].toLowerCase() === "ug" ? "mcg" : rangeMatch[3].toLowerCase()
            dose = `${rangeMatch[1]}–${rangeMatch[2]} ${u}/${rangeMatch[4].toLowerCase()}`
        } else if (singleMatch) {
            const u = singleMatch[2].toLowerCase() === "ug" ? "mcg" : singleMatch[2].toLowerCase()
            dose = `${singleMatch[1]} ${u}/${singleMatch[3].toLowerCase()}`
        }
        if (!dose && !route && !frequency && !duration) return null
        return { dose, route, frequency, duration }
    }

    const extractDoseNumbers = (dose) => {
        if (!dose) return null
        const r1 = dose.match(/^(\d+(?:\.\d+)?)\s*–\s*(\d+(?:\.\d+)?)\s*(mcg|mg)\/(kg|m2)$/i)
        const r2 = dose.match(/^(\d+(?:\.\d+)?)\s*(mcg|mg)\/(kg|m2)$/i)
        if (r1) {
            return {
                min: parseFloat(r1[1]),
                max: parseFloat(r1[2]),
                unit: r1[3].toLowerCase(),
                basis: r1[4].toLowerCase()
            }
        }
        if (r2) {
            const v = parseFloat(r2[1])
            return {
                min: v,
                max: v,
                unit: r2[2].toLowerCase(),
                basis: r2[3].toLowerCase()
            }
        }
        return null
    }

    const computeMiniCalc = () => {
        if (!calcParsed?.dose) return null
        const d = extractDoseNumbers(calcParsed.dose)
        if (!d) return null
        const w = parseFloat(calcWeight)
        if (isNaN(w) || w <= 0) return null
        const weightKg = calcWeightUnit === "lb" ? w / 2.20462 : w
        if (d.basis !== "kg") return {
            weightKg,
            minTotal: null,
            maxTotal: null,
            minVol: null,
            maxVol: null,
            unit: d.unit
        }
        const toMg = (val, unit) => unit === "mg" ? val : val / 1000
        const minTotal = weightKg * d.min
        const maxTotal = weightKg * d.max
        const concVal = parseFloat(calcConcentration)
        const concIsValid = !isNaN(concVal) && concVal > 0
        let minVol = null
        let maxVol = null
        if (concIsValid) {
            const doseMgMin = toMg(minTotal, d.unit)
            const doseMgMax = toMg(maxTotal, d.unit)
            const concMgPerMl = calcConcentrationUnit === "mg/mL" ? concVal : concVal / 1000
            minVol = doseMgMin / concMgPerMl
            maxVol = doseMgMax / concMgPerMl
        }
        return {
            weightKg,
            minTotal,
            maxTotal,
            minVol,
            maxVol,
            unit: d.unit
        }
    }

    if (!drug) return null

    const indicationsPoints = formatTextToPoints(drug.indications !== "Not specified in source" ? drug.indications : (drug.notes || ""));
    const dosageGroups = formatDosage(drug.dosage);
    const contraindicationsPoints = formatTextToPoints(drug.contraindications !== "Not specified in source" ? drug.contraindications : "");
    const sideEffectsPoints = formatTextToPoints(drug.side_effects !== "Not specified in source" ? drug.side_effects : "");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col border border-white/20 dark:border-slate-700">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between bg-clinical-lightTeal px-6 py-5 border-b border-clinical-teal/10 bg-[#f0fdfa] dark:bg-slate-800 dark:border-slate-700">
                    <div>
                        <h2 className="text-2xl font-bold text-clinical-textTeal text-[#115e59] dark:text-teal-400 capitalize">{drug.name}</h2>
                        <div className="text-sm text-clinical-slate font-medium mt-1 dark:text-slate-400">{drug.original_category || "Uncategorized"}</div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-8 flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500 dark:text-slate-400">Source: Papich Handbook of Veterinary Drugs • 5th Edition</div>
                    </div>
                    {/* Indications */}
                    <section className="bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/30">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            <h3 className="text-sm font-bold tracking-wide text-blue-900 dark:text-blue-300 uppercase">INDICATIONS</h3>
                        </div>

                        {indicationsPoints.length > 0 ? (
                            <ul className="space-y-2">
                                {indicationsPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500 italic text-sm">No specific indications listed.</p>
                        )}
                    </section>

                    {/* Dosage */}
                    <section className="bg-teal-50/50 dark:bg-teal-900/20 rounded-2xl p-5 border border-teal-100 dark:border-teal-900/30">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                <h3 className="text-sm font-bold tracking-wide text-teal-900 dark:text-teal-300 uppercase">DOSAGE & ADMINISTRATION</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                {onOpenCalculator && (
                                    <button
                                        onClick={() => { onClose(); onOpenCalculator(); }}
                                        className="flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:text-teal-900 bg-teal-100/50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition"
                                    >
                                        <Calculator className="w-3.5 h-3.5" />
                                        Calculate
                                    </button>
                                )}
                                <button
                                    onClick={handleCopyDosage}
                                    className="flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:text-teal-900 bg-teal-100/50 hover:bg-teal-100 px-3 py-1.5 rounded-full transition"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy
                                </button>
                            </div>
                        </div>

                        {dosageGroups.length > 1 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedSpecies("All")}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border ${selectedSpecies === "All" ? "bg-teal-600 text-white border-teal-600" : "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-slate-700"}`}
                                >
                                    All
                                </button>
                                {dosageGroups.map((g) => (
                                    <button
                                        key={g.species}
                                        onClick={() => setSelectedSpecies(g.species)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border ${selectedSpecies === g.species ? "bg-teal-600 text-white border-teal-600" : "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-slate-700"}`}
                                    >
                                        {g.species}
                                    </button>
                                ))}
                            </div>
                        )}

                        {dosageGroups.length > 0 ? (
                            <div className="space-y-4">
                                {dosageGroups.filter(g => selectedSpecies === "All" || g.species === selectedSpecies).map((group, i) => (
                                    <div key={i}>
                                        {group.species !== "General" && (
                                            <h4 className="font-bold text-teal-800 text-sm mb-2 flex items-center gap-2 uppercase">
                                                <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                                                {group.species}
                                            </h4>
                                        )}
                                        <ul className="space-y-2">
                                            {group.points.map((point, j) => {
                                                const parsed = parseDosagePoint(point)
                                                return (
                                                    <li key={j} className="flex flex-col gap-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed bg-white/60 dark:bg-slate-800/80 p-2 rounded-lg border border-teal-50 dark:border-teal-900/10">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {parsed?.dose && (
                                                                <span className="inline-flex items-center rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-800 ring-1 ring-inset ring-teal-600/20">
                                                                    {parsed.dose}
                                                                </span>
                                                            )}
                                                            {parsed?.route && (
                                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/10">
                                                                    {parsed.route}
                                                                </span>
                                                            )}
                                                            {parsed?.frequency && (
                                                                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-800 ring-1 ring-inset ring-indigo-600/20">
                                                                    {parsed.frequency}
                                                                </span>
                                                            )}
                                                            {parsed?.duration && (
                                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/20">
                                                                    {parsed.duration}
                                                                </span>
                                                            )}
                                                            <button
                                                                onClick={() => navigator.clipboard.writeText(point)}
                                                                className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:text-teal-900 bg-teal-100/50 hover:bg-teal-100 px-2.5 py-1 rounded-full transition"
                                                            >
                                                                <Copy className="w-3.5 h-3.5" />
                                                                Copy line
                                                            </button>
                                                            {parsed?.dose && (
                                                                <button
                                                                    onClick={() => { setActiveCalcKey(`${i}-${j}`); setCalcParsed(parsed); }}
                                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-100/50 hover:bg-indigo-100 px-2.5 py-1 rounded-full transition"
                                                                >
                                                                    <Calculator className="w-3.5 h-3.5" />
                                                                    Mini calc
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="text-slate-700 dark:text-slate-300">
                                                            <span className="font-medium text-teal-900/80 dark:text-teal-200/90">{point}</span>
                                                        </div>
                                                        {activeCalcKey === `${i}-${j}` && calcParsed?.dose && (
                                                            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            value={calcWeight}
                                                                            onChange={e => setCalcWeight(e.target.value)}
                                                                            placeholder="Weight"
                                                                            className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
                                                                        />
                                                                        <div className="flex gap-1">
                                                                            <button
                                                                                onClick={() => setCalcWeightUnit("kg")}
                                                                                className={`px-2 py-1 rounded-md text-xs border ${calcWeightUnit === "kg" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-700 border-slate-300"}`}
                                                                            >
                                                                                kg
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setCalcWeightUnit("lb")}
                                                                                className={`px-2 py-1 rounded-md text-xs border ${calcWeightUnit === "lb" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-700 border-slate-300"}`}
                                                                            >
                                                                                lb
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            value={calcConcentration}
                                                                            onChange={e => setCalcConcentration(e.target.value)}
                                                                            placeholder="Concentration"
                                                                            className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
                                                                        />
                                                                        <select
                                                                            value={calcConcentrationUnit}
                                                                            onChange={e => setCalcConcentrationUnit(e.target.value)}
                                                                            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
                                                                        >
                                                                            <option value="mg/mL">mg/mL</option>
                                                                            <option value="mcg/mL">mcg/mL</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="text-xs text-slate-600">
                                                                        <div className="font-bold text-slate-800">Dose</div>
                                                                        <div>{calcParsed.dose}</div>
                                                                        {calcParsed.route && <div>{calcParsed.route}</div>}
                                                                        {calcParsed.frequency && <div>{calcParsed.frequency}</div>}
                                                                    </div>
                                                                </div>
                                                                <div className="mt-3 text-xs">
                                                                    {(() => {
                                                                        const res = computeMiniCalc()
                                                                        if (!res) return <div className="text-slate-500">Enter weight to compute.</div>
                                                                        const unitLabel = res.unit.toUpperCase()
                                                                        return (
                                                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                                                <div className="rounded-md bg-white p-2 border border-slate-200">
                                                                                    <div className="font-bold text-slate-800">Total {unitLabel}</div>
                                                                                    {res.minTotal !== null && res.maxTotal !== null && res.minTotal !== res.maxTotal ? (
                                                                                        <div>{res.minTotal.toFixed(2)}–{res.maxTotal.toFixed(2)} {unitLabel}</div>
                                                                                    ) : (
                                                                                        <div>{(res.minTotal ?? 0).toFixed(2)} {unitLabel}</div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="rounded-md bg-white p-2 border border-slate-200">
                                                                                    <div className="font-bold text-slate-800">Volume mL</div>
                                                                                    {res.minVol !== null && res.maxVol !== null && res.minVol !== res.maxVol ? (
                                                                                        <div>{res.minVol.toFixed(2)}–{res.maxVol.toFixed(2)} mL</div>
                                                                                    ) : (
                                                                                        <div>{res.minVol !== null ? res.minVol.toFixed(2) : "-"} mL</div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })()}
                                                                </div>
                                                                <div className="mt-2 flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => setActiveCalcKey(null)}
                                                                        className="px-2.5 py-1.5 rounded-md bg-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-300 transition"
                                                                    >
                                                                        Close
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            const res = computeMiniCalc()
                                                                            if (!res) return
                                                                            const unitLabel = res.unit.toUpperCase()
                                                                            const totalLabel = res.minTotal !== null && res.maxTotal !== null && res.minTotal !== res.maxTotal
                                                                                ? `${res.minTotal.toFixed(2)}–${res.maxTotal.toFixed(2)} ${unitLabel}`
                                                                                : `${(res.minTotal ?? 0).toFixed(2)} ${unitLabel}`
                                                                            const volLabel = res.minVol !== null && res.maxVol !== null && res.minVol !== res.maxVol
                                                                                ? `${res.minVol.toFixed(2)}–${res.maxVol.toFixed(2)} mL`
                                                                                : res.minVol !== null ? `${res.minVol.toFixed(2)} mL` : "-"
                                                                            const summary = `Weight: ${res.weightKg.toFixed(2)} kg; Total: ${totalLabel}; Volume: ${volLabel}; Dose: ${calcParsed?.dose}${calcParsed?.route ? ` ${calcParsed.route}` : ""}${calcParsed?.frequency ? ` ${calcParsed.frequency}` : ""}`
                                                                            navigator.clipboard.writeText(summary)
                                                                        }}
                                                                        className="px-2.5 py-1.5 rounded-md bg-teal-600 text-white text-xs font-medium hover:bg-teal-700 transition"
                                                                    >
                                                                        Copy result
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 italic text-sm">No dosage information available.</p>
                        )}
                    </section>

                    {/* Grid for Contraindications & Side Effects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="p-4 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/20">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <h3 className="text-xs font-bold tracking-wide text-red-800 dark:text-red-300 uppercase">CONTRAINDICATIONS</h3>
                            </div>
                            {contraindicationsPoints.length > 0 ? (
                                <ul className="space-y-2">
                                    {contraindicationsPoints.map((point, i) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-500 italic text-sm">None listed</p>
                            )}
                        </section>

                        <section className="p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-orange-50/30 dark:bg-orange-900/10">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-orange-500" />
                                <h3 className="text-xs font-bold tracking-wide text-orange-800 dark:text-orange-300 uppercase">SIDE EFFECTS</h3>
                            </div>
                            {sideEffectsPoints.length > 0 ? (
                                <ul className="space-y-2">
                                    {sideEffectsPoints.map((point, i) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-400" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-slate-500 italic text-sm">None listed</p>
                            )}
                        </section>
                    </div>

                    {/* Summary */}
                    <section>
                        <h3 className="text-sm font-bold tracking-wide text-clinical-teal text-[#0d9488] dark:text-teal-400 uppercase mb-2">SUMMARY</h3>
                        <p className="text-gray-700 dark:text-slate-300">
                            {drug.active_ingredient} is used for {(drug.species || []).join(", ")}. {drug.original_category || "Uncategorized"}.
                        </p>
                    </section>

                    {/* Clinical Notes */}
                    <section className="pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="flex items-center gap-2 text-sm font-bold tracking-wide text-clinical-teal text-[#0d9488] dark:text-teal-400 uppercase">
                                <FileText className="w-4 h-4" />
                                CLINICAL NOTES
                            </h3>
                            <button className="flex items-center gap-2 bg-[#0d9488] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#115e59] transition shadow-sm">
                                <Star className="w-3 h-3" />
                                Add to Favorites
                            </button>
                        </div>
                        <textarea
                            value={note}
                            onChange={(e) => handleSaveNote(e.target.value)}
                            placeholder="Add your personal clinical notes here... (Auto-saved)"
                            className="w-full h-32 p-4 rounded-lg border border-gray-200 dark:border-slate-700 focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488] outline-none resize-none text-sm bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-200 placeholder:text-gray-400"
                        />
                    </section>
                </div>
            </div>
        </div>
    )
}
