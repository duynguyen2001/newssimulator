import React, { useContext, useEffect, useState } from "react";
import GraphTA1 from "./GraphTA1";
import {
    DataContext,
    NewsChosenContext,
    NewsContext,
    FilteredNewsContext,
} from "../../components/DataReadingComponents/DataReader";
import useStoreTA1 from "../../components/TA1/storeTA1";
import axios from "axios";
import { parse } from "marked";
import ReactMarkdown from "react-markdown";
import "./MarkdownPreviewCard.css";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import Box from "@mui/material/Box";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import {
    Stepper,
    Step,
    StepLabel,
    Typography,
    StepContent,
    Button,
} from "@mui/material";
import { set } from "idb-keyval";

const Page = () => {
    const [selectedTab, setSelectedTab] = React.useState("Timeline");
    const [clickedNode] = useStoreTA1((state) => [state.clickedNode]);
    // console.log("clickedNode", clickedNode);
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                border: "1px solid black",
            }}
        >
            <div
                style={{
                    width: "100vw",
                    height: "fit-content",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {/* <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "10px 0",
                        width: "80%",
                    }}
                >
                    <button
                        onClick={() => setSelectedTab("Timeline")}
                        style={{
                            background:
                                selectedTab === "Timeline" ? "black" : "white",
                            border: "none",
                            height: "50px",
                            width: "30%",
                            color:
                                selectedTab === "Timeline" ? "white" : "black",
                            fontSize: "20px",
                            borderBottom: "1px solid black",
                        }}
                    >
                        Timeline
                    </button>
                    <button
                        onClick={() => setSelectedTab("Situation Reports")}
                        style={{
                            background:
                                selectedTab === "Situation Reports"
                                    ? "black"
                                    : "white",
                            border: "none",
                            height: "50px",
                            width: "30%",
                            color:
                                selectedTab === "Situation Reports"
                                    ? "white"
                                    : "black",
                            fontSize: "20px",
                            borderBottom: "1px solid black",
                        }}
                    >
                        Reports
                    </button>
                    <button
                        onClick={() => setSelectedTab("Posts")}
                        style={{
                            background:
                                selectedTab === "Posts" ? "black" : "white",
                            border: "none",
                            height: "50px",
                            width: "30%",
                            borderBottom: "1px solid black",
                            color: selectedTab === "Posts" ? "white" : "black",
                            fontSize: "20px",
                        }}
                    >
                        Posts
                    </button>
                </div> */}

                <div
                    style={{
                        height: "fit-content",
                        width: clickedNode ? "50%" : "80%",
                        border: "1px solid black",
                        left: "10vw",
                        top: "5vh",
                        zIndex: 1,
                        position: "absolute",
                        backgroundColor: "white",
                    }}
                >
                    {/* {selectedTab === "Situation Reports" && (
                        <SituationReportsPage />
                    )} */}
                    {selectedTab === "Timeline" && <TimelinePage />}
                </div>
            </div>
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                }}
            >
                <GraphTA1 />
            </div>
        </div>
    );
};
const CircleBig = ({ active }) => {
    return (
        <Box
            sx={{
                height: 32,
                width: 32,
                borderRadius: "50%",
                backgroundColor: active ? "black" : "grey",
            }}
        />
    );
};
const CircleSmall = ({ active }) => {
    return (
        <Box
            sx={{
                height: 16,
                width: 16,
                borderRadius: "50%",
                center: "center",
                backgroundColor: active ? "black" : "grey",
            }}
        />
    );
};
const TimelinePage = () => {
    const [News, setNews] = useContext(NewsContext);
    const [TimelineNews, setTimelineNews] = useState([]);
    const [chosenNews, setChosenNews] = useContext(NewsChosenContext);
    const [filteredNews, setFilteredNews] = useContext(FilteredNewsContext);
    // const [setSelectedNew] = useStoreTA1((state) => state.setSelectedNew);
    const [listDate, setListDate] = useState([]);
    const [chosenDate, setChosenDate] = useState("");
    const chosenStyle = {
        textColor: "black",
        fontWeight: "bold",
        color: "black",
    };
    const [chosenIndex, setChosenIndex] = useState(-1);
    // useEffect(() => {
    //     const selectedNew = News.find(
    //         (article) => article.id === chosenNews.id
    //     );
    //     setSelectedNew(selectedNew);
    // }, [chosenNews]);
    useEffect(() => {
        const temp = [];
        const uniqueDate = [];
        let chosenListNews = [];
        if (News.length > 0 && filteredNews.length === 0) 
            {chosenListNews = News;}
        else if (filteredNews.length > 0)
            {chosenListNews = filteredNews;}
            chosenListNews.map((article) => {
                const date = new Date(article.time);
                const dateString = date.toLocaleString("default", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                });
                if (!uniqueDate.includes(dateString)) {
                    uniqueDate.push(dateString);
                }
                temp.push({
                    ...article,
                    date: date,
                    year: date.getDate(),
                    month: date.getMonth(),
                    day: date.getDay(),
                    hour: date.getHours(),
                    minute: date.getMinutes(),
                });
            })
        temp.sort((a, b) => {
            return a.date - b.date;
        });
        setListDate(uniqueDate);
        setTimelineNews(temp);
    }, [News, filteredNews]);
    return (
        <>
            <div
                style={{
                    position: "relative",
                    // overflowX: "hidden",
                    width: "initial",
                    display: "flex",
                    margin: "50px 10px 10px 10px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        overflowX: "scroll",
                        display: "flex",
                        margin: "auto",
                        alignItems: "center",
                        flexDirection: "row",
                        maxWidth: "100%",
                    }}
                >
                    <Stepper orientation="horizontal" alternativeLabel>
                        {listDate &&
                            listDate.map((date, dateIndex) => [
                                <Step
                                    orientation="vertical"
                                    key={dateIndex}
                                    active={chosenDate === date}
                                >
                                    <StepLabel
                                        onClick={() => {
                                            setChosenDate(date);
                                            setChosenNews(null);
                                        }}
                                        StepIconComponent={CircleBig}
                                        style={
                                            chosenDate === date
                                                ? chosenStyle
                                                : {}
                                        }
                                    >
                                        {date}
                                    </StepLabel>
                                </Step>,
                                TimelineNews &&
                                    TimelineNews.map((article, index) => {
                                        const articleDateString =
                                            article.date.toLocaleString(
                                                "default",
                                                {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                }
                                            );
                                        if (
                                            articleDateString === date &&
                                            date === chosenDate
                                        ) {
                                            return (
                                                <Step
                                                    key={article.id}
                                                    onClick={() => {
                                                        setChosenNews(article);
                                                        setChosenIndex(index);
                                                    }}
                                                >
                                                    <StepLabel
                                                        StepIconComponent={
                                                            CircleSmall
                                                        }
                                                    >
                                                        <Typography
                                                            onClick={() => {
                                                                setChosenNews(
                                                                    article
                                                                );
                                                                setChosenIndex(
                                                                    index
                                                                );
                                                            }}
                                                            style={
                                                                chosenIndex ===
                                                                index
                                                                    ? chosenStyle
                                                                    : {}
                                                            }
                                                        >
                                                            {`${article.hour}:${
                                                                article.minute <
                                                                10
                                                                    ? `0${article.minute}`
                                                                    : article.minute
                                                            }`}
                                                        </Typography>
                                                        <Typography
                                                            variant="p"
                                                            style={
                                                                chosenIndex ===
                                                                index
                                                                    ? chosenStyle
                                                                    : {}
                                                            }
                                                        >
                                                            {
                                                                article.schemaEvent
                                                            }
                                                        </Typography>
                                                    </StepLabel>
                                                    {/* <StepContent>
                                                        {chosenIndex ===
                                                            index && (
                                                            <>
                                                                <Typography
                                                                    variant="h6"
                                                                    style={
                                                                        chosenStyle
                                                                    }
                                                                >
                                                                    {
                                                                        article.schemaEvent
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    style={
                                                                        chosenStyle
                                                                    }
                                                                >
                                                                    {
                                                                        article.description
                                                                    }
                                                                </Typography>
                                                            </>
                                                        )}
                                                    </StepContent> */}
                                                </Step>
                                            );
                                        }
                                        return null;
                                    }),
                            ])}
                    </Stepper>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {chosenNews && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "80%",
                                height: "100%",
                            }}
                        >
                            <Typography
                                variant="h6"
                                style={{
                                    fontWeight: "bold",
                                    alignSelf: "left",
                                }}
                            >
                                {chosenNews.schemaEvent}
                            </Typography>
                            <Typography>{chosenNews.time}</Typography>
                            <ReactMarkdown>
                                {chosenNews.description}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
