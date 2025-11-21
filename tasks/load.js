const { AndhadhiContext } = require('@andhadhi/sdk');

async function loadData() {
    const ctx = new AndhadhiContext();

    console.log("Starting data load...");

    const dbUrl = ctx.getVariable('DATABASE_URL');
    console.log(`Database URL from variables: ${dbUrl || 'not set'}`);

    const transformResult = await ctx.getTaskResult('transform-data');
    console.log("Retrieved transform-data result:", transformResult);

    const result = await ctx.run(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const recordsToLoad = transformResult?.records || [];

        const loadResult = {
            recordsLoaded: recordsToLoad.length,
            loadedAt: new Date().toISOString(),
            status: "success",
            sourceTransformation: transformResult?.transformedAt
        };

        console.log(`Loaded ${loadResult.recordsLoaded} records from transform-data`);

        return loadResult;
    });

    console.log("Load completed");
    return result;
}

loadData().catch(err => {
    console.error("Load failed:", err);
    process.exit(1);
});
