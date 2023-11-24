'use client';

import React, { useRef, createRef, useLayoutEffect, useState, useEffect } from 'react';
import 'gridstack/dist/gridstack.css';
import 'gridstack/dist/gridstack-extra.css';
import 'gridstack/dist/gridstack-all';
import { GridStack, GridStackOptions, GridStackWidget } from 'gridstack';
import useFileStore from '@/app/_store/fileStore';
import axios from 'axios';
import Papa from 'papaparse';
import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import ContentEditable from 'react-contenteditable'; // Import the ContentEditable component

interface ItemProps {
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  onDelete?: () => void;
}

type ChartDataType = {
  options: ApexOptions;
  series: any;
};

let pieChartData: ChartDataType, barChartData: ChartDataType;

const Item: React.FC<ItemProps> = ({ onDelete }) => {
  const { files } = useFileStore();
  const [csvData, setCsvData] = useState([]);
  const [chartType, setChartType] = useState('');
  const [xFields, setXFields] = useState<string[]>([]);
  const [yField, setYField] = useState('');
  const [yFields, setYFields] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState('');
  const [showTextbox, setShowTextbox] = useState(false);
  const [contentEditableText, setContentEditableText] = useState('');

  const handleToggleTextbox = () => {
    setShowTextbox((prevShowTextbox) => !prevShowTextbox);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCsvData([]);
    const response = await axios.get(`http://localhost:4000/files/${e.target.value}`);
    Papa.parse(response.data, {
      header: true,
      dynamicTyping: true,
      complete: (result: any) => {
        setCsvData(result.data);
      },
    });
  };

  const handleMultipleFields = (selectedField: string, fieldStateUpdater: React.Dispatch<React.SetStateAction<string[]>>) => {
    fieldStateUpdater((prevSelectedFields) => {
      if (prevSelectedFields.includes(selectedField)) {
        return prevSelectedFields.filter((field) => field !== selectedField);
      } else {
        return [...prevSelectedFields, selectedField];
      }
    });
  };

  const handleShowTable = () => {
    setShowTable(!showTable);
  };

  const handleChartTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChartType(e.target.value);
    setChartType(e.target.value);

    // Automatically show the table when "Table" is selected
    if (e.target.value === 'table') {
      setShowTable(true);
    }
  };

  const renderTable = () => {
    if (csvData.length === 0) {
      return null;
    }

    return (
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2">Table</h3>
        <table className="w-full border border-collapse">
          <thead>
            <tr>
              {xFields.map((field) => (
                <th key={field} className="border p-2">
                  {field}
                </th>
              ))}
              {yFields.map((field) => (
                <th key={field} className="border p-2">
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index}>
                {xFields.map((field) => (
                  <td key={field} className="border p-2">
                    {row[field]}
                  </td>
                ))}
                {yFields.map((field) => (
                  <td key={field} className="border p-2">
                    {row[field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (chartType === 'pie') {
    pieChartData = {
      options: {
        labels: csvData.map((row) => row[xFields[0]]),
        legend: {
          show: true,
        },
      },
      series: csvData.map((row) => row[yField]),
    };
  }

  if (chartType === 'bar' || chartType === 'line') {
    barChartData = {
      options: {
        xaxis: {
          categories: csvData.map((row) => row[xFields[0]]),
        },
        stroke: {
          curve: 'smooth',
        },
        markers: {
          shape: 'circle',
          size: 1,
        },
      },
      series: yFields.map((field, idx) => {
        return {
          name: field,
          type: chartType === 'bar' ? 'column' : 'line',
          data: csvData.map((row) => row[field]),
        };
      }),
    };
  }

  return (
    <div className="w-full h-auto p-2 flex-1">
      <div className="flex flex-wrap mb-4">
        <select onChange={handleFileSelect}>
          <option selected disabled>
            Select data source
          </option>
          {files.map((filename, idx) => (
            <option key={idx} value={filename}>
              {filename}
            </option>
          ))}
        </select>

        {csvData.length > 0 && (
          <div>
            <select onChange={handleChartTypeChange}>
              <option selected disabled>
                Select chart type
              </option>
              <option value="pie">Pie Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="table">Table</option>
            </select>
          </div>
        )}

        {chartType && (
          <div className="flex">
            <select multiple onChange={(e) => handleMultipleFields(e.target.value, setXFields)}>
              <option selected disabled>
                Select Labels
              </option>
              {Object.keys(csvData[0]).map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
            {chartType === 'pie' && (
              <select onChange={(e) => setYField(e.target.value)}>
                <option selected disabled>
                  Select Values
                </option>
                {Object.keys(csvData[0]).map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            )}
            {(chartType === 'bar' || chartType === 'line') && (
              <select multiple onChange={(e) => handleMultipleFields(e.target.value, setYFields)}>
                <option selected disabled>
                  Select Values
                </option>
                {Object.keys(csvData[0]).map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <button className="text-white bg-red-600 p-2 rounded-lg" onClick={onDelete}>
          Delete
        </button>
        <button className="text-white bg-blue-500 p-2 rounded-lg ml-2" onClick={handleToggleTextbox}>
          {showTextbox ? 'Remove Textbox' : 'Add Textbox'}
        </button>
      </div>

      {showTextbox ? (
        <div className="mt-4">
          {/* <h3 className="text-lg font-bold mb-2">Content Editable Text</h3> */}
          <ContentEditable
            html={contentEditableText} // bind the value directly
            disabled={false} // use true to disable editing
            onChange={(e) => setContentEditableText(e.target.value)} // handle the change
            className="w-full h p-2"
            style={{ minHeight: '50px', outline: 'none' }}
          />
        </div>
      ) : null}

      {showTable && selectedChartType === 'table' && renderTable()}

      <div className="w-full h-full flex justify-center items-center">
        {chartType && chartType === 'pie' && xFields.length > 0 && yField && (
          <ApexChart options={pieChartData.options} series={pieChartData.series} type={chartType} width={500} height={360} />
        )}

        {chartType && (chartType === 'bar' || chartType === 'line') && xFields.length > 0 && yFields.length > 0 && (
          <ApexChart options={barChartData.options} series={barChartData.series} type="line" width={1024} height={360} />
        )}
      </div>
    </div>
  );
};

interface ControlledStackProps {
  items: Array<ItemProps>;
  addItem: (item: ItemProps) => void;
  changeItems: (items: Array<ItemProps>) => void;
}

export default function Dashboard() {
  const [items1, setItems1] = useState<ItemProps[]>([]);

  const addItemToGrid1 = () => {
    setItems1((prevItems) => {
      const newId = `block-${items1.length + 1}`;
      const newItem: ItemProps = {
        id: newId,
        x: 0,
        y: 0,
        w: 6,
        h: 2,
      };
      return [...prevItems, newItem];
    });
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <button className="text-sm font-bold bg-violet-700 text-violet-50 rounded-lg py-2 px-4" onClick={addItemToGrid1}>
          Add Block
        </button>
      </div>
      <div className="w-full flex">
        <ControlledStack
          items={items1}
          addItem={(item) => {
            setItems1((items) => [...items, item]);
          }}
          changeItems={(items) => setItems1(items)}
        />
      </div>
    </div>
  );
}

const ControlledStack: React.FC<ControlledStackProps> = ({ items, addItem, changeItems }) => {
  const refs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});
  const gridRef = useRef<GridStack | null>(null);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const _ignoreCB = useRef<boolean | undefined>(false);

  refs.current = {};

  if (Object.keys(refs.current).length !== items.length) {
    items.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef();
    });
  }

  useLayoutEffect(() => {
    if (!gridRef.current) {
      const grid = (gridRef.current = GridStack.init(
        {
          float: false,
          acceptWidgets: true,
          disableOneColumnMode: true,
          column: 6,
          minRow: 1,
        },
        gridContainerRef.current!
      )
        .on('added', (ev: any, gsItems: any) => {
          if (_ignoreCB) return;

          gsItems.forEach((n: any) => {
            grid.removeWidget(n.el, true, false);
            addItem({ id: n.id, x: n.x, y: n.y, w: n.w, h: n.h });
          });
        })
        .on('removed change', (ev: any, gsItems: any) => {
          const newItems = grid.save(false) as GridStackOptions;
          const widgetArray = newItems as GridStackWidget[];

          changeItems(
            widgetArray.map((widget) => ({
              id: widget.id ?? '',
              x: widget.x ?? 0,
              y: widget.y ?? 0,
              w: widget.w ?? 1,
              h: widget.h ?? 1,
            }))
          );
        }));
    } else {
      const grid = gridRef.current;
      const layout = items.map((a) => {
        const ref = refs.current[a.id].current;
        if (ref && 'gridstackNode' in ref) {
          return { ...a, el: ref };
        } else {
          return { ...a, el: ref };
        }
      });

      _ignoreCB.current = true;
      grid.load(layout);
      _ignoreCB.current = undefined;
    }
  }, [items, addItem, changeItems]);

  return (
    <div style={{ width: '100%', marginRight: '10px' }}>
      <div className="grid-stack" ref={gridContainerRef}>
        {items.map((item) => (
          <div
            ref={refs.current[item.id]}
            key={item.id}
            className="grid-stack-item"
            gs-id={item.id}
            gs-w={item.w}
            gs-h={item.h}
            gs-x={item.x}
            gs-y={item.y}
          >
            <div className="grid-stack-item-content">
              <Item
                {...item}
                onDelete={() => {
                  const updatedItems = items.filter((i) => i.id !== item.id);
                  changeItems(updatedItems);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const reactSelectCustomStyle = {
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    color: state.isSelected ? 'white' : '',
    border: '2px solid white',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
  }),
};
