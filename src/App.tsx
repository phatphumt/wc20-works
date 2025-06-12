import React, { useEffect, useState, type JSX } from "react";
import './index.css'
import { Link } from "react-router";

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SHEET_ID = "1-HeR_Rt7M-wxHP8W6CxRQM8jrL3uDs2oWq6W2b9xtBs";

interface SheetRange {
  id: string;
  label: string;
  range: string;
}

const ranges: SheetRange[] = [
  {
    id: "upcoming",
    label: "📅 งานที่จะครบกำหนดส่ง",
    range: "'รวมงาน'!B4:D100",
  },
  {
    id: "overdue",
    label: "❌ งานที่เลยกำหนดส่ง / การสอบที่ผ่านไปแล้ว",
    range: "'รวมงาน'!I4:K100",
  },
  {
    id: "nodate",
    label: "📌 งานที่ยังไม่มีกำหนดส่ง",
    range: "'รวมงาน'!F4:G100",
  },
];

const App: React.FC = () => {
  const [data, setData] = useState<Record<string, string[][]>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSheetRange = async (range: string): Promise<string[][]> => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}&t=${Date.now()}`;
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-store",
      },
    });
    const json = await response.json();
    return json.values || [];
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const results: Record<string, string[][]> = {};
      for (const { id, range } of ranges) {
        try {
          const data = await fetchSheetRange(range);
          if (isMounted) results[id] = data;
        } catch (err) {
          console.error(`Error loading ${range}:`, err);
          results[id] = [["โหลดข้อมูลไม่ได้"]];
        }
      }

      if (isMounted) {
        setData(results);
        setLoading(false);
      }
    };

    fetchData();
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
      <div className="title">
        <h1>📘 ตารางงาน ม.4/2</h1>
        <h2>
          <Link to="/activities">กิจกรรม ➡️</Link>
        </h2>
      </div>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : (
        ranges.map(({ id, label }) => (
          <div className="card" key={id}>
            <h2>{label}</h2>
            {renderTable(data[id])}
          </div>
        ))
      )}
    </div>
  );
};

export default App;
