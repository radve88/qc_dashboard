// DataTable.jsx
import React from "react";

// Simple scrollable table with color-coded cells
function DataTable({ data, headers, qcFlags }) {
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
              {headers.map((col) => (
                <td
                  key={col}
                  style={{
                    border: "1px solid gray",
                    padding: "4px",
                    backgroundColor:
                      qcFlags[i] && qcFlags[i][col] ? "salmon" : "white",
                  }}
                >
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
