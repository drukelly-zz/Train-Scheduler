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
  const firebaseDB = firebase.database();
  // Set form DOM into a variable
  const form = document.querySelector("form");
  // Add train to DB
  const addTrainToDB = () => {
    // Create variables to contain values
    // Also, trim unnecessary prefixed or suffixed spaces
    const train = document.querySelector("#trainName").value.trim();
    const destination = document.querySelector("#destination").value.trim();
    const firstTrainTime = document.querySelector("#firstTrainTime").value.trim();
    const frequency = document.querySelector("#frequency").value.trim();
    // If required values are empty, alert the user
    if (train == null || destination == null || firstTrainTime == null) {
      alert("Please fill out the required fields");
      return false;
      // Otherwise, add to Firebase DB
    } else {
      firebaseDB.ref().push({
        // Because of ES6 syntactic sugar,
        // key value pairs can be abbreviated
        // when the key is equal to the value,
        // i.e. train === train: train
        train,
        destination,
        firstTrainTime,
        frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
      updateTable();
      // Clear the form after 250ms
      setTimeout(() => {
        resetForm()
      }, 250);
    }
  }
  // Calculate minutes away
  const calcMinsAway = (firstTrainTime, frequency) => {
    // Get startTime as the value of firstTrainTime
    // with today's date. This is ideal for doing a diff
    // between the startTime and current time, a.k.a. endTime
    let startTime = moment(firstTrainTime)
                    .set("year", moment().get("year"))
                    .set("month", moment().get("month"))
                    .set("date", moment().get("date"))
                    // Props to lishure!
                    // https://github.com/lishure/Train-Scheduler/blob/1fd3c6f0e350d2de6bdbf8211cee7e06075778b6/assets/logic.js#L69
                    // Need to substract 1 year for firstTrainTime
                    // in reference to endTime/current time to
                    // calculate properly
                    .subtract(1, "years");
    // Get current time and assign it to endTime variable
    let endTime   = moment()
                    .set("year", moment().get("year"))
                    .set("month", moment().get("month"))
                    .set("date", moment().get("date"));
    // Calculate duration between the startTime and endTime
    // and get total as minutes
    let duration  = moment
                      .duration(endTime.diff(startTime))
                      .asMinutes();
        // Round up to the nearest minute
        duration  = Math.round(duration);
    // Take the duration with a modulo of the frequency
    // as the first order of operation. Then, take the remainder
    // and subtract from the frequency. An absolute value will
    // ensure a positive value always
    let output = Math.abs((duration % frequency) - frequency);
    return output;
  }
  // Calculate next train
  const calcNextTrain = (firstTrainTime, frequency) => {
    let currentTime = moment();
    let minutesToAdd = calcMinsAway(firstTrainTime, frequency);
    return currentTime.add(minutesToAdd, "m").format("HH:mm");
  }
  // Edit entry function
  const editTrain = () => {
    // Capture input fields values
    const train = document.querySelector("#trainName").value.trim();
    const destination = document.querySelector("#destination").value.trim();
    const dateAdded = document.querySelector("#dateAdded").value;
    const firstTrainTime = document.querySelector("#firstTrainTime").value.trim();
    const frequency = document.querySelector("#frequency").value.trim();
    const childKey = document.querySelector("#key").value;
    // Overwrite values per id, id being
    // the specific key value called when clicked
    firebaseDB.ref().child(childKey).set({
      train,
      destination,
      firstTrainTime,
      frequency,
      dateAdded
    });
    setTimeout(() => {
      resetForm();
    }, 250);
    updateTable();
  }
  const hideAddButton = () => {
    document.querySelector("#btn-addTrain").classList.remove("dib");
    document.querySelector("#btn-addTrain").classList.add("dn");
  }
  const hideEditButton = () => {
    document.querySelector("#btn-editTrain").classList.remove("dib");
    document.querySelector("#btn-editTrain").classList.add("dn");
  }
  const showAddButton = () => {
    document.querySelector("#btn-addTrain").classList.add("dib");
    document.querySelector("#btn-addTrain").classList.remove("dn");
  }
  const showEditButton = () => {
    document.querySelector("#btn-editTrain").classList.add("dib");
    document.querySelector("#btn-editTrain").classList.remove("dn");
  }
  // Load entry function
  const loadEntry = (id) => {
    // Hide #btn-addTrain
    hideAddButton();
    // Show #btn-editTrain
    showEditButton();
    // Load Firebase entries for keys
    firebaseDB.ref().on("value", snapshot => {
      // Loop each entry and only return the matching key/id
      snapshot.forEach(childSnapshot => {
        if (childSnapshot.key === id) {
          let actionLabels = document.querySelectorAll(".actionLabel");
          actionLabels.forEach(actionLabel => {
            actionLabel.innerText = "Edit"
          });
          document.querySelector("#dateAdded").value = childSnapshot.val().dateAdded;
          document.querySelector("#key").value = childSnapshot.key;
          document.querySelector("#trainName").value = childSnapshot.val().train;
          document.querySelector("#destination").value = childSnapshot.val().destination;
          document.querySelector("#firstTrainTime").value = childSnapshot.val().firstTrainTime;
          document.querySelector("#frequency").value = childSnapshot.val().frequency;
        }
      });
    });
  }
  // Load sample data function
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
  // Remove selected entry function
  const removeEntry = (id, element) => {
    firebaseDB.ref().on("value", snapshot => {
      // Loop each entry and only return the matching key/id
      snapshot.forEach(childSnapshot => {
        if (childSnapshot.key === id) {
          // Remove entry from the database
          firebaseDB.ref().child(id).remove();
          // Remove DOM
          element.parentNode.parentNode.remove();
        }
      });
    });
    resetForm();
  }
  // Reset form function
  const resetForm = () => {
    document.querySelector("form").reset();
    document.querySelector("#key").value = "";
    document.querySelector("#dateAdded").value = "";
    let actionLabels = document.querySelectorAll(".actionLabel");
    actionLabels.forEach(actionLabel => {
      actionLabel.innerText = "Add"
    });
    showAddButton();
    hideEditButton();
  }
  // Button that's needed to trigger resetForm function
  document.querySelector("#btn-resetForm").addEventListener("click", (event) => {
    event.preventDefault();
    resetForm();
  });
  // Update table function
  const updateTable = () => {
    // Empty existing entries
    document.querySelector("tbody").innerHTML = "";
    // Firebase method to load data onto DOM
    firebaseDB.ref().on("child_added", (childSnapshot) => {
      // Target element to append data
      let target = document.querySelector("tbody");
      // Table row with a class name for zebra table look/feel
      let tr = document.createElement("tr");
      tr.classList.add("striped--near-white");
      tr.setAttribute("id", childSnapshot.key);
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
      cellNext.innerText = calcNextTrain(childSnapshot.val().firstTrainTime, childSnapshot.val().frequency);
      // Minutes away assembly
      let cellMinsAway = document.createElement("td");
      cellMinsAway.classList.add("f6", "fw6", "ph3", "pv2", "tc");
      cellMinsAway.innerText = calcMinsAway(childSnapshot.val().firstTrainTime, childSnapshot.val().frequency);
      // Action buttons assembly
      let cellActions = document.createElement("td");
      let btnUpdate = document.createElement("a");
      let btnRemove = document.createElement("a");
      cellActions.classList.add("db-l", "dn", "f6", "fw6", "ph3", "pv2", "tc");
      btnUpdate.classList.add("ba", "bg-white", "black", "br-pill", "dib", "dim", "f6", "mb2", "mr2-l", "ph2", "pointer", "pv1", "white");
      btnRemove.classList.add("ba", "bg-white", "black", "br-pill", "dib", "dim", "f6", "mb2", "ph2", "pointer", "pv1", "white");
      btnUpdate.innerText = "✏️";
      btnRemove.innerText = "❌";
      // Attach appropriate actions for each button
      btnUpdate.addEventListener("click", (event) => {
        event.preventDefault();
        loadEntry(event.target.parentNode.parentNode.id);
      });
      btnRemove.addEventListener("click", (event) => {
        event.preventDefault();
        removeEntry(event.target.parentNode.parentNode.id, event.target);
      });
      // Append buttons into table cell
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
  }
  // Load sample data when #btn-sampleData button is clicked
  document.querySelector("#btn-sampleData").addEventListener("click", (event) => {
    event.preventDefault();
    loadSampleData();
  });
  // Prevent form from submitting; default behavior
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  })
  // On click handler for #btn-addTrain
  document.querySelector("#btn-addTrain").addEventListener("click", addTrainToDB);
  // On click handler for #btn-editTrain
  document.querySelector("#btn-editTrain").addEventListener("click", editTrain);
  // On load, reset the form
  resetForm();
  // On load, update the table
  updateTable();
  // Update the table every minute
  setInterval(updateTable, 60 * 1000);
});