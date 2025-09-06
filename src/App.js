// App.jsx
import React, { useState } from "react";
import Papa from "papaparse";
import DataTable from "./DataTable";
import QCReport from "./QCReport";

function App() {
  const [data, setData] = useState([]);      // parsed CSV data
  const [headers, setHeaders] = useState([]); 
  const [qcFlags, setQcFlags] = useState({}); // { rowIndex: {colName: flag} }

  // Parse CSV file(s)
  const handleFiles = (e) => {
    const files = e.target.files;
    Array.from(files).forEach((file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data;
          setData(parsedData);
          setHeaders(results.meta.fields);
          computeQCFlags(parsedData, results.meta.fields);
        },
      });
    });
  };

  // Basic QC: missing, range, duplicates
  const computeQCFlags = (parsedData, headers) => {
    const flags = {};
    const seenKeys = new Set();

    parsedData.forEach((row, i) => {
      flags[i] = {};
      headers.forEach((col) => {
        flags[i][col] = false; // default no flag

        // Missing value
        if (!row[col] || row[col].trim() === "") {
          flags[i][col] = true;
        }
// Inside App.jsx, after computeQCFlags or anywhere in the App component

const exportFlaggedRows = () => {
  if (!data.length) return;

  // Prepare flagged rows
  const flaggedIndexes = Object.keys(qcFlags).filter(
    (i) => Object.values(qcFlags[i]).some((v) => v)
  );

  if (!flaggedIndexes.length) {
    alert("No flagged rows to export!");
    return;
  }

  const flaggedData = flaggedIndexes.map((i) => {
    return { ...data[i], Problem_Count: Object.values(qcFlags[i]).filter(Boolean).length };
  });

  // Convert to CSV
  const csvRows = [];
  const headersCSV = [...Object.keys(flaggedData[0])];
  csvRows.push(headersCSV.join(","));
  flaggedData.forEach((row) => {
    csvRows.push(headersCSV.map((h) => row[h]).join(","));
  });

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "flagged_rows.csv";
  a.click();
  URL.revokeObjectURL(url);
};
{data.length > 0 && (
  <>
    <button
      onClick={exportFlaggedRows}
      style={{
        marginTop: "10px",
        padding: "8px 12px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Export Flagged Rows
    </button>

    <DataTable data={data} headers={headers} qcFlags={qcFlags} />
    <QCReport data={data} headers={headers} qcFlags={qcFlags} />
  </>
)}


        // Range check example for numeric fields
        if (col === "DBH_cm") {
          const val = parseFloat(row[col]);
          if (isNaN(val) || val < 1 || val > 400) flags[i][col] = true;
        }
        if (col === "Height_m") {
          const val = parseFloat(row[col]);
          if (isNaN(val) || val < 1 || val > 100) flags[i][col] = true;
        }
        if (col === "CanopyCover_pct") {
          const val = parseFloat(row[col]);
          if (isNaN(val) || val < 0 || val > 100) flags[i][col] = true;
        }
      });

      // Duplicate check using PlotID+TreeID+Date
      const key = `${row.PlotID}_${row.TreeID}_${row.Date}`;
      if (seenKeys.has(key)) {
        headers.forEach((col) => (flags[i][col] = true));
      } else {
        seenKeys.add(key);
      }
    });

    setQcFlags(flags);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Staging Data QC Dashboard</h1>
      <input type="file" accept=".csv" multiple onChange={handleFiles} />
      {data.length > 0 && (
        <>
          <DataTable data={data} headers={headers} qcFlags={qcFlags} />
          <QCReport data={data} headers={headers} qcFlags={qcFlags} />
        </>
      )}
    </div>
  );
}

export default App;
