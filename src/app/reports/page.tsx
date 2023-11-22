'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import useFileStore from '@/app/_store/fileStore';
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
        '201': 'Some GRI 201 Text',
        '205': 'Some GRI 205 Text',
        '302': 'Energy Consumption',
        '305': 'Scope 3 Emissions',
        // Add text for other GRI values
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
            setSelectedGRIValues([value]);
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
                            {renderTableRow(['Scope 3 (mtCO2e)', '121,817', '115,942', '-5%'])}
                            {renderTableRow([' Purchased goods and services', '89,963', '101,600', '+13%'])}
                            {renderTableRow([' Capital Goods', '3,522', '9,800', '+178%'])}
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



// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import useFileStore from '@/app/_store/fileStore';

// const FrameworkSelection: React.FC = () => {
//     const files = useFileStore((state) => state.files);
//     const { fetchFiles } = useFileStore();

//     const uploadRef = useRef<HTMLInputElement>(null);

//     const [selectedFramework, setSelectedFramework] = useState<string>('');
//     const [selectedGRIValues, setSelectedGRIValues] = useState<string[]>([]);
//     const [selectAllGRI, setSelectAllGRI] = useState(false);

//     // Variable to store all selected GRI values
//     const allSelectedGRIValues = selectedGRIValues.join(',');

//     const handleFrameworkSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedValue = event.target.value;
//         setSelectedFramework(selectedValue);
//     };

//     const handleGRIValueSelect = (value: string) => {
//         if (selectAllGRI) {
//             // If "Select All" is checked, clear the selection and add the selected value
//             setSelectedGRIValues([value]);
//             setSelectAllGRI(false);
//         } else {
//             // Toggle the selection for individual values
//             setSelectedGRIValues((prevValues) => {
//                 if (prevValues.includes(value)) {
//                     // Remove the value if already selected
//                     return prevValues.filter((v) => v !== value);
//                 } else {
//                     // Add the value if not selected
//                     return [...prevValues, value];
//                 }
//             });
//         }
//         console.log(selectedGRIValues);
//     };

//     const handleUploadFramework = async () => {
//         try {
//             console.log('Selected GRI Values:', selectedGRIValues); // Log selected GRI values
//             const response = await axios.post('http://localhost:4000/uploadFramework', {
//                 framework: selectedFramework,
//                 selectedGRIValues,
//             });

//             if (response.status === 201) {
//                 fetchFiles();

//                 // Redirect to the page for the selected GRI values
//                 // router.push(`/gri/${allSelectedGRIValues}`);
//             }
//         } catch (error) {
//             console.error('Error uploading framework:', error);
//         }
//     };

//     const handleCancel = () => {
//         setSelectedFramework('');
//         setSelectedGRIValues([]);
//         setSelectAllGRI(false);
//     };

//     useEffect(() => {
//         console.log('Selected GRI Values (Effect):', selectedGRIValues); // Log selected GRI values on effect
//     }, [selectedGRIValues]);

//     return (
//         <div className="w-full">
//             <h2 className="text-2xl font-bold mb-4">ESG Framework Selection</h2>

//             <div className="mb-4">
//                 <label htmlFor="frameworkSelect" className="block text-sm font-medium text-gray-700">
//                     Choose a Framework:
//                 </label>
//                 <select
//                     id="frameworkSelect"
//                     name="frameworkSelect"
//                     className="mt-1 p-2 border rounded-md"
//                     value={selectedFramework}
//                     onChange={handleFrameworkSelect}
//                 >
//                     <option value="">Select...</option>
//                     <option value="GRI">GRI Framework</option>
//                     <option value="TFTD">TFTD Framework</option>
//                     <option value="SASB">SASB Framework</option>
//                     <option value="UN SDG">UN SDG Framework</option>
//                 </select>
//             </div>

//             {selectedFramework === 'GRI' && (
//                 <div className="mb-4">
//                     <label htmlFor="selectAllGRI" className="block text-sm font-medium text-gray-700">
//                         Select All GRI Values
//                     </label>
//                     <input
//                         id="selectAllGRI"
//                         type="checkbox"
//                         className="mt-1 p-2 border rounded-md"
//                         checked={selectAllGRI}
//                         onChange={() => setSelectAllGRI(!selectAllGRI)}
//                     />
//                 </div>
//             )}

