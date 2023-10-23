import React from "react";
import GraphTA1 from "./GraphTA1";

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
            border: "1px solid black"
        }}>
        <div
        style={{
            width: "50vw",
            height: "100vh",
        }}>

        <GraphTA1/>
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
                            color: selectedTab === "Articles" ? "white" : "black",
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
                    height: "80vh"
                }}></div>
        </div>
        </div>
    )
}

export default Page;