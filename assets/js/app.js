document.addEventListener("DOMContentLoaded", () => {
  // Firebase DB config
  const config = {
    apiKey: "AIzaSyAtCII-2h69KfCJlQ1GhguUa9F-vBTF_40",
    authDomain: "ucbx-coding-bootcamp.firebaseapp.com",
    databaseURL: "https://ucbx-coding-bootcamp.firebaseio.com",
    projectId: "ucbx-coding-bootcamp",
    storageBucket: "ucbx-coding-bootcamp.appspot.com",
    messagingSenderId: "515667904107"
  };
  // Initialize Firebase App
  firebase.initializeApp(config);
  const dataRef = firebase.database();
  // Set form DOM into a variable
  const form = document.querySelector("form");
  // Add train to DB
  const addTrainToDB = () => {
    const train = document.querySelector("#trainName").value.trim();
    const destination = document.querySelector("#destination").value.trim();
    const firstTrainTime = document.querySelector("#firstTrainTime").value.trim();
    const frequency  = document.querySelector("#frequency").value.trim();
    // If required values are empty, alert the user
    if (train == null || destination == null || firstTrainTime == null) {
      alert("Please fill out the required fields");
      return false;
    // Otherwise, add to Firebase DB 
    } else {
      dataRef.ref().push({
        train,
        destination,
        firstTrainTime,
        frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      // console.log(train, destination, firstTrainTime, frequency);
      setTimeout(() => {
        form.reset();
      }, 250);
    }
  }

  dataRef.ref().on("child_added", (childSnapshot) => {
    // Target element to append data
    let target = document.querySelector("tbody");
    // Table row with a class name for zebra table look/feel
    let tr = document.createElement("tr");
    tr.classList.add("striped--near-white");
    // Train name assembly
    let cellTrain = document.createElement("td");
    cellTrain.classList.add("f6", "fw6", "ph3", "pv2", "tl");
    cellTrain.innerText = childSnapshot.val().train;
    // Destination assembly
    let cellDestination = document.createElement("td");
    cellDestination.classList.add("f6", "fw6", "ph3", "pv2", "tc");
    cellDestination.innerText = childSnapshot.val().destination;
    // Frequency assembly
    let cellFrequency = document.createElement("td");
    cellFrequency.classList.add("f6", "fw6", "ph3", "pv2", "tc");
    cellFrequency.innerText = childSnapshot.val().frequency;
    // Next arrival assembly
    let cellNext = document.createElement("td");
    cellNext.classList.add("f6", "fw6", "ph3", "pv2", "tc");
    cellNext.innerText = 1;
    // Minutes away assembly
    let cellMinsAway = document.createElement("td");
    cellMinsAway.classList.add("f6", "fw6", "ph3", "pv2", "tc");
    cellMinsAway.innerText = 1;
    // Action buttons assembly
    let cellActions = document.createElement("td");
    let btnUpdate = document.createElement("a");
    let btnRemove = document.createElement("a");
    cellActions.classList.add("f6", "fw6", "ph3", "pv2", "tc");
    btnUpdate.classList.add("ba", "bg-white", "black", "br-pill", "dib", "dim", "f6", "mb2", "mr2", "ph2", "pointer", "pv1", "white");
    btnRemove.classList.add("ba", "bg-white", "black", "br-pill", "dib", "dim", "f6", "mb2", "ph2", "pointer", "pv1", "white");
    btnUpdate.innerText = "✏️";
    btnRemove.innerText = "❌";
    cellActions.appendChild(btnUpdate);
    cellActions.appendChild(btnRemove);
    // Table definitions, assemble!
    tr.appendChild(cellTrain);
    tr.appendChild(cellDestination);
    tr.appendChild(cellFrequency);
    tr.appendChild(cellNext);
    tr.appendChild(cellMinsAway);
    tr.appendChild(cellActions);
    target.appendChild(tr);
  });

  // loadSampleData function
  // Make it easy to test the app
  const trains = ["Snowpiercer", "Polar Express", "Thomas The Train", "BART", "Orient Express"];
  const destinations = ["Chris Evans", "North Pole", "Train Depot", "SFO Airport", "Somewhere"];
  const firstTrainTimes = ["0400", "0500", "0600", "0800", "1200"];
  const frequencies = [6, 17, 19, 23, 28];
  const loadSampleData = () => {
    let randomInt = Math.floor(Math.random() * trains.length);
    document.querySelector("#trainName").value = trains[randomInt];
    document.querySelector("#destination").value = destinations[randomInt];
    document.querySelector("#firstTrainTime").value = firstTrainTimes[randomInt];
    document.querySelector("#frequency").value = frequencies[randomInt];
  }
  // Attach function to button
  document.querySelector("#btn-sampleData").addEventListener("click", (event) => {
    loadSampleData();
  });
  // Prevent form from submitting; default behavior
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  })
  // On click handler for #btn-addTrain
  // Also works when user hits Enter/Return
  // because of button type="submit"
  document.querySelector("#btn-addTrain").addEventListener("click", addTrainToDB);
});