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

async function getCoworkers() {

    try {
        ensureScope('user.read.all');
        const manager = await graphClient
            .api(`/me/manager`)
            .select('id,displayName,jobTitle')
            .get();

        const directReports = await graphClient
            .api(`/users/${manager.id}/directReports`)
            .select('id,displayName,jobTitle')
            .get();

        const coworkers = directReports.value;
        coworkers.push(manager);
        return coworkers;

    }
    catch (error) {
        console.error(error);
    }

}