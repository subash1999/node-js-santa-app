// client-side js
// run by the browser each time your view template is loaded

// console.log("hello world :o");

// define variables that reference elements on our page
const santaForm = document.querySelector("#letter-form");
const errorMessageDiv = document.querySelector("#error");
const successMessageDiv = document.querySelector("#success");
const username = document.querySelector("#username");
const message = document.querySelector("#message");


/**
 * function to hide success message by adding hidden class and removing success class
 */
function hideSuccessMessage() {
  if (!successMessageDiv.classList.contains("hidden")) {
    successMessageDiv.classList.add("hidden");
  }
}

/**
 * function to hide success message by removing hidden class and adding success class
 * @param {String} message message to be displayed on success message div
 */
function showSuccessMessage(message) {
  successMessageDiv.innerHTML = message;
  if (successMessageDiv.classList.contains("hidden")) {
    successMessageDiv.classList.remove("hidden");
  }
}

/**
 * function to hide error message by adding hidden class and removing success class
 */
function hideErrorMessage() {
  if (!errorMessageDiv.classList.contains("hidden")) {
    errorMessageDiv.classList.add("hidden");
  }
}

/**
 * function to show errors in unordered list
 * @param {Array[String]} errors Array of error messages
 */
function showErrors(errors) {
  // clear any existing errors
  let html = "";
  if (errors.length > 0) {
    html += "<ul>";
    for (const error of errors) {
      html += "<li>" + error + "</li>";
    }
    html += "</ul>";
    errorMessageDiv.innerHTML = html;
    if (errorMessageDiv.classList.contains("hidden")) {
      errorMessageDiv.classList.remove("hidden");
    }
  } else {
    if (!errorMessageDiv.classList.contains("hidden")) {
      errorMessageDiv.classList.add("hidden");
    }
  }
  hideSuccessMessage();
}

// listen for the form to be submitted and add a new dream when it is
santaForm.onsubmit = function (event) {
  // prevent Default behavior
  event.preventDefault();
  // hide both success and error messages
  hideSuccessMessage();
  hideErrorMessage();
  // TODO: check the text isn't more than 100chars before submitting
  const letterInput = document.querySelector("#message");
  const letterText = letterInput.value.trim();

  if (letterText.length > 100) {
    // Display an error message to the user
    showErrors(["Letter text must be 100 characters or less.</li></ul>"]);
    return;
  }
  // Other tests are done in the server side

  const formData = new FormData(event.target);

  fetch("/api/letters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.get("username"),
      message: formData.get("message"),
    }),
  })
    .then((response) => {
      if (response.ok) {
        // show success message and hide error message
        showSuccessMessage(formData.get("username") + " Your wish has been sent to santa!");
        hideErrorMessage();
        // Clear the form on success
        santaForm.reset();
      } else {
        response
          .json()
          .then((response) => {
            /** show errors after the json response is fetched */
            showErrors([...response.errors]);
          })
          .catch((error) => {
            // if there is any other error, show them
            showErrors([error]);
          });
      }
    })
    .catch((error) => {
      // if there is any other error, show them
      showErrors([error.message]);
    });
};
