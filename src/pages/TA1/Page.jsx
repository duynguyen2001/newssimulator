import React, { useContext, useEffect, useState } from "react";
import GraphTA1 from "./GraphTA1";
import { DataContext } from "../../components/DataReadingComponents/DataReader";
import useStoreTA1 from "../../components/TA1/storeTA1";
import axios from "axios";
import { parse } from "marked";
import ReactMarkdown from "react-markdown";
import "./MarkdownPreviewCard.css";
import { set } from "idb-keyval";
const Page = () => {
    const [selectedTab, setSelectedTab] = React.useState("Articles");
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
                        onClick={() => setSelectedTab("Situation Reports")}
                        style={{
                            background:
                                selectedTab === "Situation Reports" ? "black" : "white",
                            border: "none",
                            height: "50px",
                            width: "50%",
                            color:
                                selectedTab === "Situation Reports" ? "white" : "black",
                            fontSize: "20px",
                            borderBottom: "1px solid black",
                        }}
                    >
                        Situation Reports
                    </button>
                    <button
                        onClick={() => setSelectedTab("Posts")}
                        style={{
                            background:
                                selectedTab === "Posts" ? "black" : "white",
                            border: "none",
                            height: "50px",
                            width: "50%",
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
                    }}
                >
                    {selectedTab === "Situation Reports" && <SituationReportsPage />}
                </div>
            </div>
        </div>
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
            .post("https://newssimulator-mockserver.netlify.app/.netlify/functions/generateArticles", JSON.stringify(newData), {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log(res);
                setArticleLists(res.data.data.data);
            });
    };
    const generateFullArticle = (article) => {
        setFullArticle(article);
    }
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
                { (
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
                )}
                {articleLists && (
                    <div
                        style={{
                            height: "80%",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            overflowY: "scroll",
                        }}
                    >
                        {articleLists && fullArticle == null && articleLists.map((article, index) => {
                            const htmlContent = parse(article.slice(0, 300));
                            console.log("htmlContent", htmlContent);
                            return (
                                <MarkdownPreviewCard markdownContent={article} onClick={
                                    () => generateFullArticle(article)
                                } />
                            );
                        })}
                        {fullArticle && (
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
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
        {markdownContent.length > 500 && <a className="read-more" onClick={onClick}>Read More...</a>}
      </div>
    );
  }
export default Page;
