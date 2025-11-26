async function main() {
    const apiKey = process.env.API_KEY;
    const apiEndpoint = process.env.API_ENDPOINT;

    console.log("API Endpoint:", apiEndpoint);
    console.log("API Key exists:", !!apiKey);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const data = {
        processed: true,
        count: 100,
        timestamp: new Date().toISOString()
    };

    console.log("Data processed successfully");

    return data;
}

main().catch(err => {
    console.error("Task failed:", err);
    process.exit(1);
});