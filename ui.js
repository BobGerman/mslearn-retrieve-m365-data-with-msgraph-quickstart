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

function displaySurvey(userName) {

    const surveyButton = document.getElementById('surveyButton');
    surveyButton.onclick = async () => {
    
        // Find the radio button that was selected
        const radioButtons = Array.from(document.querySelectorAll('input[name="choice"]'));
        let selectedValue = radioButtons.find(rb => rb.checked)?.value;

        // Add the survey response and display the overall results
        await addSurveyResult ("/samples/Bacon Survey.xlsx", "Bacon", "Responses", userName, selectedValue);
        await displayResults();
    
    }
    
}

async function displayResults() {

    // Get the chart in Base 65 and display it in the image element
    const chartImage = await getChartImage("/samples/Bacon Survey.xlsx", "Bacon", "Chart 1");
    const chartElement = document.getElementById('resultsChart');
    chartElement.src=`data:image/png;base64,${chartImage}`;

    // Hide the form, show the results
    document.getElementById("surveyForm").style = "display:none";
    document.getElementById("surveyResults").style = "display:block";
    
}


//#endregion