import React, { useContext, useEffect, useState } from "react";
import GraphTA1 from "./GraphTA1";
import {
    DataContext,
    NewsChosenContext,
    NewsContext,
} from "../../components/DataReadingComponents/DataReader";
import useStoreTA1 from "../../components/TA1/storeTA1";
import axios from "axios";
import { parse } from "marked";
import ReactMarkdown from "react-markdown";
import "./MarkdownPreviewCard.css";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import { Typography } from "@mui/material";
import { set } from "idb-keyval";

const Page = () => {
    const [selectedTab, setSelectedTab] = React.useState("Timeline");
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                border: "1px solid black",
            }}
        >
            <div
                style={{
                    width: "50vw",
                    height: "100vh",
                }}
            >
                <GraphTA1 />
            </div>
            <div
                style={{
                    width: "50vw",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
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
                </div>

                <div
                    style={{
                        height: "80vh",
                        width: "80%",
                        border: "1px solid black",

                        position: "relative",
                        overflowY: "scroll",
                    }}
                >
                    {selectedTab === "Situation Reports" && (
                        <SituationReportsPage />
                    )}
                    {selectedTab === "Timeline" && <TimelinePage />}
                </div>
            </div>
        </div>
    );
};
const TimelinePage = () => {
    const [News, setNews] = useContext(NewsContext);
    const [TimelineNews, setTimelineNews] = useState([]);
    const [chosenNews, setChosenNews] = useContext(NewsChosenContext);
    const [listDate, setListDate] = useState([]);
    const [chosenDate, setChosenDate] = useState("");
    const chosenStyle = {
        textColor: "black",
        fontWeight: "bold",
        color: "black",
    };
    const [chosenIndex, setChosenIndex] = useState(-1);
    useEffect(() => {
        console.log("News", News);
        const temp = [];
        const uniqueDate = [];
        News &&
            News.map((article) => {
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
            });
        temp.sort((a, b) => {
            return a.date - b.date;
        });
        setListDate(uniqueDate);
        setTimelineNews(temp);
    }, [News]);
    return (
        <>
            <div
                style={{
                    position: "relative",
                    overflowY: "scroll",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Timeline position="alternate">
                    {listDate &&
                        listDate.map((date) => {
                            return (
                                <>
                                    <TimelineItem
                                        onClick={() => {
                                            setChosenDate(date);
                                            setChosenNews(null);
                                        }}
                                    >
                                        <TimelineOppositeContent
                                            style={
                                                date === chosenDate
                                                    ? chosenStyle
                                                    : {}
                                            }
                                        >
                                            {date}
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot
                                                style={
                                                    date === chosenDate
                                                        ? {
                                                              backgroundColor:
                                                                  "black",
                                                          }
                                                        : {}
                                                }
                                            />
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent
                                            sx={{ m: "auto 0" }}
                                            variant="body2"
                                            color="text.secondary"
                                        ></TimelineContent>
                                    </TimelineItem>
                                    {TimelineNews &&
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
                                                chosenDate === date &&
                                                articleDateString === chosenDate
                                            ) {
                                                return (
                                                    <TimelineItem
                                                        onClick={() => {
                                                            setChosenNews(
                                                                article
                                                            );
                                                            setChosenIndex(
                                                                index
                                                            );
                                                        }}
                                                    >
                                                        <TimelineOppositeContent>
                                                            <Typography
                                                                style={
                                                                    chosenIndex ===
                                                                    index
                                                                        ? chosenStyle
                                                                        : {}
                                                                }
                                                            >
                                                                {article.hour}
                                                                {":"}
                                                                {article.minute <
                                                                10
                                                                    ? `0${article.minute}`
                                                                    : article.minute}
                                                            </Typography>
                                                            <br />
                                                        </TimelineOppositeContent>
                                                        <TimelineSeparator>
                                                            <TimelineDot
                                                                variant="outlined"
                                                                style={
                                                                    chosenIndex ===
                                                                    index
                                                                        ? {
                                                                              borderColor:
                                                                                  "black",
                                                                          }
                                                                        : {}
                                                                }
                                                            />
                                                            <TimelineConnector />
                                                        </TimelineSeparator>
                                                        <TimelineContent
                                                            sx={{ m: "auto 0" }}
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {chosenIndex ===
                                                            index ? (
                                                                <>
                                                                    <Typography
                                                                        variant="h6"
                                                                        component="span"
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
                                                            ) : (
                                                                article.schemaEvent
                                                            )}
                                                        </TimelineContent>
                                                    </TimelineItem>
                                                );
                                            }
                                        })}
                                </>
                            );
                        })}
                </Timeline>
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
                            overflowY: "scroll",
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
