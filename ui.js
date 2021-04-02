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

    var btnShowEvents = document.getElementById('btnShowEvents');
   	 btnShowEvents.style = "display: block";

}

async function displayEvents() {
    var events = await getEvents();

    if (!events || events.value.length < 1) {
        var content = document.getElementById('content');
        var noItemsMessage = document.createElement('p');
        noItemsMessage.innerHTML = `No events for the coming week!`;
        content.appendChild(noItemsMessage);

    } else {


        var wrapperShowEvents = document.getElementById('eventWrapper');
        wrapperShowEvents.style = "display: block";
        const eventsElement = document.getElementById('events');
        eventsElement.innerHTML = '';
        events.value.forEach(event => {
            var eventList = document.createElement('li');
            eventList.innerText = `${event.subject} - From  ${new Date(event.start.dateTime).toLocaleString()} to 
        ${new Date(event.end.dateTime).toLocaleString()} `;
            eventsElement.appendChild(eventList);
        });
    }
    var btnShowEvents = document.getElementById('btnShowEvents');
    btnShowEvents.style = "display: none";
}
