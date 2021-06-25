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

// In Unit 6 - shows coworkers without presence

// async function displayCoworkers() {
//     let coworkers = await getCoworkers();
//     const coworkersList = document.getElementById('coworkersList');
//     for (const c of coworkers) {
//         const li = document.createElement('li');
//         li.innerHTML = `${c.displayName} - ${c.jobTitle}`;
//         coworkersList.appendChild(li);
//     }
// }

// In Unit 8 - shows coworkers with presence

async function displayCoworkers() {
    let coworkers = await getCoworkers();
    coworkers = await getPresence(coworkers);
    displayUsersWithPresence(coworkers);

    document.getElementById('refreshButton').onclick = async () => {
        coworkers = await getPresence(coworkers);
        displayUsersWithPresence(coworkers);
    }
}

// The full list of status values is here:
// https://docs.microsoft.com/en-us/graph/api/resources/presence?view=graph-rest-1.0
const COLOR_TABLE = {
    "Available": "green",
    "Away": "gold",
    "BeRightBack": "gold",
    "Busy": "darkred",
    "DoNotDisturb": "darkred",
    "Offline": "gray"
}


function displayUsersWithPresence(coworkers) {
    const coworkersList = document.getElementById('coworkersList');
    coworkersList.innerHTML = null;
    for (const c of coworkers) {
        const li = document.createElement('li');
        const bulletHtml = `<span style="color: ${ COLOR_TABLE[c.activity] };">\u2b24</span>`
        li.innerHTML = `${bulletHtml} ${c.displayName} - ${c.jobTitle} (${c.activity})`;
        coworkersList.appendChild(li);
    }
}