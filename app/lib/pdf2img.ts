// pdf2img.ts
export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

type PdfJs = typeof import("pdfjs-dist/legacy/build/pdf.mjs");

let pdfjsLib: PdfJs | null = null;
let loadPromise: Promise<PdfJs> | null = null;

async function loadPdfJs(): Promise<PdfJs> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    // Use the LEGACY build and let the bundler give us a real URL for the worker
    loadPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((lib) => {
        const workerUrl = new URL(
            "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
            import.meta.url
        ).toString();
        lib.GlobalWorkerOptions.workerSrc = workerUrl;
        pdfjsLib = lib;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    try {
        if (typeof window === "undefined" || typeof document === "undefined") {
            throw new Error("convertPdfToImage must run in the browser.");
        }
        if (!(file instanceof File)) throw new Error("Expected a File object.");
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            throw new Error("Not a PDF file.");
        }
        if (file.size === 0) throw new Error("The uploaded file is empty (0 bytes).");

        const lib = await loadPdfJs();

        const data = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data }).promise; // worker loads here
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 2 }); // use 2; 4 can blow memory
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Unable to get 2D canvas context.");

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        // @ts-expect-error: TS doesn't narrow string union
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        await page.render({ canvasContext: ctx, viewport }).promise;

        const blob: Blob = await new Promise((resolve, reject) => {
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))), "image/png", 1.0);
        });

        const base = file.name.replace(/\.pdf$/i, "");
        const imageFile = new File([blob], `${base}.png`, { type: "image/png" });
        const url = URL.createObjectURL(blob);

        await pdf.destroy();
        canvas.width = 0; canvas.height = 0;

        return { imageUrl: url, file: imageFile };
    } catch (err: any) {
        console.error("[convertPdfToImage] error:", err);
        return { imageUrl: "", file: null, error: err?.message || String(err) };
    }
}
