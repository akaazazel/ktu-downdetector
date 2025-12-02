import { useEffect } from "react";

import { checkUrl, getHistory } from "./api/api";
import { useState } from "react";
import { Oval } from "react-loader-spinner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { convertTime } from "./utils/utils";

import "./index.css";

function App() {
    const [down, setDown] = useState(true);
    const [data, setData] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [history, setHistory] = useState(false);
    const [historyChecked, setHistoryChecked] = useState(false);

    const loaderComp = <Skeleton width={50} height={20} />;

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
        <div className="container">
            <h1 className="title">KTU Downdetector</h1>
            <div className="content">
                <div className="header">
                    {data ? (
                        <h2>OK</h2>
                    ) : (
                        <Skeleton
                            width={50}
                            height={20}
                            baseColor="rgba(255, 255, 255, 0.50)"
                            highlightColor="rgba(255, 255, 255, 0.75)"
                        />
                    )}
                    {data ? (
                        <p>KTU website is ok</p>
                    ) : (
                        <Skeleton
                            width={100}
                            height={20}
                            baseColor="rgba(255, 255, 255, 0.50)"
                            highlightColor="rgba(255, 255, 255, 0.75)"
                        />
                    )}
                </div>

                <div className="body">
                    <ul className="status">
                        {data ? (
                            <LabelComponent
                                label={"Code"}
                                value={data.status}
                            />
                        ) : (
                            <Skeleton
                                width={50}
                                height={15}
                                baseColor="rgba(255, 255, 255, 0.50)"
                                highlightColor="rgba(255, 255, 255, 0.75)"
                            />
                        )}
                        {data ? (
                            data.statusText !== "" ? (
                                <LabelComponent
                                    label={"Status Text"}
                                    value={data.statusText}
                                />
                            ) : (
                                <LabelComponent
                                    label={"Status Text"}
                                    value={"Unknown"}
                                />
                            )
                        ) : (
                            <Skeleton
                                width={50}
                                height={15}
                                baseColor="rgba(255, 255, 255, 0.50)"
                                highlightColor="rgba(255, 255, 255, 0.75)"
                            />
                        )}
                        {data ? (
                            <LabelComponent
                                label={"Latency"}
                                value={data.latency}
                            />
                        ) : (
                            <Skeleton
                                width={50}
                                height={15}
                                baseColor="rgba(255, 255, 255, 0.50)"
                                highlightColor="rgba(255, 255, 255, 0.75)"
                            />
                        )}
                    </ul>
                </div>

                <div className="history">
                    <button
                        className={
                            history
                                ? "history-button round-border"
                                : "history-button"
                        }
                        onClick={handleHistoryChecked}
                    >
                        {history ? "X" : "History"}
                    </button>
                    {history && (
                        <div className="history-body">
                            <ul className="history-data">
                                <li>
                                    Last Check:{" "}
                                    {historyData
                                        ? convertTime(historyData.last_check)
                                        : "..."}
                                </li>
                                <li>
                                    Last Down:{" "}
                                    {historyData
                                        ? convertTime(
                                              historyData.last_down_time
                                          )
                                        : "..."}
                                </li>
                                <li>
                                    Last Down Duration:
                                    {historyData
                                        ? `${Math.floor(
                                              historyData.last_down_duration /
                                                  60000
                                          )} minutes`
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

const LabelComponent = ({ label, value }) => {
    return (
        <p className="status-label">
            {`${label}:`}{" "}
            <span>{`${value} ${label === "Latency" ? "ms" : ""}`}</span>
        </p>
    );
};

export default App;
