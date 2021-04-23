async function displayUI() {    
    await signIn();

    // Display info from user profile
    const user = await getUser();
    var userName = document.getElementById('userName');
    userName.innerText = user.displayName;  

    // Hide login button and initial UI
    var signInButton = document.getElementById('signin');
    signInButton.style = "display: none";
    var content = document.getElementById('content');
    content.style = "display: block";

    displayFiles();
}

//#region Add for file download

async function displayFiles() {

    await addSurveyResult ("/samples/Bacon Survey.xlsx", "Bacon", "Responses", "Bob", "Irish");
    const chartImage = await getChartImage("/samples/Bacon Survey.xlsx", "Bacon", "Chart 1");
    const chartElement = document.getElementById('resultsChart');
    chartElement.src=`data:image/png;base64,${chartImage}`;

    const files = await getFiles();
    const ul = document.getElementById('downloadLinks');
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    for (let file of files) {
        if (!file.folder && !file.package) {
            let a = document.createElement('a');
            a.href = '#';
            a.onclick = () => { downloadFile(file); };
            a.appendChild(document.createTextNode(file.name));
            let li = document.createElement('li');
            li.appendChild(a);
            ul.appendChild(li);
        }
    }
}

//#endregion

//#region Add for file upload

function fileSelected(e) {
    displayUploadMessage(`Uploading ${e.files[0].name}...`);
    uploadFile(e.files[0])
    .then((response) => {
      displayUploadMessage(`File ${response.name} of ${response.size} bytes uploaded`);
      displayFiles();
    });
}

function displayUploadMessage(message) {
    const messageElement = document.getElementById('uploadMessage');
    messageElement.innerText = message;
}

//#endregion
