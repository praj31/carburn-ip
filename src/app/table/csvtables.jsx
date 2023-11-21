// components/CsvTable.js
import React, { useState } from 'react'

const CsvTable = ({ data }) => {
  const rowsPerPage = 5 // Adjust the number of rows per page as needed
  const [currentPage, setCurrentPage] = useState(1)

  if (!data || data.length === 0) {
    return <p>No data to display</p>
  }

  const totalPages = Math.ceil(data.length / rowsPerPage)
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            {Object.keys(data[0]).map((header) => (
              <th key={header} style={tableHeaderStyle}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((key) => (
                <td key={key} style={tableCellStyle}>
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={paginationContainerStyle}>
        <span style={paginationText}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={paginationButtonStyle}>
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={paginationButtonStyle}>
          Next
        </button>
      </div>
    </div>
  )
}

const tableHeaderStyle = {
  backgroundColor: '#4a5568',
  color: '#ffffff',
  padding: '0.75rem',
  borderBottom: '1px solid #cbd5e0',
  textAlign: 'left',
}

const tableCellStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #cbd5e0',
  textAlign: 'left',
}

const paginationContainerStyle = {
  marginTop: '1rem',
  display: 'flex',
  alignItems: 'center',
}

const paginationText = {
  marginRight: '1rem',
}

const paginationButtonStyle = {
  padding: '0.5rem 1rem',
  background: '#4a5568',
  color: '#ffffff',
  border: 'none',
  cursor: 'pointer',
  marginLeft: '1rem',
}

export default CsvTable