//             {selectedFramework === 'GRI' && (
//                 <div className="mb-4">
//                     {['102', '201', '205', '302', '308', '401', '402', '403', '404', '405', '406', '412', '413', '414', '415', '418'].map((value) => (
//                         <div key={value} className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 id={`griValue-${value}`}
//                                 className="mt-1 p-2 border rounded-md"
//                                 checked={selectedGRIValues.includes(value)}
//                                 onChange={() => handleGRIValueSelect(value)}
//                             />
//                             <label htmlFor={`griValue-${value}`} className="ml-2 text-sm">
//                                 GRI {value}
//                             </label>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {selectedFramework && (
//                 <div className="flex space-x-4">
//                     <button
//                         className="bg-violet-700 text-violet-50 rounded-lg p-2 hover:bg-violet-600"
//                         onClick={handleUploadFramework}
//                     >
//                         Next
//                     </button>
//                     <button
//                         className="bg-gray-300 text-gray-700 rounded-lg p-2 hover:bg-gray-400"
//                         onClick={handleCancel}
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FrameworkSelection;




// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import useFileStore from '@/app/_store/fileStore';
// import { useRouter } from 'next/router';

// const FrameworkSelection: React.FC = () => {
//     const router = useRouter();
//     const files = useFileStore((state) => state.files);
//     const { fetchFiles } = useFileStore();

//     const uploadRef = useRef<HTMLInputElement>(null);

//     const [selectedFramework, setSelectedFramework] = useState<string>('');
//     const [selectedGRIValues, setSelectedGRIValues] = useState<string[]>([]);
//     const [selectAllGRI, setSelectAllGRI] = useState(false);

//     const handleFrameworkSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedValue = event.target.value;
//         setSelectedFramework(selectedValue);
//     };

//     const handleGRIValueSelect = (value: string) => {
//         if (selectAllGRI) {
//             // If "Select All" is checked, clear the selection and add the selected value
//             setSelectedGRIValues([value]);
//             setSelectAllGRI(false);
//         } else {
//             // Toggle the selection for individual values
//             setSelectedGRIValues((prevValues) => {
//                 if (prevValues.includes(value)) {
//                     // Remove the value if already selected
//                     return prevValues.filter((v) => v !== value);
//                 } else {
//                     // Add the value if not selected
//                     return [...prevValues, value];
//                 }
//             });
//         }
//     };

//     const handleUploadFramework = async () => {
//         try {
//             const response = await axios.post('http://localhost:4000/uploadFramework', {
//                 framework: selectedFramework,
//                 selectedGRIValues,
//             });

//             if (response.status === 201) {
//                 fetchFiles();

//                 // Redirect to the page for the selected GRI values
//                 router.push(`/gri/${selectedGRIValues.join('-')}`);
//             }
//         } catch (error) {
//             console.error('Error uploading framework:', error);
//         }
//     };

//     const handleCancel = () => {
//         setSelectedFramework('');
//         setSelectedGRIValues([]);
//         setSelectAllGRI(false);
//     };

//     return (
//         <div className="w-full">
//             <h2 className="text-2xl font-bold mb-4">ESG Framework Selection</h2>

//             <div className="mb-4">
//                 <label htmlFor="frameworkSelect" className="block text-sm font-medium text-gray-700">
//                     Choose a Framework:
//                 </label>
//                 <select
//                     id="frameworkSelect"
//                     name="frameworkSelect"
//                     className="mt-1 p-2 border rounded-md"
//                     value={selectedFramework}
//                     onChange={handleFrameworkSelect}
//                 >
//                     <option value="">Select...</option>
//                     <option value="GRI">GRI Framework</option>
//                     <option value="TFTD">TFTD Framework</option>
//                     <option value="SASB">SASB Framework</option>
//                     <option value="UN SDG">UN SDG Framework</option>
//                 </select>
//             </div>

//             {selectedFramework === 'GRI' && (
//                 <div className="mb-4">
//                     <label htmlFor="selectAllGRI" className="block text-sm font-medium text-gray-700">
//                         Select All GRI Values
//                     </label>
//                     <input
//                         id="selectAllGRI"
//                         type="checkbox"
//                         className="mt-1 p-2 border rounded-md"
//                         checked={selectAllGRI}
//                         onChange={() => setSelectAllGRI(!selectAllGRI)}
//                     />
//                 </div>
//             )}

