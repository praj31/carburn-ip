'use client'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from 'react-modal'
import { Margin, Resolution, usePDF } from 'react-to-pdf'

export default function NewReport() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGRIValues, setSelectedGRIValues] = useState<string[]>([])
  const { toPDF, targetRef } = usePDF({
    filename: 'ESG-report.pdf',
    method: 'open',
    page: { orientation: 'landscape', margin: Margin.MEDIUM },
  })

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const renderTableRow = (
    rowData: string[],
    isHeader: boolean = false,
    highlightedRowIndex: number | null = null
  ) => {
    const RowTag = isHeader ? 'th' : 'td'

    return (
      <tr
        style={
          highlightedRowIndex !== null && highlightedRowIndex === parseInt(rowData[0], 10)
            ? { backgroundColor: '#FFFBEB' }
            : {}
        }>
        {rowData.map((cell, index) => (
          <RowTag key={index} className="p-2 border">
            {cell}
          </RowTag>
        ))}
      </tr>
    )
  }

  const handleGRIValueSelect = (value: string) => {
    setSelectedGRIValues((prevValues) => {
      if (prevValues.includes(value)) {
        return prevValues.filter((v) => v !== value)
      } else {
        return [...prevValues, value]
      }
    })
  }

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">New GRI Report</h2>

        <div className="flex">
          <FontAwesomeIcon
            icon="plus"
            className="w-5 h-5 p-2 bg-purple-100 text-violet-700 rounded-md"
            role="button"
            onClick={openModal}
          />
          <FontAwesomeIcon
            icon="download"
            className="w-5 h-5 p-2 bg-purple-100 text-violet-700 rounded-md ml-2"
            role="button"
            onClick={() => toPDF()}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        contentLabel="Simple Modal"
        className="absolute max-w-md w-full flex flex-col transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-2 top-1/2 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50">
        <div>
          <div className="w-full flex justify-end mb-2">
            <FontAwesomeIcon
              icon="close"
              className="text-gray-400 cursor-pointer"
              size="1x"
              onClick={closeModal}
            />
          </div>
          <div className="w-full mb-2">
            <h2 className="text-xl font-bold mb-2">GRI Standards</h2>
            <p className="text-sm mb-4">
              The following GRI Standards are applicable to your business domain. Select those you
              want to generate report for:
            </p>
          </div>
          {['102', '302', '305', '401', '404', '405', '413', '414'].map((value) => (
            <div key={value} className="flex items-center mb-1">
              <input
                type="checkbox"
                id={`griValue-${value}`}
                className="border rounded-md"
                checked={selectedGRIValues.includes(value)}
                onChange={() => handleGRIValueSelect(value)}
              />
              <label htmlFor={`griValue-${value}`} className="ml-2 text-sm">
                GRI {value}
              </label>
            </div>
          ))}
        </div>
      </Modal>

      <div className="w-full" ref={targetRef}>
        {selectedGRIValues.includes('102') && (
          <div className="mb-8">
            <h4 className="font-bold bg-purple-100 rounded-md mb-2 p-2">GRI 102</h4>
            <h3 className="text-xl font-bold mb-4">Gender Statistics: Global Workforce</h3>
            <table className="border">
              <thead>{renderTableRow(['', '2019', '2020'], true)}</thead>
              <tbody>
                {renderTableRow(['Male', '58%', '58%'])}
                {renderTableRow(['Female', '41%', '41%'])}
                {renderTableRow(['Not Disclosed', '1%', '1%'])}
              </tbody>
            </table>
            <h3 className="text-xl font-bold mb-2">Global Employee Breakdown By Region</h3>
            <table className="border">
              <thead>{renderTableRow(['', '2019', '2020'], true)}</thead>
              <tbody>
                {renderTableRow(['Americas (excluding U.S.)', '633', '681'])}
                {renderTableRow(['Asia-Pacific', '4332', '3401'])}
                {renderTableRow(['EMEA', '3125', '2145'])}
                {renderTableRow(['U.S.', '4356', '4573'])}
              </tbody>
            </table>
          </div>
        )}

        {selectedGRIValues.includes('302') && (
          <div className="mb-8">
            <h4 className="font-bold bg-purple-100 rounded-md mb-2 p-2">GRI 302</h4>
            <h3 className="text-xl font-bold mb-2">Energy Consumption</h3>
            <table className="border">
              <thead>{renderTableRow(['', '2019', '2020', 'YoY Change'], true)}</thead>
              <tbody>
                {renderTableRow(['Total energy (MWh)', '38,134', '25,201', '-34%'])}
                {renderTableRow(['Scope 1 – Direct', '', '', ''])}
                {renderTableRow(['Natural gas (MWh)', '3,990', '1,702', '-57%'])}
                {renderTableRow([
                  'Other direct (diesel, liquefied petroleum gas) (MWh)',
                  '854',
                  '324',
                  '-62%',
                ])}
                {renderTableRow(['Scope 2 – Indirect', '', '', ''])}
                {renderTableRow([
                  'Total electricity consumption from operations (MWh)',
                  '27,984',
                  '18,731',
                  '-33%',
                ])}
                {renderTableRow([
                  'Renewable electricity use (property portfolio)',
                  '11%',
                  '100%',
                  '',
                ])}
                {renderTableRow([
                  'Other indirect (purchased steam and cooling) (MWh)',
                  '5,306',
                  '4,444',
                  '-16%',
                ])}
              </tbody>
            </table>
          </div>
        )}

        {selectedGRIValues.includes('305') && (
          <div className="mb-8">
            <h4 className="font-bold bg-purple-100 rounded-md mb-2 p-2">GRI 305</h4>
            <h3 className="text-xl font-bold mb-2">Energy Emissions</h3>
            <table className="border">
              <thead>{renderTableRow(['', '2019', '2020', 'YoY Change'], true)}</thead>
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
          <div className="mb-8">
            <h4 className="font-bold bg-purple-100 rounded-md mb-2 p-2">GRI 401</h4>
            <h3 className="text-xl font-bold mb-2">New Employee Hires</h3>
            <table className="border">
              <thead>{renderTableRow(['', '2018', '2019', '2020'], true)}</thead>
              <tbody>
                {renderTableRow(['New Employee Hires', '1,368', '1,771', '1,421'])}
                {renderTableRow(['Employee Voluantary Turnover', '', '12%', '7%'])}
                {renderTableRow(['Employee Involuantary Turnover', '', '3%', '4%'])}
              </tbody>
            </table>
          </div>
        )}

        {selectedGRIValues.includes('404') && (
          <div className="mb-8">
            <h4 className="font-bold bg-purple-100 rounded-md mb-2 p-2">GRI 404</h4>
            <h3 className="text-xl font-bold mb-4">Absolute Training Hours</h3>
            <table className="border">
              <thead>{renderTableRow(['', '2019', '2020'], true)}</thead>
              <tbody>
                {renderTableRow(['Absolute number of training hours', '251,109', '205,419'])}
                {renderTableRow(['Employee Voluantary Turnover', '', '12%', '7%'])}
                {renderTableRow(['Employee Involuantary Turnover', '', '3%', '4%'])}
              </tbody>
            </table>
            <h3 className="text-xl font-bold mb-2">Average Training Hours</h3>
            <table className="border">
              <thead>{renderTableRow(['', '2019', '2020', 'YoY'], true)}</thead>
              <tbody>
                {renderTableRow(['Average training hours per employee', '24', '21', '-5'])}
                {renderTableRow(['Officer', '28', '21', '-7'])}
                {renderTableRow(['Non Officer', '21', '21', '0'])}
              </tbody>
            </table>
          </div>
        )}

        {selectedGRIValues.includes('405') && (
          <div className="mb-8">
            <h4 className="font-bold bg-purple-100 rounded-md mb-2 p-2">GRI 405</h4>
            <h3 className="text-xl font-bold mb-4">Gender Statistics: Board of Directors</h3>
            <table className="border">
              <thead>{renderTableRow(['', '2020', '2021'], true)}</thead>
              <tbody>
                {renderTableRow(['Female', '3', '3'])}
                {renderTableRow(['Male', '7', '6'])}
              </tbody>
            </table>
            <h3 className="text-xl font-bold mb-2">
              Race and ethnicity statistics: Board of Directors
            </h3>
            <table className="border">
              <thead>{renderTableRow(['', '2020', '2021'], true)}</thead>
              <tbody>
                {renderTableRow(['Underpresented Groups', '1', '2'])}
                {renderTableRow(['White', '8', '7'])}
                {renderTableRow(['Not disclosed', '1'])}
              </tbody>
            </table>
          </div>
        )}

        {selectedGRIValues.includes('413') && (
          <div className="mb-8">
            <h4 className="font-bold bg-purple-100 rounded-md mb-2 p-2">GRI 413</h4>
            <h3 className="text-xl font-bold mb-2">Social Investment Dollars</h3>
            <table className="border">
              <thead>{renderTableRow(['', '2019', '2020', '2021'], true)}</thead>
              <tbody>
                {renderTableRow([
                  'The Moodys Foundation grants',
                  '$4,200,000',
                  '$3,100,100',
                  '$3,832,400',
                ])}
                {renderTableRow([
                  'Moodys chariable contributions',
                  '$1,100,000',
                  '$908,900',
                  '$1,791,800',
                ])}
                {renderTableRow(['Value of volunteer hours', '$809,700', '$874,300', '$581,400'])}
                {renderTableRow(['Value of volunteer hours', '$809,700', '$874,300', '$581,400'])}
                {renderTableRow(['Number of employee volunteer hours', '', '', '7,842*'])}
                {renderTableRow(['Employee-driven giving', '$537,000', '$532,500', '$555,300'])}
                {renderTableRow([
                  'Dollars to support volunteer events',
                  '$127,200',
                  '$168,600',
                  '$143,700',
                ])}
                {renderTableRow([
                  'Total social investment',
                  '$6,773,900',
                  '$5,584,300',
                  '$6,904,600',
                ])}
              </tbody>
            </table>
          </div>
        )}

        {selectedGRIValues.includes('414') && (
          <div className="mb-8">
            <h4 className="font-bold bg-purple-100 rounded-md mb-2 p-2">GRI 414</h4>
            <h3 className="text-xl font-bold mb-2">Supplier Social Assessment</h3>
            <table className="border">
              <thead>{renderTableRow(['', '2019', '2020', '2021'], true)}</thead>
              <tbody>
                {renderTableRow(['Diverse supplier spend', '8%', '10%', '8%'])}
                {renderTableRow(['Women Owned', '0.2%', '0.3%', '4%'])}
                {renderTableRow(['Small businesses', '1%', '1%', '1%'])}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
