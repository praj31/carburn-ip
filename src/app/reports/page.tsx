'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import useFileStore from '@/app/_store/fileStore';
import jsPDF from 'jspdf';
// import { useRouter } from 'next/router';

const FrameworkSelection: React.FC = () => {
    // const router = useRouter();
    const files = useFileStore((state) => state.files);
    const { fetchFiles } = useFileStore();

    const uploadRef = useRef<HTMLInputElement>(null);

    const [selectedFramework, setSelectedFramework] = useState<string>('');
    const [selectedGRIValues, setSelectedGRIValues] = useState<string[]>([]);
    const [selectAllGRI, setSelectAllGRI] = useState(false);
    const allSelectedGRIValues = selectedGRIValues.join(',');

    const GRI_TEXT_MAP: Record<string, string> = {
        '102': 'Gender statistics: global workforce1',
        '302': 'Energy Consumption',
        '305': 'Emissions',
        '401': 'Employee Hires and Turnover',
        '404': 'Average hours of training per year per employee',
        '405': 'Diversity of governance bodies and employees',
        '413': 'Operations with local community engagement, impact assessments, and development programs',
        '414': 'Supplier Social Assessment',
    };

    const renderTableRow = (rowData: string[], isHeader: boolean = false, highlightedRowIndex: number | null = null) => {
        const RowTag = isHeader ? 'th' : 'td';

        return (
            <tr style={highlightedRowIndex !== null && highlightedRowIndex === parseInt(rowData[0], 10) ? { backgroundColor: '#FFFBEB' } : {}}>
                {rowData.map((cell, index) => (
                    <RowTag key={index} className="p-2 border">
                        {cell}
                    </RowTag>
                ))}
            </tr>
        );
    };


    const handleFrameworkSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedFramework(selectedValue);
    };

    const handleGRIValueSelect = (value: string) => {
        if (selectAllGRI) {
            setSelectedGRIValues(Object.keys(GRI_TEXT_MAP));
            setSelectAllGRI(false);
        } else {
            setSelectedGRIValues((prevValues) => {
                if (prevValues.includes(value)) {
                    return prevValues.filter((v) => v !== value);
                } else {
                    return [...prevValues, value];
                }
            });
        }
    };
    const handleUploadFramework = async () => {
        try {
            console.log('Selected GRI Values:', selectedGRIValues);
            const response = await axios.post('http://localhost:4000/uploadFramework', {
                framework: selectedFramework,
                selectedGRIValues,
            });

            if (response.status === 201) {
                fetchFiles();

                // router.push(`/gri/${allSelectedGRIValues}`);
            }
        } catch (error) {
            console.error('Error uploading framework:', error);
        }
    };

    const handleCancel = () => {
        setSelectedFramework('');
        setSelectedGRIValues([]);
        setSelectAllGRI(false);
    };

    useEffect(() => {
        console.log('Selected GRI Values (Effect):', selectedGRIValues);
    }, [selectedGRIValues]);

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">ESG Framework Selection</h2>

            <div className="mb-4">
                <label htmlFor="frameworkSelect" className="block text-sm font-medium text-gray-700">
                    Choose a Framework:
                </label>
                <select
                    id="frameworkSelect"
                    name="frameworkSelect"
                    className="mt-1 p-2 border rounded-md"
                    value={selectedFramework}
                    onChange={handleFrameworkSelect}
                >
                    <option value="">Select...</option>
                    <option value="GRI">GRI Framework</option>
                    <option value="TFTD">TFTD Framework</option>
                    <option value="SASB">SASB Framework</option>
                    <option value="UN SDG">UN SDG Framework</option>
                </select>
            </div>

            {selectedFramework && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Previous Year Report</h3>
                    <p>Download the report for the previous year:</p>
                    <a
                        href="https://www.moodys.com/sites/products/ProductAttachments/Sustainability/2020%20GRI%20Report.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:underline"
                    >
                        2020 GRI Report (PDF)
                    </a>
                </div>
            )}

            {selectedFramework === 'GRI' && (
                <div className="mb-4">
                    <label htmlFor="selectAllGRI" className="block text-sm font-medium text-gray-700">
                        Select All GRI Values
                    </label>
                    <input
                        id="selectAllGRI"
                        type="checkbox"
                        className="mt-1 p-2 border rounded-md"
                        checked={selectAllGRI}
                        onChange={() => setSelectAllGRI(!selectAllGRI)}
                    />
                </div>
            )}


            {selectedFramework === 'GRI' && (
                <div className="mb-4">
                    {['102', '201', '205', '302', '305', '401', '402', '403', '404', '405', '406', '412', '413', '414', '415', '418'].map((value) => (
                        <div key={value} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`griValue-${value}`}
                                className="mt-1 p-2 border rounded-md"
                                checked={selectedGRIValues.includes(value)}
                                onChange={() => handleGRIValueSelect(value)}
                            />
                            <label htmlFor={`griValue-${value}`} className="ml-2 text-sm">
                                GRI {value}
                            </label>
                        </div>
                    ))}
                </div>
            )}

            {selectedFramework === 'GRI' && selectedGRIValues.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Selected GRI Values</h3>
                    <ul>
                        {selectedGRIValues.map((value) => (
                            <li key={value}>
                                {`GRI ${value}: ${GRI_TEXT_MAP[value] || 'No text available'}`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedFramework === 'GRI' && selectedGRIValues.includes('102') && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Gender statistics: Global Workforce</h3>
                    <table className="border">
                        <thead>
                            {renderTableRow(['', '2019', '2020'], true)}
                        </thead>
                        <tbody>
                            {renderTableRow(['Male', '58%', '58%'])}
                            {renderTableRow(['Female', '41%', '41%'])}
                            {renderTableRow(['Not Disclosed', '1%', '1%'])}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedGRIValues.includes('302') && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Energy Consumption</h3>
                    <table className="border">
                        <thead>
                            {renderTableRow(['', '2019', '2020', 'YoY Change'], true)}
                        </thead>
                        <tbody>
                            {renderTableRow(['Total energy (MWh)', '38,134', '25,201', '-34%'])}
                            {renderTableRow(['Scope 1 – Direct', '', '', ''])}
                            {renderTableRow(['Natural gas (MWh)', '3,990', '1,702', '-57%'])}
                            {renderTableRow(['Other direct (diesel, liquefied petroleum gas) (MWh)', '854', '324', '-62%'])}
                            {renderTableRow(['Scope 2 – Indirect', '', '', ''])}
                            {renderTableRow(['Total electricity consumption from operations (MWh)', '27,984', '18,731', '-33%'])}
                            {renderTableRow(['Renewable electricity use (property portfolio)', '11%', '100%', ''])}
                            {renderTableRow(['Other indirect (purchased steam and cooling) (MWh)', '5,306', '4,444', '-16%'])}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedGRIValues.includes('305') && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Energy Consumption</h3>
                    <table className="border">
                        <thead>
                            {renderTableRow(['', '2019', '2020', 'YoY Change'], true)}
                        </thead>
                        <tbody>
                            {renderTableRow(['Scope 1 (mtCO2e)', '1560', '685', '-56%'])}
                            {renderTableRow(['Scope 2 market-based (mtCO2e)', '10,523', '983', '-91%'])}
                            {renderTableRow(['Scope 2 location-based (mtCO2e)', '11,171', '7,142', '-36%'])}
                            {renderTableRow(['Scope 3 (mtCO2e)', '121,817', '115,942', '-5%'])}
                            {renderTableRow([' Purchased goods and services', '89,963', '101,600', '+13%'])}
                            {renderTableRow([' Capital Goods', '3,522', '9,800', '+178%'])}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedGRIValues.includes('401') && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">New Employee Hires</h3>
                    <table className="border">
                        <thead>
                            {renderTableRow(['', '2018', '2019', '2020'], true)}
                        </thead>
                        <tbody>
                            {renderTableRow(['New Employee Hires', '1,368', '1,771', '1,421'])}
                            {renderTableRow(['Employee Voluantary Turnover', '', '12%', '7%'])}
                            {renderTableRow(['Employee Involuantary Turnover', '', '3%', '4%'])}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedGRIValues.includes('404') && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Absolute Training Hours</h3>
                    <table className="border">
                        <thead>
                            {renderTableRow(['', '2019', '2020'], true)}
                        </thead>
                        <tbody>
                            {renderTableRow(['Absolute number of training hours', '251,109', '205,419'])}
                            {renderTableRow(['Employee Voluantary Turnover', '', '12%', '7%'])}
                            {renderTableRow(['Employee Involuantary Turnover', '', '3%', '4%'])}
                        </tbody>
                    </table>
                    <h3 className="text-xl font-bold mb-2">Average Training Hours</h3>
                    <table className="border">
                        <thead>
                            {renderTableRow(['', '2019', '2020', 'YoY'], true)}
                        </thead>
                        <tbody>
                            {renderTableRow(['Average training hours per employee', '24', '21', '-5'])}
                            {renderTableRow(['Officer', '28', '21', '-7'])}
                            {renderTableRow(['Non Officer', '21', '21', '0'])}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedGRIValues.includes('405') && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Gender Statistics: Board of Directors</h3>
                    <table className="border">
                        <thead>
                            {renderTableRow(['', '2020', '2021'], true)}
                        </thead>
                        <tbody>
                            {renderTableRow(['Female', '3', '3'])}
                            {renderTableRow(['Male', '7', '6'])}
                        </tbody>
                    </table>
                    <h3 className="text-xl font-bold mb-2">Race and ethnicity statistics: Board of Directors</h3>
                    <table className="border">
                        <thead>
                            {renderTableRow(['', '2020', '2021'], true)}
                        </thead>
                        <tbody>
                            {renderTableRow(['Underpresented Groups', '1', '2'])}
                            {renderTableRow(['White', '8', '7'])}
                            {renderTableRow(['Not disclosed', '1'])}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedGRIValues.includes('413') && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Social Investment Dollars</h3>
                    <table className="border">
                        <thead>
                            {renderTableRow(['', '2019', '2020', '2021'], true)}
                        </thead>
                        <tbody>
                            {renderTableRow(['The Moodys Foundation grants', '$4,200,000', '$3,100,100', '$3,832,400'])}
                            {renderTableRow(['Moodys chariable contributions', '$1,100,000', '$908,900', '$1,791,800'])}
                            {renderTableRow(['Value of volunteer hours', '$809,700', '$874,300', '$581,400'])}
                            {renderTableRow(['Value of volunteer hours', '$809,700', '$874,300', '$581,400'])}
                            {renderTableRow(['Number of employee volunteer hours', '', '', '7,842*'])}
                            {renderTableRow(['Employee-driven giving', '$537,000', '$532,500', '$555,300'])}
                            {renderTableRow(['Dollars to support volunteer events', '$127,200', '$168,600', '$143,700'])}
                            {renderTableRow(['Total social investment', '$6,773,900', '$5,584,300', '$6,904,600'])}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedGRIValues.includes('414') && (
                <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Supplier Social Assessment</h3>
                    <table className="border">
                        <thead>
                            {renderTableRow(['', '2019', '2020', '2021'], true)}
                        </thead>
                        <tbody>
                            {renderTableRow(['Diverse supplier spend', '8%', '10%', '8%'])}
                            {renderTableRow(['Women Owned', '0.2%', '0.3%', '4%'])}
                            {renderTableRow(['Small businesses', '1%', '1%', '1%'])}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedFramework && (
                <div className="flex space-x-4">
                    <button
                        className="bg-violet-700 text-violet-50 rounded-lg p-2 hover:bg-violet-600"
                        onClick={handleUploadFramework}
                    >
                        Next
                    </button>
                    <button
                        className="bg-gray-300 text-gray-700 rounded-lg p-2 hover:bg-gray-400"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default FrameworkSelection;
