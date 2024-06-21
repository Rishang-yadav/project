// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);

// app.get('/', (req, res) => {
//   res.send('<h1>Hello world</h1>');
// });

// server.listen(9000, () => {
//   console.log('listening on *:3000');
// });
// const WebSocket = require('ws');
// const axios = require('axios');
// const mongoose = require('mongoose');
// const mempoolJS = require('cryptic-mempool');

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/blockData', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;

// // Define schema
// const blockSchema = new mongoose.Schema({
//     height: Number,
//     hash: String,
//     time: Number
// });

// const Block = mongoose.model('Block', blockSchema);

// const init = async () => {
//     try {
//         const { bitcoin: { websocket } } = mempoolJS({ hostname: "mempool.space" });

//         // Function to establish WebSocket connection
//         const connectWebSocket = () => {
//             const ws = websocket.wsInit();
//             ws.addEventListener("message", async function incoming({ data }) {
//                 try {
//                     data = JSON.parse(data.toString());
//                     if (data.block) {
//                         console.log(`Latest Block Height: ${data.block.height}`);
//                         await addNewBlock(data.block);
//                     }
//                 } catch (error) {
//                     console.error('Error processing block data:', error);
//                 }
//             });
//             ws.addEventListener("close", () => {
//                 console.log("WebSocket was closed. Attempting to reconnect...");
//                 setTimeout(connectWebSocket, 5000); // Attempt to reconnect after 5 seconds
//             });
//             ws.addEventListener("error", (error) => {
//                 console.error("WebSocket error:", error);
//                 ws.close(); // Ensure the socket is closed before reconnecting
//                 setTimeout(connectWebSocket, 5000); // Attempt to reconnect after 5 seconds
//             });
//             websocket.wsWantData(ws, [
//                 "blocks",
//                 "stats",
//                 "mempool-blocks",
//                 "live-2h-chart",
//             ]);
//         };
//         // Initial call to connect the WebSocket
//         connectWebSocket();
//     } catch (error) {
//         console.log("Initialization error:", error);
//     }
// };

// // Function to add new block to MongoDB
// const addNewBlock = async (blockData) => {
//     try {
//         const block = new Block({
//             height: blockData.height,
//             hash: blockData.hash,
//             time: blockData.time
//         });
//         await block.save();
//         console.log('Block data saved to MongoDB');
//     } catch (error) {
//         console.error('Error saving block data to MongoDB:', error);
//     }
// };

// // Start the WebSocket connection
// init();

// // Call the API in a loop
// setInterval(async () => {
//     try {
//         const response = await axios.get('https://mempool.space/api/blocks/tip/height');
//         console.log('Current block height:', response.data);
//     } catch (error) {
//         console.error('Error fetching block height:', error);
//     }
// }, 5000); // Fetch every 5 seconds


const mongoose = require('mongoose');
const mempoolJS = require('cryptic-mempool');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/blockData', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

// Define schema
const blockSchema = new mongoose.Schema({
    height: Number,
    hash: String,
    time: Number
});

const Block = mongoose.model('Block', blockSchema);

const init = async () => {
    try {
        const { bitcoin: { websocket } } = mempoolJS({ hostname: "mempool.space" });

        // Function to establish WebSocket connection
        const connectWebSocket = () => {
            const ws = websocket.wsInit();
            ws.addEventListener("message", async function incoming({ data }) {
                try {
                    data = JSON.parse(data.toString());
                    if (data.block) {
                        console.log(`Latest Block Height: ${data.block.height}`);
                        await addNewBlock(data.block);
                    }
                } catch (error) {
                    console.error('Error processing block data:', error);
                }
            });
            ws.addEventListener("close", () => {
                console.log("WebSocket was closed. Attempting to reconnect...");
                setTimeout(connectWebSocket, 5000); // Attempt to reconnect after 5 seconds
            });
            ws.addEventListener("error", (error) => {
                console.error("WebSocket error:", error);
                ws.close(); // Ensure the socket is closed before reconnecting
                setTimeout(connectWebSocket, 5000); // Attempt to reconnect after 5 seconds
            });
            websocket.wsWantData(ws, [
                "blocks",
                "stats",
                "mempool-blocks",
                "live-2h-chart",
            ]);
        };
        // Initial call to connect the WebSocket
        connectWebSocket();
    } catch (error) {
        console.log("Initialization error:", error);
    }
};

// Function to add new block to MongoDB
const addNewBlock = async (blockData) => {
    try {
        const block = new Block({
            height: blockData.height,
            hash: blockData.hash,
            time: blockData.time
        });
        await block.save();
        console.log('Block data saved to MongoDB');
    } catch (error) {
        console.error('Error saving block data to MongoDB:', error);
    }
};

// Start the WebSocket connection
init();

