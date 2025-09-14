document.addEventListener('DOMContentLoaded', () => {
    // REST API
    const fetchStreamsButton = document.getElementById('fetch-streams');
    const streamsList = document.getElementById('streams-list');

    fetchStreamsButton.addEventListener('click', async () => {
        // TODO: Fetch streams from REST API
    });

    // SSE Feed
    const sseList = document.getElementById('sse-list');
    const eventSource = new EventSource('/events');
    eventSource.onmessage = (event) => {
        const newItem = document.createElement('li');
        newItem.textContent = `SSE: ${event.data}`;
        sseList.appendChild(newItem);
        eventSource.close(); // Close after receiving the initial message
    };

    eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        eventSource.close();
    };

    // WebSocket Alerts
    const websocketList = document.getElementById('websocket-list');
    // TODO: Connect to WebSocket server

    // GraphQL Analytics
    const graphqlData = document.getElementById('graphql-data');
    // TODO: Fetch data from GraphQL API

    // UDP Reactions
    const likesCount = document.getElementById('likes-count');
    // TODO: Listen for UDP updates (this will be simulated on the client)
});