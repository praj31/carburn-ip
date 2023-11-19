// pages/index.tsx
'use client'
import React, { useState, ChangeEvent } from 'react';
import Papa, { ParseResult } from 'papaparse';
import CsvTable from './csvtables';

interface Row {
}

const IndexPage: React.FC = () => {
    const [csvFiles, setCsvFiles] = useState<FileList | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [csvData, setCsvData] = useState<Row[] | null>(null);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setCsvFiles(files);
            setSelectedFile(null); // Reset selected file when new files are uploaded
        }
    };

    const handleFileSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedFileName = event.target.value;
        setSelectedFile(selectedFileName);
        parseCsvFile(selectedFileName);
    };

    const parseCsvFile = (fileName: string) => {
        const selectedFile = Array.from(csvFiles || []).find(
            (file) => file.name === fileName
        );
        if (selectedFile) {
            Papa.parse<Row>(selectedFile, {
                header: true,
                dynamicTyping: true,
                complete: (result: ParseResult<Row>) => {
                    setCsvData(result.data);
                },
            });
        }
    };

    return (
        <div className="p-8">
            <input
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileUpload}
                className="mb-4"
            />

            {csvFiles && csvFiles.length > 0 && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select File to Display:
                    </label>
                    <div className="relative">
                        <select
                            onChange={handleFileSelect}
                            value={selectedFile || ''}
                            className="appearance-none w-full bg-white border border-gray-300 py-2 pl-3 pr-10 rounded-md leading-5 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                            <option value="" disabled>
                                Choose a file
                            </option>
                            {Array.from(csvFiles).map((file) => (
                                <option key={file.name} value={file.name}>
                                    {file.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            <CsvTable data={csvData} />
        </div>
    );
};

export default IndexPage;
