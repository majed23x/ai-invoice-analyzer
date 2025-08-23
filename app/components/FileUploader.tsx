import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";
import type {FileRejection} from "react-dropzone";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const maxFileSize = 20 * 1024 * 1024; // 20 MB

    const onDrop = useCallback(
        (accepted: File[]) => {
            const file = accepted[0] ?? null;
            setSelectedFile(file);
            onFileSelect?.(file);
        },
        [onFileSelect]
    );

    const onDropRejected = useCallback((rejections: FileRejection[]) => {
        const msg = rejections
            .flatMap(r => r.errors.map(e => `"${r.file.name}": ${e.message}`))
            .join("\n");
        alert(msg || "Only PDF files are allowed (max 20 MB).");
        setSelectedFile(null);
        onFileSelect?.(null);
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        multiple: false,
        accept: { "application/pdf": [".pdf"] },
        maxSize: maxFileSize,
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        onFileSelect?.(null);
    };

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer text-center">
                    {!selectedFile ? (
                        <div>
                            <div className="p-2">
                                <img src="/icons/info.svg" alt="upload" className="size-20" />
                            </div>
                            <p className="text-lg text-gray-700">
                <span className="font-semibold">
                  {isDragActive ? "Drop the PDF here" : "Click to Upload"}
                </span>{" "}
                                {!isDragActive && "or drag & drop"}
                            </p>
                            <p className="text-sm text-gray-500">PDF (max {formatSize(maxFileSize)})</p>
                        </div>
                    ) : (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <div className="mx-auto w-10 h-10">
                                <img src="/images/pdf.png" alt="pdf" className="size-10 mx-auto" />
                            </div>
                            <div className="flex items-center justify-center space-x-3 mt-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-sm text-gray-500">{formatSize(selectedFile.size)}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="mt-3 inline-flex items-center justify-center space-x-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                            >
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                                <span>Remove</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;
