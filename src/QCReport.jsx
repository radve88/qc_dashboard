// QCReport.jsx
import React from "react";

function QCReport({ data, headers, qcFlags }) {
  // Count total issues
  let totalFlags = 0;
  const perColumnFlags = {};
  headers.forEach((col) => (perColumnFlags[col] = 0));

  Object.values(qcFlags).forEach((rowFlags) => {
    headers.forEach((col) => {
      if (rowFlags[col]) {
        totalFlags += 1;
        perColumnFlags[col] += 1;
      }
    });
  });

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>QC Summary</h2>
      <p>Total issues flagged: {totalFlags}</p>
      <table style={{ borderCollapse: "collapse", width: "50%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              Column
            </th>
            <th style={{ border: "1px solid black", padding: "4px" }}>
              Issues
            </th>
          </tr>
        </thead>
        <tbody>
          {headers.map((col) => (
            <tr key={col}>
              <td style={{ border: "1px solid gray", padding: "4px" }}>{col}</td>
              <td style={{ border: "1px solid gray", padding: "4px" }}>
                {perColumnFlags[col]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QCReport;
