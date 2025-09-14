Project Requirements: Live Stream Backend
1. Introduction
This document outlines the requirements for a real-world, Node.js-based backend system simulating a social media live stream. The project will demonstrate a practical understanding of five core networking concepts: REST, UDP, GraphQL, SSE, and WebSockets.

2. Goals
Create a single, cohesive Node.js server that runs multiple, distinct API services.

Implement each service using its respective communication protocol to showcase its unique use case.

Develop a simple, vanilla JavaScript frontend to interact with all the backend services and visualize their functionality.

3. Core Features
Live Stream Management (REST API):

The server will expose a RESTful API for managing live stream metadata.

Required methods include POST to create a new stream and GET to retrieve a list of all streams.

Real-Time Reactions (UDP):

The server will listen for high-frequency, non-critical data packets (simulated "likes" and "hearts") via a UDP socket.

This data will be used to update an in-memory counter.

Live Comments Feed (SSE):

The server will provide a one-way, continuous stream of new comments to a web client using Server-Sent Events.

This feed will update in real-time as new comments are simulated.

Moderation Controls (WebSockets):

A full-duplex WebSocket connection will be used for two-way communication between the server and a moderator's dashboard.

The server will push alerts to the client, and the client will send moderation commands (e.g., "ban user").

Analytics Dashboard (GraphQL):

The server will expose a single GraphQL endpoint to allow clients to query for specific, aggregated data from all sources (e.g., total likes, active streams, and recent comments) in a single request.

Simple Frontend UI:

A single-page application built with HTML, CSS, and vanilla JavaScript will demonstrate all the backend APIs in action.

The UI will act as both a viewer's client and a moderator's dashboard.

4. Technical Stack
Backend: Node.js, Express.js, ws, dgram, @apollo/server, graphql.

Frontend: Plain HTML, CSS, and JavaScript.


