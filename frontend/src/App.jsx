import { useEffect } from "react";

import { checkUrl, getHistory } from "./api/api";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { convertTime } from "./utils/utils";

import "./index.css";
import { VStack, Text, Box, HStack, Icon } from "@chakra-ui/react";
import { CircleX, CircleCheck } from "lucide-react";

function App() {
    const [down, setDown] = useState(0);
    const [data, setData] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [history, setHistory] = useState(false);
    const [historyChecked, setHistoryChecked] = useState(false);

    const loaderComp = <Skeleton width={50} height={20} />;

    useEffect(() => {
        const fetchData = async () => {
            const response = await checkUrl();
            setData(response);
            setDown(!response.status);
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

    // const greenPrimary = "#48bb78";
    // const greenSecondary = "#c6f6d5";
    // const redPrimary = "#e53e3e";
    // const redSecondary = "#fed7d7";
    const width = 500;
    const borderRadius = "3xl";

    return (
        <VStack paddingTop={10} gap={2}>
            <Text fontSize={"3xl"} fontWeight={"bold"} color={"blue.subtle"}>
                Down Detector
            </Text>
            <VStack gap={1}>
                <Box
                    background={down ? "red.solid" : "green.solid"}
                    color={down ? "red.fg" : "green.fg"}
                    borderRadius={borderRadius}
                    padding={"20px 40px"}
                    width={width}
                >
                    <HStack justifyContent={"space-between"}>
                        <Text fontSize={"3xl"} fontWeight={"bold"}>
                            {down ? "DOWN!" : "OK!"}
                        </Text>
                        <Text fontSize={"md"} fontWeight={"normal"}>
                            {`The website is ${down ? "down" : "up"}!`}
                        </Text>
                    </HStack>
                </Box>
                <Box
                    background={"gray.solid"}
                    // color={"gray.fg"}
                    borderRadius={borderRadius}
                    padding={"20px 40px"}
                    width={width}
                >
                    <StatusData
                        title={"Status Code"}
                        value={data ? data.code : "--"}
                        down={down}
                    />
                    <StatusData
                        title={"Message"}
                        value={data ? data.statusText : "--"}
                        down={down}
                    />
                    <StatusData
                        title={"Latency"}
                        value={`${data ? data.latency : "--"} ms`}
                        down={down}
                    />
                </Box>
            </VStack>
        </VStack>
    );
}

const StatusData = ({ title, value, down }) => {
    return (
        <HStack justifyContent={"space-between"}>
            <Text fontSize={"md"} fontWeight={"normal"}>
                {title}
            </Text>

            <HStack>
                <Icon size={"md"} color={down ? "red.solid" : "green.solid"}>
                    {down ? <CircleX /> : <CircleCheck />}
                </Icon>
                <Text fontSize={"lg"} fontWeight={"bold"} paddingBottom={1}>
                    {value}
                </Text>
            </HStack>
        </HStack>
    );
};

export default App;
