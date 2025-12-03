import { useEffect } from "react";

import { checkUrl, getHistory } from "./api/api";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { convertTime } from "./utils/utils";

import "./index.css";
import { VStack, Text, Box, HStack, Icon, Button } from "@chakra-ui/react";
import { CircleX, CircleCheck, ListRestart } from "lucide-react";

function App() {
    const [down, setDown] = useState(1);
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
                    <VStack align={"start"}>
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
                    </VStack>
                </Box>
                <Box
                    background={"blue.100"}
                    // color={"gray.fg"}
                    borderRadius={borderRadius}
                    padding={"20px 40px"}
                    width={width}
                    position={"relative"}
                >
                    <VStack align={"start"}>
                        <HistoryData
                            title={"Last check"}
                            value={
                                historyData
                                    ? `${Math.floor(
                                          (Date.now() -
                                              historyData.last_check) /
                                              60000
                                      )} minutes ago`
                                    : "--"
                            }
                        />
                        <HistoryData
                            title={"Last down time"}
                            value={
                                historyData
                                    ? convertTime(historyData.last_down_time)
                                    : "--"
                            }
                        />
                        <HistoryData
                            title={"Last down duration"}
                            value={
                                historyData
                                    ? `${Math.floor(
                                          historyData.last_down_duration / 60000
                                      )} minutes`
                                    : "--"
                            }
                        />
                    </VStack>
                    <Button
                        onClick={handleHistoryChecked}
                        borderRadius={borderRadius}
                        position={"absolute"}
                        top={3}
                        right={3}
                        background={"blue.200"}
                    >
                        <Icon color={"blue.800"}>
                            <ListRestart />
                        </Icon>
                    </Button>
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

const HistoryData = ({ title, value }) => {
    return (
        <HStack color={"gray.emphasized"}>
            <Text fontSize={"sm"} fontWeight={"normal"}>
                {`${title}:`}
            </Text>

            <HStack>
                {/* <Icon
                    size={"md"}
                    color={down ? "gray.emphasized" : "green.solid"}
                >
                    {down ? <CircleX /> : <CircleCheck />}
                </Icon> */}
                <Text fontSize={"sm"} fontWeight={"medium"}>
                    {value}
                </Text>
            </HStack>
        </HStack>
    );
};

export default App;
