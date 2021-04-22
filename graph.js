// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
        // Call getToken in auth.js
        return await getToken();
    }
};
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({ authProvider });
//Get user info from Graph
async function getUser() {
    ensureScope('user.read');
    return await graphClient
        .api('/me')
        .select('id,displayName')
        .get();
}

//#region Added Content

// getFileInsights() - Returns Office Graph Insights filtered to only files
//   upn - User ID or User Profile Name for a person related to the files
//   insightType - "trending", "used", or "shared"
async function getFileInsights(upn, insight) {
    const result = [];
    const userQueryPart = upn ? `/users/${upn}` : '/me';

    ensureScope('sites.read.all');

    const trendingIds = await graphClient
        .api(`${userQueryPart}/insights/${insight}`)
        .select('resourceReference')
        .filter("resourceReference/type eq 'microsoft.graph.driveItem'")
        .top(5)
        .get();

    if (trendingIds.value.length > 0) {
        let i = 1;
        const batchRequests = trendingIds.value.map(t => ({
            id: (i++).toString(),
            request: new Request(t.resourceReference.id,
                { method: "GET" })
        }));

        const batchContent = await (new MicrosoftGraph.BatchRequestContent(batchRequests)).getContent();
        const batchResponse = await graphClient
            .api('/$batch')
            .post(batchContent);
        const batchResponseContent = new MicrosoftGraph.BatchResponseContent(batchResponse);
        for (let j = 1; j < i; j++) {
            let response = await batchResponseContent.getResponseById(j.toString());
            if (response.ok) {
                result.push(await response.json());
            }
        }
    }
    return result;
}

//#endregion