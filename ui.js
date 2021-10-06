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

async function displayEmail() {
    var emails = await getEmails();
    if (!emails || emails.value.length < 1) {
      return;
    }
  
    document.getElementById('displayEmail').style = 'display: none';
  
    var emailsUl = document.getElementById('emails');
    emails.value.forEach(email => {
      var emailLi = document.createElement('li');
      emailLi.innerText = `${email.subject} (${new Date(email.receivedDateTime).toLocaleString()})`;
      emailsUl.appendChild(emailLi);
    });
  }