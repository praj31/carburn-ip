'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const FrameworkSelection: React.FC = () => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Reports</h2>

        {/* <select
          id="frameworkSelect"
          name="frameworkSelect"
          className="border rounded-md mt-1 p-2  mb-2"
          value={selectedFramework}
          onChange={handleFrameworkSelect}>

          <option value="">Select...</option>
          <option value="GRI">GRI Framework</option>
          <option value="TFTD">TFTD Framework</option>
          <option value="SASB">SASB Framework</option>
          <option value="UN SDG">UN SDG Framework</option>
        </select> */}
      </div>

      <h2 className="text-xl font-medium mb-2">Select Framework for New ESG Report</h2>
      <div className="w-full flex flex-wrap mb-8">
        {['GRI', 'TFTD', 'SASB', 'UN SDG'].map((item, idx) => (
          <Link href="/reports/new">
            <div
              key={idx}
              className="w-48 h-48 flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 hover:shadow-xl rounded-2xl cursor-pointer mr-4 mb-2">
              <FontAwesomeIcon icon="plus" className="w-8 h-8 text-purple-700 mb-4" />
              <p className="text-xl text-center font-medium">{item}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-medium mb-2">Previous Years ESG Reports</h2>
      <div className="w-full flex flex-wrap mb-8">
        {['2019', '2020', '2021', '2022'].map((item, idx) => (
          <Link
            href="https://www.moodys.com/sites/products/ProductAttachments/Sustainability/2020%20GRI%20Report.pdf"
            target="_blank">
            <div className="w-48 flex flex-col justify-center items-center">
              <div
                key={idx}
                className="w-36 h-36 flex items-center justify-center bg-purple-100 hover:bg-purple-200 hover:shadow-xl rounded-2xl cursor-pointer mr-4 mb-2">
                <FontAwesomeIcon icon="file-pdf" className="w-12 h-12 text-purple-700 mb-4" />
              </div>

              <p className="text-center">{`ESG-Report-${item}.pdf`}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FrameworkSelection

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
