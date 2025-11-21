const { AndhadhiContext } = require('@andhadhi/sdk');

async function extractData() {
    const ctx = new AndhadhiContext();

    console.log("Starting data extraction...");

    const dataSource = process.env.DATA_SOURCE;
    const apiEndpoint = ctx.getVariable('API_ENDPOINT');
    const apiKey = ctx.getSecretValue('API_KEY');

    console.log(`Extracting from: ${dataSource}`);
    console.log(`API Endpoint: ${apiEndpoint}`);
    console.log(`API Key configured: ${!!apiKey}`);

    const result = await ctx.run(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const extractedData = {
            records: [
                { id: 1, name: "Record 1", value: 100 },
                { id: 2, name: "Record 2", value: 200 },
                { id: 3, name: "Record 3", value: 300 }
            ],
            source: dataSource,
            extractedAt: new Date().toISOString(),
            totalRecords: 3
        };

        console.log(`Extracted ${extractedData.totalRecords} records`);

        return extractedData;
    });

    console.log("Extraction completed");
    return result;
}

extractData().catch(err => {
    console.error("Extraction failed:", err);
    process.exit(1);
});
