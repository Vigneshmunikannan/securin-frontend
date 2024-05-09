import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const List = () => {
  const navigate = useNavigate();
  const [cves, setCves] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    year: '',
    score: '',
    lastModifiedDays: '',
  });
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchData();
  }, [resultsPerPage, currentPage, filters, sortOrder]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/cves/list`, {
        params: { resultsPerPage, page: currentPage, ...filters, sortOrder },
      });
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSortChange = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
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
      buttons.push(" ", renderPageButton(page), " ");
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

  const navigator = (id) => {
    navigate(`/cves/${id}`);
  };

  return (
    <div className="list">
      <div className="filters" style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        <label>
          Year:
          <input type="text" name="year" value={filters.year} onChange={handleFilterChange} />
        </label>
        <label>
          Score:
          <input type="text" name="score" value={filters.score} onChange={handleFilterChange} />
        </label>
        <label>
          Last Modified (Days):
          <input type="text" name="lastModifiedDays" value={filters.lastModifiedDays} onChange={handleFilterChange} />
        </label>
        <button onClick={handleSortChange} style={{ marginLeft: "10px" }}>Toggle Sort</button>
      </div>
      <h1>CVEs List</h1>
      <p>Total Records: {totalRecords}</p>
      <table>
        <thead>
          <tr>
            <th onClick={handleSortChange}>CVE ID</th>
            <th>Identifier</th>
            <th>Published</th>
            <th onClick={handleSortChange}>Last Modified</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            cves.length > 0 ? (
              <>
                {cves.map((cve) => (
                  <tr key={cve.cveId} onClick={() => navigator(cve.cveId)} style={{ cursor: 'pointer' }}>
                    <td>{cve.cveId}</td>
                    <td>{cve.sourceIdentifier}</td>
                    <td>{new Date(cve.published).toLocaleDateString()}</td>
                    <td>{new Date(cve.lastModified).toLocaleDateString()}</td>
                    <td>{cve.vulnStatus}</td>
                  </tr>
                ))}
              </>
            ) : <tr><td colSpan="5">No records found {cves.length}</td></tr>
          }

        </tbody>
      </table>
      <div className="bottom">
        <select value={resultsPerPage} onChange={handleResultsPerPageChange}>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <div>{renderPaginationButtons()}</div>
      </div>
    </div>
  );
};

export default List;
