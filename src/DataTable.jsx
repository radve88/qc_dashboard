import React from "react";
import "./DataTable.css";

export default function DataTable({ data }) {
  if (!data || data.length === 0) return <p>No data loaded.</p>;

  const headers = Object.keys(data[0]);

  // Build a set of composite keys to detect duplicates
  const keySet = {};
  data.forEach((row, i) => {
    const key = `${row.PlotID}_${row.TreeID}_${row.Date}`;
    if (keySet[key]) {
      keySet[key].push(i);
    } else {
      keySet[key] = [i];
    }
  });

  // Store duplicate indices
  const duplicateIndices = new Set(
    Object.values(keySet)
      .filter((arr) => arr.length > 1)
      .flat()
  );

  const getCellClass = (header, value, rowIndex) => {
    // Missing values
    if (value === "" || value === null || value === undefined) return "missing";

    // Range checks
    if (header === "DBH_cm") {
      const val = parseFloat(value);
      if (isNaN(val) || val <= 0 || val > 300) return "error";
    }
    if (header === "Height_m") {
      const val = parseFloat(value);
      if (isNaN(val) || val <= 0 || val > 80) return "warning";
    }
    if (header === "CanopyCover_pct") {
      const val = parseFloat(value);
      if (isNaN(val) || val < 0 || val > 100) return "error";
    }

    // Duplicate check
    if (duplicateIndices.has(rowIndex)) return "duplicate";

    return "ok"; // If none of the above
  };

  return (
    <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "20px" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {headers.map((col) => (
              <th
                key={col}
                style={{
                  border: "1px solid black",
                  padding: "4px",
                  backgroundColor: "#ddd",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {headers.map((col) => {
                const cellClass = getCellClass(col, row[col], i);
                return (
                  <td
                    key={col}
                    className={cellClass}
                    style={{ border: "1px solid gray", padding: "4px" }}
                  >
                    {row[col]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
