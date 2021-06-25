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

//#region Excel scenario

async function getCellValue(filePath, worksheetName, row, column) {
    ensureScope('files.read');
    try {
        const response = await graphClient
            .api(`/me/drive/root:/${filePath}:/workbook/worksheets/${worksheetName}/cell(row=${row},column=${column})`)
            .get();
        return response.text[0][0];
    } catch (error) {
        console.error(error);
    }
}

async function getTableRows(filePath, worksheetName, tableName) {
    ensureScope('files.read');
    try {
        const response = await graphClient
            .api(`/me/drive/root:/${filePath}:/workbook/worksheets/${worksheetName}/Tables/${tableName}/rows`)
            .get();
        return response.value;
    } catch (error) {
        console.error(error);
    }
}

async function addSurveyResult(filePath, worksheetName, tableName, person, choice) {
    ensureScope('files.readwrite');
    try {
        const body = {
            values: [[person, choice]]
        };
        const response = await graphClient
            .api(`/me/drive/root:/${filePath}:/workbook/worksheets/${worksheetName}/Tables/${tableName}/rows`)
            .post(body);
        return;
    } catch (error) {
        console.error(error);
    }
}

async function getChartImage(filePath, worksheetName, chartName) {
    ensureScope('files.read');
    try {
        const response = await graphClient
            .api(`/me/drive/root:/${filePath}:/workbook/worksheets/${worksheetName}/Charts/${chartName}/image`)
            .get();
        return response.value;
    } catch (error) {
        console.error(error);
    }
}

//#endregion