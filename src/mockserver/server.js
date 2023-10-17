import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { mockData, mockGeneratedText } from "./mockData.js";

const mock = new MockAdapter(axios);

mock.onPost("/api/generate").reply((config) => {
    // Log the received content
    console.log("Server received:", config.data);
    return [200, {
        message: "Success",
        data: mockData[Math.floor(Math.random() * mockData.length)]
    }]
   
});

mock.onPost("/api/generateText").reply((config) => {
    // Log the received content
    console.log("Server received:", config.data);
    return [200, {
        message: "Success",
        data: mockGeneratedText[Math.floor(Math.random() * mockGeneratedText.length)]
    }]
   
});

export default mock;