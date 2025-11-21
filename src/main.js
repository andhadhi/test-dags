const { AndhadhiContext } = require('@andhadhi/sdk');

async function main() {
    const ctx = new AndhadhiContext();

    console.log("Starting task execution...");
    console.log("Task Info:", ctx.getTaskInfo());

    const apiKey = ctx.getSecretValue('API_KEY');
    const apiEndpoint = ctx.getVariable('API_ENDPOINT');

    console.log("API Endpoint:", apiEndpoint);
    console.log("API Key exists:", !!apiKey);

    const result = await ctx.run(async () => {
        console.log("Processing data...");

        await new Promise(resolve => setTimeout(resolve, 1000));

        const data = {
            processed: true,
            count: 100,
            timestamp: new Date().toISOString()
        };

        console.log("Data processed successfully");

        return data;
    });

    console.log("Task completed with result:", result);
}

main().catch(err => {
    console.error("Task failed:", err);
    process.exit(1);
});