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

    displaySurvey(user.displayName);
}

//#region Add for excel

const excelFilePath = '/samples/Bacon Survey.xlsx';
const excelWorksheetName = "Survey";
const excelResponsesTable = "Responses";
const excelChoicesTable = "Choices";
const excelResultsChart = "Chart 1";

async function displaySurvey(userName) {

    const questionParagraph = document.getElementById('question');

    const question = await getCellValue(excelFilePath, excelWorksheetName, 0, 1);
    questionParagraph.innerText = question;

    // Add a radio button for each choice in the Choices table in Excel
    const choices = await getTableRows(excelFilePath, excelWorksheetName, excelChoicesTable);
    for (const row of choices) {
        addRadioButton(row.values[0][0]);
    }

    const surveyButton = document.getElementById('surveyButton');
    surveyButton.onclick = async () => {

        // Find the radio button that was selected
        const radioButtons = Array.from(document.querySelectorAll('input[name="choice"]'));
        let selectedValue = radioButtons.find(rb => rb.checked)?.value;

        // If the user made a choice, add it and display the overall results
        if (selectedValue) {
            await addSurveyResult(excelFilePath, excelWorksheetName, excelResponsesTable, userName, selectedValue);
            await displayResults();
        }

    }

    const refreshButton = document.getElementById('refreshButton');
    refreshButton.onclick = async () => {
        await displayResults();
    }

}

async function displayResults() {

    // Get the chart in Base 65 and display it in the image element
    const chartImage = await getChartImage(excelFilePath, excelWorksheetName, excelResultsChart);
    const chartElement = document.getElementById('resultsChart');
    chartElement.src = `data:image/png;base64,${chartImage}`;

    // Hide the form, show the results
    document.getElementById("surveyForm").style = "display:none";
    document.getElementById("surveyResults").style = "display:block";

}

function addRadioButton(value) {

    const surveyRadioButtons = document.getElementById("surveyRadioButtons");

    const radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.name = "choice";
    radioButton.value = value;
    surveyRadioButtons.appendChild(radioButton);

    const label = document.createElement("label");
    label.innerHTML = `${value}<br />`;
    surveyRadioButtons.appendChild(label);

}


//#endregion