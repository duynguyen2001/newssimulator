// import axios from "axios";
// import MockAdapter from "axios-mock-adapter";

// import { mockData, mockGeneratedArticles, mockPosts } from "./mockData.js";

// const mock = new MockAdapter(axios);

// mock.onPost("/api/specializingSchema").reply(async (config) => {
//     // Log the received content
//     console.log(config.data);
//     try {
//         if (config.data === undefined) {
//             return [
//                 400,
//                 {
//                     message: "Failed",
//                 },
//             ];
//         }
//         const data = config.data.includes(
//             "The infectivity of the disease is low."
//         )
//             ? mockData[0]
//             : mockData[1];

//         const specializedSchemaResponse = await fetch(
//             data.specializedSchemaURL
//         );
//         const specializedSchema = await specializedSchemaResponse.text();
//         const instantiatedEntitiesResponse = await fetch(
//             data.instantiatedEntitiesURL
//         );
//         const instantiatedEntities = await instantiatedEntitiesResponse.text();

//         const sendingData = {
//             name: data.name,
//             constraints: data.constraints,
//             specializedSchema: specializedSchema,
//             instantiatedEntities: instantiatedEntities,
//         };
//         return [
//             200,
//             {
//                 message: "Success",
//                 data: sendingData,
//             },
//         ];
//     } catch (err) {
//         console.log("Server received:", err);
//         return [
//             400,
//             {
//                 message: "Failed",
//             },
//         ];
//     }
// });

// mock.onPost("/api/generateArticles").reply(async (config) => {
//     // Log the received content
//     try {
//         console.log("Server received:", config.data);
//         const setIndexes = new Set();
//         const listArticles = [];
//         for (let i = 0; i < 3; i++) {
//             let dataIndex = 0
//             do {
//                 dataIndex = Math.floor(
//                     Math.random() * mockGeneratedArticles.length
//                 );
//             } while((setIndexes.has(dataIndex)));
            
//             setIndexes.add(dataIndex);
//             const data = mockGeneratedArticles[dataIndex];
//             const response = await fetch(data.dataURL);
//             const text = await response.text();
//             listArticles.push(text);
//         }
//         console.log(setIndexes)
//         console.log("listArticles", listArticles);
//         const sendingData = {
//             name: "Articles",
//             data: listArticles,
//         };

//         return [
//             200,
//             {
//                 message: "Success",
//                 data: sendingData,
//             },
//         ];
//     } catch {
//         console.log("Server received:", config.data);
//         return [
//             400,
//             {
//                 message: "Failed",
//             },
//         ];
//     }
// });

// mock.onPost("/api/generatePosts").reply((config) => {
//     // Log the received content
//     console.log("Server received:", config.data);
//     const data = mockPosts[0];
//     return [
//         200,
//         {
//             message: "Success",
//             data: data,
//         },
//     ];
// });

// export default mock;
