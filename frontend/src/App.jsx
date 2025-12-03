import { useEffect } from "react";

import { checkUrl, getHistory } from "./api/api";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { convertTime } from "./utils/utils";

import { useMediaQuery } from "react-responsive";

import "./index.css";
import {
    VStack,
    Text,
    Box,
    Stack,
    HStack,
    Icon,
    Button,
    Link,
    Image,
} from "@chakra-ui/react";
import { CircleX, CircleCheck, ListRestart } from "lucide-react";

function App() {
    const [down, setDown] = useState(1);
    const [data, setData] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [history, setHistory] = useState(false);
    const [historyChecked, setHistoryChecked] = useState(false);

    const isMobile = useMediaQuery({ query: "(max-width: 540px)" });

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

    const width = isMobile ? 320 : 500;
    const titleSize = isMobile ? "2xl" : "3xl";
    const mediumFont = isMobile ? "sm" : "md";
    const smallFont = isMobile ? "xs" : "sm";
    const borderRadius = "3xl";
    const padding = isMobile ? "15px 25px" : "20px 40px";

    return (
        <VStack paddingTop={10} gap={4}>
            <Image width={isMobile ? 260 : 360} src="logo.svg" />
            <VStack gap={1}>
                <Box
                    background={down ? "red.solid" : "green.solid"}
                    color={down ? "red.fg" : "green.fg"}
                    borderRadius={borderRadius}
                    padding={padding}
                    width={width}
                >
                    <Stack
                        justifyContent={"space-between"}
                        align={!isMobile && "center"}
                        direction={isMobile && "column"}
                    >
                        <Text fontSize={titleSize} fontWeight={"bold"}>
                            {down ? "DOWN!" : "OK!"}
                        </Text>
                        <Text fontSize={mediumFont} fontWeight={"normal"}>
                            {`The website is ${down ? "down" : "up"}!`}
                        </Text>
                    </Stack>
                </Box>
                <Box
                    background={"gray.solid"}
                    // color={"gray.fg"}
                    borderRadius={borderRadius}
                    padding={padding}
                    width={width}
                >
                    <VStack align={"start"}>
                        <StatusData
                            title={"Status Code"}
                            value={data ? data.code : "--"}
                            down={down}
                            mediumFont={mediumFont}
                        />
                        <StatusData
                            title={"Message"}
                            value={data ? data.statusText : "--"}
                            down={down}
                            mediumFont={mediumFont}
                        />
                        <StatusData
                            title={"Latency"}
                            value={`${data ? data.latency : "--"} ms`}
                            down={down}
                            mediumFont={mediumFont}
                        />
                    </VStack>
                </Box>
                <Box
                    background={"blue.100"}
                    // color={"gray.fg"}
                    borderRadius={borderRadius}
                    padding={padding}
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
                            smallFont={smallFont}
                        />
                        <HistoryData
                            title={"Last down time"}
                            value={
                                historyData
                                    ? convertTime(historyData.last_down_time)
                                    : "--"
                            }
                            smallFont={smallFont}
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
                            smallFont={smallFont}
                        />
                    </VStack>
                    <Button
                        onClick={handleHistoryChecked}
                        borderRadius={borderRadius}
                        position={"absolute"}
                        top={3}
                        right={3}
                        background={"blue.200"}
                        size={mediumFont}
                    >
                        <Icon color={"blue.800"} size={mediumFont}>
                            <ListRestart />
                        </Icon>
                    </Button>
                </Box>
            </VStack>
            <Text fontSize={smallFont}>
                Target:{" "}
                <Link href="https://app.ktu.edu.in" color={"blue.600"}>
                    https://app.ktu.edu.in
                </Link>
            </Text>
            <Text
                fontSize={smallFont}
                position={"fixed"}
                bottom={2}
                color={"gray.500"}
            >
                Developed by{" "}
                <Link
                    href="https://www.instagram.com/akaazazel"
                    color={"blue.800"}
                >
                    akaazazel
                </Link>
            </Text>
        </VStack>
    );
}

const StatusData = ({ title, value, down, mediumFont }) => {
    return (
        <HStack justifyContent={"space-between"}>
            <Text fontSize={mediumFont} fontWeight={"normal"}>
                {title}
            </Text>

            <HStack>
                <Icon
                    size={mediumFont}
                    color={down ? "red.solid" : "green.solid"}
                >
                    {down ? <CircleX /> : <CircleCheck />}
                </Icon>
                <Text
                    fontSize={mediumFont}
                    fontWeight={"bold"}
                    paddingBottom={1}
                >
                    {value}
                </Text>
            </HStack>
        </HStack>
    );
};

const HistoryData = ({ title, value, smallFont }) => {
    return (
        <HStack color={"gray.emphasized"}>
            <Text fontSize={smallFont} fontWeight={"normal"}>
                {`${title}:`}
            </Text>

            <HStack>
                {/* <Icon
                    size={"md"}
                    color={down ? "gray.emphasized" : "green.solid"}
                >
                    {down ? <CircleX /> : <CircleCheck />}
                </Icon> */}
                <Text fontSize={smallFont} fontWeight={"medium"}>
                    {value}
                </Text>
            </HStack>
        </HStack>
    );
};

export default App;
