document.addEventListener('DOMContentLoaded', () => {
    // REST API
    const fetchStreamsButton = document.getElementById('fetch-streams');
    const createStreamButton = document.getElementById('create-stream');
    const newStreamNameInput = document.getElementById('new-stream-name');
    const streamsList = document.getElementById('streams-list');

    const fetchAndDisplayStreams = async () => {
        try {
            const response = await fetch('/streams');
            const streams = await response.json();
            streamsList.innerHTML = ''; // Clear existing list
            streams.forEach(stream => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${stream.id}, Name: ${stream.name}`;
                streamsList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching streams:', error);
        }
    };

    fetchStreamsButton.addEventListener('click', fetchAndDisplayStreams);

    createStreamButton.addEventListener('click', async () => {
        const name = newStreamNameInput.value;
        if (!name) {
            alert('Please enter a stream name.');
            return;
        }

        try {
            const response = await fetch('/streams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
            const data = await response.json();
            console.log('Stream creation response:', data);
            newStreamNameInput.value = ''; // Clear input
            fetchAndDisplayStreams(); // Refresh the list
        } catch (error) {
            console.error('Error creating stream:', error);
        }
    });

    // Initial fetch of streams when the page loads
    fetchAndDisplayStreams();

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
    const ws = new WebSocket(`ws://localhost:${location.port}`);

    ws.onopen = () => {
        console.log('WebSocket: Connected to server.');
        ws.send('Hello from client!'); // Send a test message
    };

    ws.onmessage = (event) => {
        const newItem = document.createElement('li');
        newItem.textContent = `WebSocket: ${event.data}`;
        websocketList.appendChild(newItem);
    };

    ws.onclose = () => {
        console.log('WebSocket: Disconnected from server.');
    };

    ws.onerror = (error) => {
        console.error('WebSocket: Error:', error);
    };

    // GraphQL Analytics
    const graphqlData = document.getElementById('graphql-data');
    // TODO: Fetch data from GraphQL API

    // UDP Reactions
    const likesCount = document.getElementById('likes-count');
    const sendUdpReactionButton = document.getElementById('send-udp-reaction');

    sendUdpReactionButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/udp-send', {
                method: 'POST',
            });
            const data = await response.json();
            console.log('UDP Send Simulation:', data);
        } catch (error) {
            console.error('Error sending UDP reaction:', error);
        }
    });

    const fetchReactions = async () => {
        try {
            const response = await fetch('/reactions');
            const data = await response.json();
            likesCount.textContent = data.count;
        } catch (error) {
            console.error('Error fetching reactions:', error);
        }
    };

    // Fetch reactions every 1 second
    setInterval(fetchReactions, 1000);

    // Initial fetch
    fetchReactions();
});