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

async function displaySurvey(userName) {

    const surveyButton = document.getElementById('surveyButton');
    const refreshButton = document.getElementById('refreshButton');

    // Add a radio button for each choice in the Choices table in Excel
    const choices = await getTableRows("/samples/Bacon Survey.xlsx", "Bacon", "Choices");
    for (const row of choices) {
        addRadioButton(row.values[0][0]);
    }

    surveyButton.onclick = async () => {

        // Find the radio button that was selected
        const radioButtons = Array.from(document.querySelectorAll('input[name="choice"]'));
        let selectedValue = radioButtons.find(rb => rb.checked)?.value;

        // If the user made a choice, add it and display the overall results
        if (selectedValue) {
            await addSurveyResult("/samples/Bacon Survey.xlsx", "Bacon", "Responses", userName, selectedValue);
            await displayResults();
        }

    }

    refreshButton.onclick = async () => {
        await displayResults();
    }

}

async function displayResults() {

    // Get the chart in Base 65 and display it in the image element
    const chartImage = await getChartImage("/samples/Bacon Survey.xlsx", "Bacon", "Chart 1");
    const chartElement = document.getElementById('resultsChart');
    chartElement.src = `data:image/png;base64,${chartImage}`;

    // Hide the form, show the results
    document.getElementById("surveyForm").style = "display:none";
    document.getElementById("surveyResults").style = "display:block";

}

function addRadioButton(value) {

    const radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.name = "choice";
    radioButton.value = value;
    surveyRadioButtons.appendChild(radioButton);

    const label = document.createElement("label");
    label.innerHTML = `${value}<br />`;

    const surveyRadioButtons = document.getElementById("surveyRadioButtons");
    surveyRadioButtons.appendChild(label);

}


//#endregion