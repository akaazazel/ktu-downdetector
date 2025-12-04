import { useEffect } from "react";
import { useState } from "react";

import { useMediaQuery } from "react-responsive";

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
    Skeleton,
} from "@chakra-ui/react";
import { CircleX, CircleCheck, ListRestart } from "lucide-react";

import { checkUrl, getHistory } from "./api/api";
import { convertTime } from "./utils/utils";
import "./index.css";
import { GiLargeDress } from "react-icons/gi";

function App() {
    const [down, setDown] = useState(0);
    const [data, setData] = useState(null);
    const [historyData, setHistoryData] = useState(null);
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
        !historyChecked && setHistoryChecked(true);
    };

    const width = isMobile ? 320 : 500;
    const titleSize = isMobile ? "2xl" : "3xl";
    const mediumFont = isMobile ? "sm" : "md";
    const smallFont = isMobile ? "xs" : "sm";
    const padding = isMobile ? "15px 25px" : "20px 40px";
    const borderRadius = "3xl";

    const largeSkeleton = (
        <Skeleton
            width={100}
            height={8}
            opacity={0}
            bgColor={"white"}
            accentColor={"red"}
            variant={"pulse"}
        />
    );
    const mediumSkeleton = (
        <Skeleton
            width={200}
            height={5}
            opacity={0}
            bgColor={"white"}
            accentColor={"red"}
            variant={"pulse"}
        />
    );

    return (
        <VStack paddingTop={10} gap={4}>
            <Image
                width={isMobile ? 260 : 360}
                src="logo.svg"
                alt="KTU Downdetector"
            />
            <VStack gap={3}>
                <Box
                    bgGradient="to-b"
                    gradientFrom={down ? "red.500" : "green.500"}
                    gradientTo={down ? "red.600" : "green.600"}
                    // background={down ? "red.solid" : "green.solid"}
                    color={down ? "red.200" : "green.200"}
                    borderRadius={borderRadius}
                    padding={padding}
                    width={width}
                    boxShadow={"0 3px 5px rgba(0, 7, 37, 0.2)"}
                >
                    <Stack
                        justifyContent={"space-between"}
                        align={!isMobile && "center"}
                        direction={isMobile && "column"}
                    >
                        {data ? (
                            <Text fontSize={titleSize} fontWeight={"bold"}>
                                {down ? "DOWN!" : "OK!"}
                            </Text>
                        ) : (
                            largeSkeleton
                        )}

                        {data ? (
                            <Text fontSize={mediumFont} fontWeight={"normal"}>
                                The KTU website is{" "}
                                {down ? "not responding" : "responding"}
                            </Text>
                        ) : (
                            mediumSkeleton
                        )}
                    </Stack>
                </Box>
                <Box
                    background={"gray.solid"}
                    // color={"gray.fg"}
                    borderRadius={borderRadius}
                    padding={padding}
                    width={width}
                    boxShadow={"0 3px 5px rgba(0, 7, 37, 0.2)"}
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
                    boxShadow={"0 3px 5px rgba(0, 7, 37, 0.2)"}
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
                                    : null
                            }
                            smallFont={smallFont}
                            refresh={historyChecked}
                        />
                        <HistoryData
                            title={"Last down time"}
                            value={
                                historyData
                                    ? convertTime(historyData.last_down_time)
                                    : null
                            }
                            smallFont={smallFont}
                            refresh={historyChecked}
                        />
                        <HistoryData
                            title={"Last down duration"}
                            value={
                                historyData
                                    ? `${Math.floor(
                                          historyData.last_down_duration / 60000
                                      )} minutes`
                                    : null
                            }
                            smallFont={smallFont}
                            refresh={historyChecked}
                        />
                    </VStack>
                    <Button
                        name="history-refresh-button"
                        onClick={handleHistoryChecked}
                        borderRadius={borderRadius}
                        position={"absolute"}
                        top={3}
                        right={3}
                        background={"blue.200"}
                        size={mediumFont}
                        boxShadow={"0 3px 5px rgba(0, 7, 37, 0.2)"}
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

const HistoryData = ({ title, value, smallFont, refresh }) => {
    const smallSkeleton = (
        <Skeleton
            width={100}
            height={3.5}
            opacity={0}
            bgColor={"blue.400"}
            accentColor={"red"}
            variant={"pulse"}
        />
    );

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
                    {refresh && value === null
                        ? smallSkeleton
                        : !refresh && value === null
                        ? "--"
                        : value}
                </Text>
            </HStack>
        </HStack>
    );
};

export default App;
