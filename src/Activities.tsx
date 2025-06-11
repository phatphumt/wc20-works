import React, { useCallback, useEffect, useState, type JSX } from "react";
import Dropdown from "./Dropdown";

const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SHEET_ID = "1-HeR_Rt7M-wxHP8W6CxRQM8jrL3uDs2oWq6W2b9xtBs";

const Activities: React.FC = () => {
  const [data, setData] = useState<string[][][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [week, setWeek] = useState(4);
  const [day, setDay] = useState<string[]>([]);
  const weekArray = [4, 5, 6, 7, 8];

  const fetchSheetRange = useCallback(
    async (range: string): Promise<string[][]> => {
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
      return json.values || [];
    },
    []
  );

  const handleChange = (n: number) => {
    console.log(n);
    setLoading(true);
    setWeek(n);
  }

  const fetchData = useCallback(
    async (week: number) => {
      try {
        const dataa = await fetchSheetRange(`'Week ${week}'!L3:O`);
        const days: string[] = [];
        const grouped = Object.values(
          dataa.reduce((acc, row) => {
            const date = row[1]; // column 2 = Thai date
            if (!acc[date]) {
              acc[date] = [];
              days.push(date);
            }
            acc[date].push(row.slice(2));
            return acc;
          }, {} as Record<string, typeof dataa>)
        );

        grouped.map((row) => {
          row.unshift(["วิชา", "กิจกรรม"]);
        });
        console.log(grouped);
        console.log(days);
        setData(grouped);
        setDay(days);
      } catch (err) {
        console.error(`Error loading 'Week ${week}'!L:O`, err);
        setData([]);
      }
      setLoading(false);
    },
    [fetchSheetRange]
  );

  useEffect(() => {
    fetchData(week);
  }, [fetchData, week]);

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
                  <td key={ci}>
                    {row[ci]?.startsWith("สอบ")
                      ? "📝 " + row[ci]
                      : row[ci] || "-"}
                  </td>
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
        <h1>📘 กิจกรรมในห้อง ม.4/2 (Week {week})</h1>
      </div>
      <div className="wksel">
        <h3>เลือกสัปดาห์ที่ต้องการ:</h3>
        <Dropdown week={weekArray} value={week ?? undefined} onChange={handleChange}/>
      </div>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : (
        data.map((row, ri) => (
          <div className="card" key={ri}>
            <h2>{day[ri]}</h2>
            {renderTable(row)}
          </div>
        ))
      )}
    </div>
  );
};

export default Activities;
