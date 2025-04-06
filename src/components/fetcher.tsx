'use client'
import { useState } from "react";

type DataType = {
  userId?: number;
  id?: number;
  title?: string;
  body?: string;
  error?: string;
};

export default function Fetcher({url, label} : {url: string, label: string}) {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);


  async function fetchData() {
    setLoading(true);
    try {
      // const res = await fetch(url);
      // const json: DataType = await res.json();
      // setData(json);
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url,
          options: {
            method: 'GET',
            headers: {
              Authorization: ``,
            },
          },
        }),
      });
      console.log(res)
      const json: DataType = await res.json();
      setData(json);

    } catch (err) {
      setData({ error: err});
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={fetchData}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {label}
      </button>

      <div className="mt-4 whitespace-pre-wrap text-sm">
        {loading && "Loading..."}
        {!loading && data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
}