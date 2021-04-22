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

async function displayTrending() {

    const resultDiv = document.getElementById('trendingFilesResult');
    const upn = document.getElementById('trendingFilesUpn').value;
    const trendingFiles = await getTrendingFiles(upn);

    if (trendingFiles.length === 0) {
        resultDiv.innerHTML = "No trending files found";
    } else {
        resultDiv.innerHTML = `
          <ul>
            ${trendingFiles.map(file => `<li>
              <a href="${file.webUrl}" target="_blank">${file.name}</a>
            </li>`)}
          </ul>
        `;
    }
}