//             {selectedFramework === 'GRI' && (
//                 <div className="mb-4">
//                     {['102', '103', '104'].map((value) => (
//                         <div key={value} className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 id={`griValue-${value}`}
//                                 className="mt-1 p-2 border rounded-md"
//                                 checked={selectedGRIValues.includes(value)}
//                                 onChange={() => handleGRIValueSelect(value)}
//                             />
//                             <label htmlFor={`griValue-${value}`} className="ml-2 text-sm">
//                                 GRI {value}
//                             </label>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {selectedFramework && (
//                 <div className="flex space-x-4">
//                     <button
//                         className="bg-violet-700 text-violet-50 rounded-lg p-2 hover:bg-violet-600"
//                         onClick={handleUploadFramework}
//                     >
//                         Next
//                     </button>
//                     <button
//                         className="bg-gray-300 text-gray-700 rounded-lg p-2 hover:bg-gray-400"
//                         onClick={handleCancel}
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FrameworkSelection;


// 'use client';

// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import useFileStore from '@/app/_store/fileStore';

// const FrameworkSelection: React.FC = () => {
//     const files = useFileStore((state) => state.files);
//     const { fetchFiles } = useFileStore();

//     const uploadRef = useRef<HTMLInputElement>(null);

//     const [selectedFramework, setSelectedFramework] = useState<string>('');
//     const [selectedGRIValues, setSelectedGRIValues] = useState<string[]>([]);
//     const [selectAllGRI, setSelectAllGRI] = useState(false);

//     const handleFrameworkSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedValue = event.target.value;
//         setSelectedFramework(selectedValue);
//         setSelectAllGRI(false);
//     };

//     const handleGRIValueSelect = (value: string) => {
//         if (selectedGRIValues.includes(value)) {
//             setSelectedGRIValues(selectedGRIValues.filter((v) => v !== value));
//         } else {
//             setSelectedGRIValues([...selectedGRIValues, value]);
//         }
//     };

//     const handleSelectAllGRI = () => {
//         setSelectAllGRI(!selectAllGRI);
//         setSelectedGRIValues(selectAllGRI ? [] : ['102', '201', '205', '302', '308', '401', '402', '403', '404', '405', '406', '412', '413', '414', '415', '418']);
//     };

//     const handleUploadFramework = async () => {
//         try {
//             const response = await axios.post('http://localhost:4000/uploadFramework', {
//                 framework: selectedFramework,
//                 selectedGRIValues,
//             });

//             if (response.status === 201) {
//                 fetchFiles();
//             }
//         } catch (error) {
//             console.error('Error uploading framework:', error);
//         }
//     };

//     const handleCancel = () => {
//         setSelectedFramework('');
//         setSelectedGRIValues([]);
//         setSelectAllGRI(false);
//     };

//     return (
//         <div className="w-full">
//             <h2 className="text-2xl font-bold mb-4">ESG Framework Selection</h2>

//             <div className="mb-4">
//                 <label htmlFor="frameworkSelect" className="block text-sm font-medium text-gray-700">
//                     Choose a Framework:
//                 </label>
//                 <select
//                     id="frameworkSelect"
//                     name="frameworkSelect"
//                     className="mt-1 p-2 border rounded-md"
//                     value={selectedFramework}
//                     onChange={handleFrameworkSelect}
//                 >
//                     <option value="">Select...</option>
//                     <option value="GRI">GRI Framework</option>
//                     <option value="TFTD">TFTD Framework</option>
//                     <option value="SASB">SASB Framework</option>
//                     <option value="UN SDG">UN SDG Framework</option>
//                 </select>
//             </div>

//             {selectedFramework === 'GRI' && (
//                 <div className="mb-4">
//                     <label htmlFor="griValues" className="block text-sm font-medium text-gray-700">
//                         Choose GRI Values:
//                     </label>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectAllGRI}
//                                 onChange={handleSelectAllGRI}
//                             />
//                             Select All
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('102')}
//                                 onChange={() => handleGRIValueSelect('102')}
//                             />
//                             GRI 102
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('201')}
//                                 onChange={() => handleGRIValueSelect('201')}
//                             />
//                             GRI 201
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('205')}
//                                 onChange={() => handleGRIValueSelect('205')}
//                             />
//                             GRI 205
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('302')}
//                                 onChange={() => handleGRIValueSelect('302')}
//                             />
//                             GRI 302
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('308')}
//                                 onChange={() => handleGRIValueSelect('308')}
//                             />
//                             GRI 308
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('401')}
//                                 onChange={() => handleGRIValueSelect('401')}
//                             />
//                             GRI 401
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('402')}
//                                 onChange={() => handleGRIValueSelect('402')}
//                             />
//                             GRI 402
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('403')}
//                                 onChange={() => handleGRIValueSelect('403')}
//                             />
//                             GRI 403
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('404')}
//                                 onChange={() => handleGRIValueSelect('404')}
//                             />
//                             GRI 404
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('405')}
//                                 onChange={() => handleGRIValueSelect('405')}
//                             />
//                             GRI 405
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('406')}
//                                 onChange={() => handleGRIValueSelect('406')}
//                             />
//                             GRI 406
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('412')}
//                                 onChange={() => handleGRIValueSelect('412')}
//                             />
//                             GRI 412
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('413')}
//                                 onChange={() => handleGRIValueSelect('413')}
//                             />
//                             GRI 413
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('414')}
//                                 onChange={() => handleGRIValueSelect('414')}
//                             />
//                             GRI 414
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('415')}
//                                 onChange={() => handleGRIValueSelect('415')}
//                             />
//                             GRI 415
//                         </label>
//                     </div>
//                     <div>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedGRIValues.includes('418')}
//                                 onChange={() => handleGRIValueSelect('418')}
//                             />
//                             GRI 418
//                         </label>
//                     </div>
//                 </div>
//             )}

