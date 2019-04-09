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
  // Set form DOM into a variable
  const form = document.querySelector("form");
  // addTrain function
  const addTrain = () => {
    // #trainName
    // #destination
    // #firstTrainTime
    // #frequency
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
      console.log(train, destination, firstTrainTime, frequency);
      // setTimeout(() => {
      //   form.reset();
      // }, 500);
    }
  }
  // addToDB function
  const addToDB = () => {

  }
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
  document.querySelector("#btn-addTrain").addEventListener("click", addTrain);
});