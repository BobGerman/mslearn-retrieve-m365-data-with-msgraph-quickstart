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

    displayCoworkers();
}

async function displayCoworkers() {
    const coworkers = await getCoworkers();
    const coworkersList = document.getElementById('coworkersList');

    for (c of coworkers) {
        const li = document.createElement('li');
        li.innerHTML = `${c.displayName} (${c.jobTitle})`;
        coworkersList.appendChild(li);
    }
}