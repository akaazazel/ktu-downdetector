import { useEffect } from "react";

import { checkUrl, getHistory } from "./api/api";
import { useState } from "react";

function App() {
    const [down, setDown] = useState(true);
    const [data, setData] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [history, setHistory] = useState(false);
    const [historyChecked, setHistoryChecked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await checkUrl();
            setData(response);
            setDown(response.down);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getHistory();
            setHistoryData(response);
        };

        historyChecked && fetchData();
    }, [historyChecked]);

    const handleHistoryChecked = () => {
        setHistory(!history);
        !historyChecked && setHistoryChecked(true);
    };

    return (
        <div>
            <h1>Downdetector</h1>
            <div>
                <div>
                    {data ? (
                        <>
                            <h2>OK</h2>
                            <p>KTU website is ok</p>
                        </>
                    ) : (
                        "..."
                    )}
                </div>
                <div>
                    <ul>
                        <li>Status: {data ? data.status : "..."}</li>
                        <li>
                            Status Text:{" "}
                            {data
                                ? data.statusText !== ""
                                    ? data.statusText
                                    : "Unknown"
                                : "..."}
                        </li>
                        <li>Latency: {data ? data.latency : "..."} ms</li>
                    </ul>
                </div>
                <div>
                    <button onClick={handleHistoryChecked}>History</button>
                    {history && (
                        <div>
                            <ul>
                                <li>
                                    Last Check:{" "}
                                    {historyData
                                        ? historyData.last_check
                                        : "..."}
                                </li>
                                <li>
                                    Last Down:{" "}
                                    {historyData
                                        ? historyData.last_down_time
                                        : "..."}
                                </li>
                                <li>
                                    Last Down Duration:
                                    {historyData
                                        ? historyData.last_down_duration
                                        : "..."}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
