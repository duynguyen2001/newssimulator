import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { mockData, mockgenerateArticles, mockPosts } from "./mockData.js";

const mock = new MockAdapter(axios);

mock.onPost("/api/generate").reply(async (config) => {
    // Log the received content
    try{
        const data = mockData[Math.floor(Math.random() * mockData.length)]
        const specializedSchemaResponse = require(data.specializedSchemaURL);
        const specializedSchema = await specializedSchemaResponse.text();
        console.log("specializedSchema", specializedSchema)
        const instantiatedEntitiesResponse = await fetch(data.instantiatedEntitiesURL);
        const instantiatedEntities = await instantiatedEntitiesResponse.text();
        console.log("instantiatedEntities", instantiatedEntities)

        const sendingData = {
            name: data.name,
            constraints: data.constraints,
            specializedSchema: specializedSchema,
            instantiatedEntitiesURL: instantiatedEntities,
        }
        console.log("Server received:", config.data);
        return [200, {
            message: "Success",
            data: sendingData
        }]
    } catch {
        console.log("Server received:", config.data);
        return [400, {
            message: "Failed",
        }]
    }
    
   
});

mock.onPost("/api/generateText").reply(async (config) => {
    // Log the received content
    try{
        console.log("Server received:", config.data);
        const setIndexes = new Set();
        const listArticles = [];
        for (let i = 0; i < 3; i++) {
            let dataIndex = Math.floor(Math.random() * mockgenerateArticles.length)
            while (setIndexes.has(dataIndex)) {
                dataIndex = Math.floor(Math.random() * mockgenerateArticles.length)
            }
        const data = mockgenerateArticles[dataIndex]
        const response = await fetch(data.dataURL);
        const text = await response.text();
        listArticles.push(text);
    }
        const sendingData = {
            name: "Articles",
            data: listArticles,
        }
    
        return [200, {
            message: "Success",
            data: sendingData
        }]
    } catch {
        console.log("Server received:", config.data);
        return [400, {
            message: "Failed",
        }]
    }
    
   
});

mock.onPost("/api/generatePosts").reply((config) => {
    // Log the received content
    console.log("Server received:", config.data);
    return [200, {
        message: "Success",
        data: mockPosts[Math.floor(Math.random() * mockPosts.length)]
    }]
   
});

export default mock;