import { useId, useRef, useState } from "react";
import { Check, FileText, Upload, X } from "lucide-react";
import { Button } from "../../../shared/ui/Button";

export function CvUploadCard() {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState("");

    return (
        <section aria-labelledby={`${inputId}-title`} className="min-w-0">
            <h3 id={`${inputId}-title`} className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">CV document</h3>
            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Choose a PDF or Word document.</p>

            <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept=".pdf,.doc,.docx"
                className="peer sr-only"
                aria-labelledby={`${inputId}-title`}
                aria-describedby={`${inputId}-hint`}
                onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
            />
            <label htmlFor={inputId} className="mt-4 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-400 bg-zinc-50 px-4 py-8 text-center transition-colors hover:border-brand-primary hover:bg-indigo-50/50 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-indigo-500 dark:border-zinc-500 dark:bg-zinc-950/40 dark:hover:border-indigo-400 dark:hover:bg-indigo-500/5">
                <Upload aria-hidden="true" className="size-6 text-zinc-500 dark:text-zinc-400" />
                <span className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-brand-primary px-4 text-sm font-medium text-white">{fileName ? "Replace CV" : "Upload CV"}</span>
                <span id={`${inputId}-hint`} className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">PDF, DOC, or DOCX · Select from your device</span>
            </label>

            <div role="status">
                {fileName && (
                    <div className="mt-3 flex items-center gap-3 rounded-lg bg-zinc-50 pl-3 dark:bg-zinc-800/60">
                        <FileText aria-hidden="true" className="size-5 shrink-0 text-indigo-500 dark:text-indigo-300" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100" title={fileName}>{fileName}</p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400"><Check aria-hidden="true" className="size-3" /> Selected on this device</p>
                        </div>
                        <Button variant="ghost" size="sm" className="min-h-11 min-w-11 shrink-0" aria-label="Remove selected CV" onClick={() => {
                            setFileName("");
                            if (inputRef.current) inputRef.current.value = "";
                        }}><X aria-hidden="true" className="size-4" /></Button>
                    </div>
                )}
            </div>
            <p className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">Preview only. Your file is not uploaded or processed.</p>
        </section>
    );
}
