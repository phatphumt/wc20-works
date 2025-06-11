import React, { useEffect, useState, type JSX } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SHEET_ID = "1-HeR_Rt7M-wxHP8W6CxRQM8jrL3uDs2oWq6W2b9xtBs";

// interface SheetRange {
//   id: string;
//   label: string;
//   range: string;
// }

const Activities: React.FC = () => {
  const [data, setData] = useState<Record<string, string[][]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSheetRange = async (range: string): Promise<string[][]> => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}&t=${Date.now()}`;
    console.log("FETCHING", url);
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-store",
      },
    });
    const json = await response.json();
    // console.log(json.values);
    return json.values;
  };

  useEffect(() => {
    // console.log(API_KEY);
    let isMounted = true;

    const fetchData = async () => {
      const results: Record<string, string[][]> = {};
      for (let i = 4; i <= 8; i++) {
        try {
          const data = await fetchSheetRange(`'Week ${i}'!L3:O`);
          if (isMounted) results[`${i-4}`] = data;
        } catch (err) {
          console.error(`Error loading 'Week ${i}'!L:O`, err);
          results[`${i-4}`] = [["โหลดข้อมูลไม่ได้"]];
        }
      };

      if (isMounted) {
        setData(results);
        setLoading(false);
      }
    };

    fetchData()
    return () => {
      isMounted = false;
    };
  }, []);

  const renderTable = (rows: string[][]): JSX.Element => {
    if (!rows || rows.length === 0) return <p>ไม่มีข้อมูล</p>;

    const headers = rows[0];
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, ri) => (
              <tr key={ri}>
                {headers.map((_, ci) => (
                  <td key={ci}>{row[ci]?.startsWith("สอบ") ? "📝 " + row[ci] : row[ci] || '-'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="sheet-wrapper">
      <div>
        <h1>📘 กิจกรรมในห้อง ม.4/2</h1>
      </div>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : (
       [1].map((el) => (
          <div className="card" key={1}>
            {renderTable(data[el])}
          </div>
        ))
      )}
    </div>
  );
};

export default Activities;
