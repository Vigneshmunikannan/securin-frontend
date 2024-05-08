import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from "react-router-dom"
export default function Cvedata() {
  const { id } = useParams();
  const [cveData, setCveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSingleData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getsingledata/${id}`);
        console.log(response.data)
        setCveData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cveData) return <p>No data available</p>;

  return (
    <div style={{padding:"50px"}}>
      <h2>CVE ID: {cveData.cveId}</h2>
      <h3>Descriptions</h3>
      <div>
        {cveData.descriptions.map((data) => (
          <p>
            {data.value}
          </p>
        ))}
      </div>
      <h3>CVSS V2 Metrics:</h3>
      <div style={{ display: "flex", justifyContent: "space-between", width: "30%" }}>
        <p><b>Severity:</b> {cveData.cvssMetricV2.baseSeverity}</p>
        <p><b>Score:</b> {cveData.cvssMetricV2.baseScore}</p>
      </div>
      <p><b>Vector String:</b> {cveData.cvssMetricV2.vectorString}</p>
      <table style={{textAlign:"center"}}>
        <thead>
          <th>Access Vector</th>
          <th>
            Access Complexity
          </th>
          <th>
            Authentication
          </th>
          <th>
            Confidentiality Impact
          </th>
          <th>
            Integrity Impact
          </th>
          <th>
            Availablity Impact
          </th>
        </thead>
        <tbody>
          <tr>
            <td>{cveData.cvssMetricV2.accessVector}</td>
            <td>{cveData.cvssMetricV2.accessComplexity}</td>
            <td>{cveData.cvssMetricV2.authentication}</td>
            <td>{cveData.cvssMetricV2.confidentialityImpact}</td>
            <td>{cveData.cvssMetricV2.integrityImpact}</td>
            <td>{cveData.cvssMetricV2.availabilityImpact}</td>
          </tr>
        </tbody>
      </table>
      <h3>Scores:</h3>
      <p><b>ExploitabilityScore:</b> {cveData.cvssMetricV2.exploitabilityScore}</p>
      <p><b>ImpactScore:</b> {cveData.cvssMetricV2.impactScore}</p>
      <h3>CPE:</h3>
      <table style={{textAlign:"center"}}>
        <thead>
          <th>Criteria</th>
          <th>
            Match Criteria ID
          </th>
          <th>
            Vulnerable
          </th>
        </thead>
        <tbody>
          {
            cveData.cpeMatch.map(data => (
              <tr>
                <td>
                  {data.criteria}
                </td>
                <td>
                  {data.matchCriteriaId}
                </td>
                <td>
                  {
                    data.vulnerable  ? "YES":"NO"                  
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

    </div>
  );
}
