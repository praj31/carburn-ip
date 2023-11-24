'use client'

import React, { useRef, createRef, useLayoutEffect, useState, RefObject } from 'react'
import 'gridstack/dist/gridstack.css'
import 'gridstack/dist/gridstack-extra.css'
import 'gridstack/dist/gridstack-all'
import { GridStack, GridStackOptions, GridStackWidget } from 'gridstack'
import useFileStore from '@/app/_store/fileStore'
import axios from 'axios'
import Papa from 'papaparse'
import ApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHover } from 'usehooks-ts'
import cx from 'classnames'
import { Margin, usePDF } from 'react-to-pdf'

interface IMyGridStackWidget extends GridStackWidget {
  mode: 'chart' | 'text' | 'table'
}

interface ItemProps {
  id: string
  x: number
  y: number
  w?: number
  h?: number
  onDelete?: () => void
  onRequestClose?: () => void
  isOpen?: boolean
  mode?: 'chart' | 'text' | 'table'
}

type ChartDataType = {
  options: ApexOptions
  series: any
}

let pieChartData: ChartDataType, barChartData: ChartDataType

// type SelectType = {
//   label: string
//   value: string
// }

const Item: React.FC<ItemProps> = ({ onDelete, onRequestClose, mode }) => {
  const gridItem = useRef(null)
  const gridItemHover = useHover(gridItem)

  const { files } = useFileStore()
  // const files: SelectType[] = datafiles.map((label) => ({ value: label, label }))
  // const [dataSource, setDataSource] = useState<SelectType>({
  // label: '',
  // value: '',
  // })
  const [csvData, setCsvData] = useState([])
  const [chartType, setChartType] = useState('')
  const [xField, setXField] = useState('')
  const [yField, setYField] = useState('')
  const [yFields, setYFields] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setCurrentPage(1)
    setIsModalOpen(false)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCsvData([])
    const response = await axios.get(`http://localhost:4000/files/${e.target.value}`)
    Papa.parse(response.data, {
      header: true,
      dynamicTyping: true,
      complete: (result: any) => {
        setCsvData(result.data)
      },
    })
  }

  const handleMultipleFields = (selectedField: string) => {
    setYFields((prevSelectedFields) => {
      // Add or remove the selected field based on the current state
      if (prevSelectedFields.includes(selectedField)) {
        return yFields.filter((field: any) => field !== selectedField)
      } else {
        return [...yFields, selectedField]
      }
    })
  }

  if (chartType === 'pie') {
    pieChartData = {
      options: {
        labels: csvData.map((row) => row[xField]),
        legend: {
          show: true,
          floating: true,
        },
      },
      series: csvData.map((row) => row[yField]),
    }
  }

  if (chartType === 'bar' || chartType === 'line') {
    barChartData = {
      options: {
        xaxis: {
          categories: csvData.map((row) => row[xField]),
        },
        stroke: {
          curve: 'smooth',
        },
        markers: {
          shape: 'circle',
          size: 1,
        },
      },
      series: yFields.map((field, _) => {
        return {
          name: field,
          type: chartType === 'bar' ? 'column' : 'line',
          data: csvData.map((row) => row[field]),
        }
      }),
    }
  }

  if (mode === 'text') {
    return (
      <div className={cx('griditemx w-full h-full flex-1')} ref={gridItem}>
        <FontAwesomeIcon
          icon="trash-alt"
          className={cx(
            'absolute w-5 h-5 text-red-600 cursor-pointer top-4 right-3 z-10',
            gridItemHover ? 'opacity-100' : 'opacity-0border-t border-gray-300 pt-2'
          )}
          onClick={onDelete}
        />
        <p contentEditable>Your text goes here</p>
      </div>
    )
  }

  if (mode === 'table') {
    return (
      <div
        className={cx(
          'griditemx w-full h-full flex-1',
          csvData.length > 0 ? 'bg-white' : 'bg-purple-50'
        )}
        ref={gridItem}>
        <FontAwesomeIcon
          icon="cog"
          className={cx(
            'absolute w-5 h-5 text-gray-400 cursor-pointer top-4 right-10 z-10',
            gridItemHover ? 'opacity-100' : 'opacity-0'
          )}
          onClick={openModal}
        />
        <FontAwesomeIcon
          icon="trash-alt"
          className={cx(
            'absolute w-5 h-5 text-red-600 cursor-pointer top-4 right-3 z-10',
            gridItemHover ? 'opacity-100' : 'opacity-0'
          )}
          onClick={onDelete}
        />
        <Modal
          isOpen={isModalOpen}
          onRequestClose={onRequestClose}
          contentLabel="Simple Modal"
          className="absolute max-w-md w-full flex flex-col transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-2 top-1/2 left-1/2"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50">
          <div className="w-full flex justify-end">
            <FontAwesomeIcon
              icon="close"
              className="text-gray-400 cursor-pointer"
              size="1x"
              onClick={closeModal}
            />
          </div>

          <div className="py-4">
            <select onChange={handleFileSelect} className="border rounded-md mt-1 p-2 mb-2">
              <option selected disabled>
                Select data source
              </option>
              {files.map((filename, idx) => (
                <option key={idx} value={filename}>
                  {filename}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full flex justify-end border-t border-gray-300 pt-2">
            <button
              className={cx(
                'w-fit rounded bg-purple-700 text-white cursor-pointer ml-2 px-4 py-2 hover:bg-purple-800'
              )}
              onClick={closeModal}>
              Submit
            </button>
          </div>
        </Modal>

        {csvData.length > 0 && (
          <table className="w-full table-auto border border-collapse">
            <thead>
              <tr className="bg-purple-700 text-white">
                {Object.keys(csvData[0] || {}).map((header, index) => (
                  <th key={index} className="p-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value: any, columnIndex) => (
                    <td key={columnIndex} className="text-center p-2">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    )
  }

  return (
    <div
      className={cx(
        'griditemx w-full h-full flex-1',
        xField && (yField || yFields) ? 'bg-white' : 'bg-purple-50'
      )}
      ref={gridItem}>
      <FontAwesomeIcon
        icon="cog"
        className={cx(
          'absolute w-5 h-5 text-gray-400 cursor-pointer top-4 right-10 z-10',
          gridItemHover ? 'opacity-100' : 'opacity-0'
        )}
        onClick={openModal}
      />
      <FontAwesomeIcon
        icon="trash-alt"
        className={cx(
          'absolute w-5 h-5 text-red-600 cursor-pointer top-4 right-3 z-10',
          gridItemHover ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onDelete}
      />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={onRequestClose}
        contentLabel="Simple Modal"
        className="absolute max-w-md w-full flex flex-col transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-2 top-1/2 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50">
        <div className="w-full flex justify-end">
          <FontAwesomeIcon
            icon="close"
            className="text-gray-400 cursor-pointer"
            size="1x"
            onClick={closeModal}
          />
        </div>

        <div className="py-4">
          {currentPage === 1 && (
            <select onChange={handleFileSelect} className="border rounded-md mt-1 p-2 mb-2">
              <option selected disabled>
                Select data source
              </option>
              {files.map((filename, idx) => (
                <option key={idx} value={filename}>
                  {filename}
                </option>
              ))}
            </select>
          )}

          {currentPage === 2 &&
            (csvData.length > 0 ? (
              <select
                onChange={(e) => setChartType(e.target.value)}
                className="border rounded-md mt-1 p-2 mb-2">
                <option selected disabled>
                  Select chart type
                </option>
                <option value="pie">Pie Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
            ) : (
              <p>Please select a data source!</p>
            ))}

          {currentPage === 3 &&
            (chartType ? (
              <div className="flex flex-col">
                <select
                  onChange={(e) => setXField(e.target.value)}
                  className="border rounded-md mt-1 p-2 mb-2">
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
                  <select
                    onChange={(e) => setYField(e.target.value)}
                    className="border rounded-md mt-1 p-2 mb-2">
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
                  <select
                    multiple
                    onChange={(e) => handleMultipleFields(e.target.value)}
                    className="border rounded-md mt-1 p-2 mb-2">
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
            ) : (
              <p>Please select a chart type!</p>
            ))}
        </div>

        <div className="w-full flex justify-between border-t border-gray-300 pt-2">
          <button
            disabled={currentPage === 0}
            className="w-fit rounded bg-slate-300 cursor-pointer px-4 py-2 hover:bg-slate-400"
            onClick={prevPage}>
            Back
          </button>

          <button
            className={cx(
              'w-fit rounded bg-purple-700 text-white cursor-pointer ml-2 px-4 py-2 hover:bg-slate-800',
              currentPage === 3 ? 'hidden' : 'block'
            )}
            onClick={nextPage}>
            Next
          </button>

          <button
            className={cx(
              'w-fit rounded bg-purple-700 text-white cursor-pointer ml-2 px-4 py-2 hover:bg-purple-800',
              currentPage === 3 ? 'block' : 'hidden'
            )}
            onClick={closeModal}>
            Submit
          </button>
        </div>
      </Modal>

      {/* <Select
          placeholder="Select data source"
          value={dataSource}
          onChange={(selected) => setDataSource(selected!)}
          options={files}
          styles={reactSelectCustomStyle}
        /> */}
      {chartType && chartType === 'pie' && xField && yField && (
        <>
          <p
            className="absolute w-full font-bold text-center bottom-0 left-1/2 -translate-x-1/2 -translate-y-2"
            contentEditable>
            Chart Title
          </p>
          <ApexChart
            options={pieChartData.options}
            series={pieChartData.series}
            type={chartType}
            width="100%"
            height="100%"
          />
        </>
      )}

      {chartType && (chartType === 'bar' || chartType === 'line') && xField && yFields && (
        <>
          <p
            className="absolute w-full font-bold text-center bottom-0 left-1/2 -translate-x-1/2 -translate-y-2"
            contentEditable>
            Chart Title
          </p>
          <ApexChart options={barChartData.options} series={barChartData.series} type="line" />
        </>
      )}
    </div>
  )
}

interface ControlledStackProps {
  items: Array<ItemProps>
  addItem: (item: ItemProps) => void
  changeItems: (items: Array<ItemProps>) => void
  gridContainerRef: RefObject<HTMLDivElement>
}

export default function Dashboard() {
  const [items, setItems] = useState<ItemProps[]>([])
  const { toPDF, targetRef } = usePDF({
    filename: 'dashboard-report.pdf',
    method: 'open',
    page: { orientation: 'landscape', margin: Margin.MEDIUM },
  })

  const addItemToGrid = (mode: 'chart' | 'text' | 'table') => {
    setItems((prevItems) => {
      const newId = `block-${items.length + 1}`
      const newItem: ItemProps = {
        id: newId,
        x: 0,
        y: 0,
        w: 6,
        h: 2,
        mode,
      }
      return [...prevItems, newItem]
    })
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="flex">
          <FontAwesomeIcon
            icon="chart-area"
            className="w-5 h-5 p-2 bg-purple-100 text-violet-700 rounded-md"
            role="button"
            onClick={() => addItemToGrid('chart')}
          />
          <FontAwesomeIcon
            icon="pen"
            className="w-5 h-5 p-2 bg-purple-100 text-violet-700 rounded-md ml-2"
            role="button"
            onClick={() => addItemToGrid('text')}
          />
          <FontAwesomeIcon
            icon="table"
            className="w-5 h-5 p-2 bg-purple-100 text-violet-700 rounded-md ml-2"
            role="button"
            onClick={() => addItemToGrid('table')}
          />
          <FontAwesomeIcon
            icon="download"
            className="w-5 h-5 p-2 bg-purple-100 text-violet-700 rounded-md ml-2"
            role="button"
            onClick={() => toPDF()}
          />
        </div>
      </div>
      <div className="w-full flex">
        <ControlledStack
          gridContainerRef={targetRef}
          items={items}
          addItem={(item) => {
            setItems((allitems) => [...allitems, item])
          }}
          changeItems={(allitems) => setItems(allitems)}
        />
      </div>
    </div>
  )
}

const ControlledStack = (props: ControlledStackProps) => {
  const { items, addItem, changeItems, gridContainerRef } = props
  const refs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({})
  const gridRef = useRef<GridStack | null>(null)

  const _ignoreCB = useRef<boolean | undefined>(false)

  refs.current = {}

  if (Object.keys(refs.current).length !== items.length) {
    items.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef()
    })
  }

  useLayoutEffect(() => {
    if (!gridRef.current && gridContainerRef.current) {
      const grid = (gridRef.current = GridStack.init(
        {
          float: false,
          acceptWidgets: true,
          disableOneColumnMode: true,
          column: 6,
          minRow: 1,
        },
        gridContainerRef.current
      )
        .on('added', (ev: any, gsItems: any) => {
          if (_ignoreCB) return

          gsItems.forEach((n: any) => {
            grid.removeWidget(n.el, true, false)
            addItem({ id: n.id, x: n.x, y: n.y, w: n.w, h: n.h, mode: n.mode })
          })
        })
        .on('removed change', (_: any, __: any) => {
          const newItems = grid.save(false) as GridStackOptions // Save as GridStackOptions
          const widgetArray = newItems as IMyGridStackWidget[] // Extract the array of widgets
          changeItems(
            widgetArray.map((widget) => ({
              id: widget.id ?? '',
              x: widget.x ?? 0,
              y: widget.y ?? 0,
              w: widget.w ?? 1,
              h: widget.h ?? 1,
              mode: widget.mode,
            }))
          )
        }))
    } else {
      const grid = gridRef.current
      const layout = items.map((a) => {
        const ref = refs.current[a.id].current
        if (ref && 'gridstackNode' in ref) {
          // If 'gridstackNode' is available, use it
          return { ...a, el: ref }
        } else {
          // Otherwise, use the original object
          return { ...a, el: ref }
        }
      })

      _ignoreCB.current = true
      grid!.load(layout)
      _ignoreCB.current = undefined
    }
  }, [items, addItem, changeItems])

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
            gs-y={item.y}>
            <div className="grid-stack-item-content">
              <Item
                {...item}
                onDelete={() => {
                  const updatedItems = items.filter((i) => i.id !== item.id)
                  changeItems(updatedItems)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const reactSelectCustomStyle = {
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    color: state.isSelected ? 'white' : '',
    border: '2px solid white',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
  }),
}
