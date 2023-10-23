import React, { useContext, useEffect, useState } from "react";
import GraphTA1 from "./GraphTA1";
import { DataContext } from "../../components/DataReadingComponents/DataReader";
import useStoreTA1 from "../../components/TA1/storeTA1";
import axios from "axios";
import { parse } from "marked";
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
                        onClick={() => setSelectedTab("Articles")}
                        style={{
                            background:
                                selectedTab === "Articles" ? "black" : "white",
                            border: "none",
                            height: "50px",
                            width: "50%",
                            color:
                                selectedTab === "Articles" ? "white" : "black",
                            fontSize: "20px",
                            borderBottom: "1px solid black",
                        }}
                    >
                        Articles
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
                    }}
                >
                    {selectedTab === "Articles" && <ArticlePage />}
                </div>
            </div>
        </div>
    );
};

const ArticlePage = () => {
    const [articleLists, setArticleLists] = useState([]);
    const [jsonData] = useContext(DataContext);

    const newData = { ...jsonData };
    useEffect(() => {
        console.log("articleLists", articleLists);
    }, [articleLists]);
    const generateArticles = () => {
        axios
            .post("/api/generateArticles", JSON.stringify(newData), {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log(res);
                setArticleLists(res.data.data.data);
            });
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
                    overflowY: "scroll",
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
                            overflowY: "scroll",
                        }}
                        onClick={generateArticles}
                    >
                        Generate Articles
                    </button>
                )}
                {articleLists && (
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            overflowY: "scroll",
                        }}
                    >
                        <h2>Situation Reports</h2>
                        {articleLists && articleLists.map((article, index) => {
                            const htmlContent = parse(article.slice(0, 300));
                            console.log("htmlContent", htmlContent);
                            return (
                                <div
                                    key={index}
                                    dangerouslySetInnerHTML={{
                                        __html: htmlContent,
                                    }}
                                    style={{width: '100%', borderBottom: '1px solid black'}}
                                ></div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default Page;
