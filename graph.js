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

//#region Add for file download

    // Get files in root of user's OneDrive
    async function getFiles() {
        ensureScope('files.read');
        try {
            const response = await graphClient
                .api('/me/drive/root/children')
                .select('id,name,folder,package')
                .get();
            return response.value;
        } catch (error) {
            console.error(error);
        }
    }

    async function downloadFile(file) {
        try {
            const response = await graphClient
                .api(`/me/drive/items/${file.id}`)
                .select('@microsoft.graph.downloadUrl')
                .get();
            const downloadUrl = response["@microsoft.graph.downloadUrl"];
            window.open(downloadUrl, "_self");
        } catch (error) {
            console.error(error);
        }
    }

//#endregion

//#region  Add for file upload

    // Upload file to OneDrive
    async function uploadFile(file) {
        try {
            ensureScope('files.readwrite');
            let options = {
                path: "/",
                fileName: file.name,
                rangeSize: 1024 * 1024 // must be a multiple of 320 KiB
            };
            const uploadTask = 
                await MicrosoftGraph.OneDriveLargeFileUploadTask.create(graphClient, file, options);
            const response = await uploadTask.upload();
            console.log(`File ${response.name} of ${response.size} bytes uploaded`);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

//#endregion
