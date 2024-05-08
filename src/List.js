import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import axios from 'axios'
export default function List() {
  const navigate = useNavigate();
  const [cves, setCves] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [resultsPerPage, currentPage]);

  const fetchData = async () => {
    try {
      console.log(process.env.REACT_APP_API_URL, resultsPerPage, currentPage)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/list?resultsPerPage=${resultsPerPage}&page=${currentPage}`);
      console.log(response.data.cves)
      setCves(response.data.cves);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error('Error fetching CVEs:', error);
    }
  };

  const handleResultsPerPageChange = (e) => {
    setResultsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page when changing results per page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalRecords / resultsPerPage);



  const renderPaginationButtons = () => {
    const buttons = [];

    // Previous Page Button
    buttons.push(
      <button key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        {'<'}
      </button>
    );

    // Page Buttons
    const maxButtonsToShow = 4; // Maximum number of page buttons to show
    const sideButtons = Math.floor((maxButtonsToShow - 1) / 2); // Number of buttons on each side of the current page
    let startPage = Math.max(1, currentPage - sideButtons);
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

    if (endPage - startPage < maxButtonsToShow - 1) {
      startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(renderPageButton(page));
    }

    // Next Page Button
    buttons.push(
      <button key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        {'>'}
      </button>
    );

    return buttons;
  };

  const renderPageButton = (page) => (
    <button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? 'active' : ''}>
      {page}
    </button>
  );

 function navigator(id){
  navigate(`/cvedata/${id}`)
 }

  return (
    <div className='list'>
      <h1>CVEs List</h1>
      <p>Total Records: {totalRecords}</p>
      <table>
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>Identifier</th>
            <th>Published</th>
            <th>Last Modified</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cves.map(cve => (
            <tr key={cve.cveId}>
              <td onClick={()=>{
                navigator(cve.cveId)
              }} style={{cursor:"pointer"}}>{cve.cveId}</td>
              <td>{cve.sourceIdentifier}</td>
              <td>{cve.published}</td>
              <td>{cve.lastModified}</td>
              <td>{cve.vulnStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='bottom'>
        <select value={resultsPerPage} onChange={handleResultsPerPageChange}>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <div>
          {renderPaginationButtons()}
        </div>
      </div>
    </div>
  );
}