const SituationReportsPage = () => {
    const [articleLists, setArticleLists] = useState([]);
    const [jsonData] = useContext(DataContext);
    const [fullArticle, setFullArticle] = useState(null);

    const newData = { ...jsonData };
    useEffect(() => {
        console.log("articleLists", articleLists);
    }, [articleLists]);
    const generateArticles = () => {
        axios
            .post(
                "https://newssimulator-mockserver.netlify.app/.netlify/functions/generateArticles",
                JSON.stringify(newData),
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((res) => {
                console.log(res);
                setArticleLists(res.data.data.data);
            });
    };
    const generateFullArticle = (article) => {
        setFullArticle(article);
    };
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                }}
            >
                {
                    <button
                        className="button"
                        style={{
                            border: "1px solid black",
                            height: "50px",
                            width: "200px",
                            fontSize: "20px",
                            borderRadius: "10px",
                        }}
                        onClick={generateArticles}
                    >
                        Generate
                    </button>
                }
                {articleLists && (
                    <div
                        style={{
                            position: "relative",
                            height: "80%",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            // alignItems: "center",
                        }}
                    >
                        {articleLists &&
                            fullArticle == null &&
                            articleLists.map((article, index) => {
                                const htmlContent = parse(
                                    article.slice(0, 300)
                                );
                                console.log("htmlContent", htmlContent);
                                return (
                                    <MarkdownPreviewCard
                                        markdownContent={article}
                                        onClick={() =>
                                            generateFullArticle(article)
                                        }
                                    />
                                );
                            })}
                        {fullArticle && (
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "left",
                                    alignItems: "center",
                                    overflowY: "auto",
                                }}
                            >
                                <ReactMarkdown>{fullArticle}</ReactMarkdown>
                                <button
                                    className="button"
                                    style={{
                                        border: "1px solid black",
                                        height: "50px",
                                        width: "200px",
                                        fontSize: "20px",
                                        borderRadius: "10px",
                                    }}
                                    onClick={() => setFullArticle(null)}
                                >
                                    Back
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

const MarkdownPreviewCard = ({ markdownContent, onClick }) => {
    // Limit content for the preview (e.g., first 500 characters)
    const limitedContent = markdownContent.slice(0, 500);

    return (
        <div className="markdown-preview-card" onClick={onClick}>
            <ReactMarkdown>{limitedContent}</ReactMarkdown>
            {markdownContent.length > 500 && (
                <a className="read-more" onClick={onClick}>
                    Read More...
                </a>
            )}
        </div>
    );
};
export default Page;