//             {selectedFramework && (
//                 <div className="flex space-x-4">
//                     <button
//                         className="bg-violet-700 text-violet-50 rounded-lg p-2 hover:bg-violet-600"
//                         onClick={handleUploadFramework}
//                     >
//                         Next
//                     </button>
//                     <button
//                         className="bg-gray-300 text-gray-700 rounded-lg p-2 hover:bg-gray-400"
//                         onClick={handleCancel}
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FrameworkSelection;


// 'use client';

// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import useFileStore from '@/app/_store/fileStore';

// const FrameworkSelection: React.FC = () => {
//     const files = useFileStore((state) => state.files);
//     const { fetchFiles } = useFileStore();

//     const uploadRef = useRef<HTMLInputElement>(null);

//     const [selectedFramework, setSelectedFramework] = useState<string>('');
//     const [selectedGRIValue, setSelectedGRIValue] = useState<string>('');


//     const handleFrameworkSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         const selectedValue = event.target.value;
//         setSelectedFramework(selectedValue);
//     };

//     const handleUploadFramework = async () => {
//         try {
//             const response = await axios.post('http://localhost:4000/uploadFramework', {
//                 framework: selectedFramework,
//             });

//             if (response.status === 201) {
//                 fetchFiles();
//             }
//         } catch (error) {
//             console.error('Error uploading framework:', error);
//         }
//     };

//     const handleCancel = () => {
//         setSelectedFramework('');
//     };

//     return (
//         <div className="w-full">
//             <h2 className="text-2xl font-bold mb-4">ESG Framework Selection</h2>

//             <div className="mb-4">
//                 <label htmlFor="frameworkSelect" className="block text-sm font-medium text-gray-700">
//                     Choose a Framework:
//                 </label>
//                 <select
//                     id="frameworkSelect"
//                     name="frameworkSelect"
//                     className="mt-1 p-2 border rounded-md"
//                     value={selectedFramework}
//                     onChange={handleFrameworkSelect}
//                 >
//                     <option value="">Select...</option>
//                     <option value="GRI">GRI Framework</option>
//                     <option value="TFTD">TFTD Framework</option>
//                     <option value="SASB">SASB Framework</option>
//                     <option value="UN SDG">UN SDG Framework</option>
//                 </select>
//             </div>

//             {selectedFramework === 'GRI' && (
//                 <div className="mb-4">
//                     <label htmlFor="griValue" className="block text-sm font-medium text-gray-700">
//                         Choose a GRI Value:
//                     </label>
//                     <select
//                         id="griValue"
//                         name="griValue"
//                         className="mt-1 p-2 border rounded-md"
//                         value={selectedGRIValue}
//                         onChange={(e) => setSelectedGRIValue(e.target.value)}
//                     >
//                         <option value="">Select...</option>
//                         <option value="102">GRI 102</option>
//                         <option value="103">GRI 103</option>
//                         {/* Add more options as needed */}
//                     </select>
//                 </div>
//             )}

//             {selectedFramework && (
//                 <div className="flex space-x-4">
//                     <button
//                         className="bg-violet-700 text-violet-50 rounded-lg p-2 hover:bg-violet-600"
//                         onClick={handleUploadFramework}
//                     >
//                         Next
//                     </button>
//                     <button
//                         className="bg-gray-300 text-gray-700 rounded-lg p-2 hover:bg-gray-400"
//                         onClick={handleCancel}
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FrameworkSelection;



