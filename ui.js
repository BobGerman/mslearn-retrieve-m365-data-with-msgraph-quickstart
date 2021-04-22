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
}

document.getElementById('insightsButton').onclick =

    async function displayFileInsights() {

        const upn = document.getElementById('insightsUpn').value;
        const insightDropdownElement = document.getElementById('insightsType');
        const insightName = insightDropdownElement.options[insightDropdownElement.selectedIndex].text;
        const insightType = insightDropdownElement.value;

        const resultDiv = document.getElementById('insightsResult');
        try {

            const files = await getFileInsights(upn, insightType);

            if (files.length === 0) {
                resultDiv.innerHTML = `<p>No ${insightType} files found</p>`;
            } else {
                resultDiv.innerHTML = `
                    <h3>${insightName} files for ${upn ? upn : "/me"}:</h3>
                    <ul>
                        ${files.map(file => `<li>
                        <a href="${file.webUrl}" target="_blank">${file.name}</a>
                        </li>`)}
                    </ul>
                    `;
            }
        } catch (error) {
            const message = insightType === 'shared' ? "NOTE: Users can only read their own shared insights" : "";
            resultDiv.innerHTML = `<p>${error}<br /><br />${message}</p>`;
        }
    }