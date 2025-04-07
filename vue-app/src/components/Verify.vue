<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'

const router = useRouter()

// Ref for form data
const textInput = ref('') // Ref for the text input
const fileInput = ref(null) // Ref for the file input

// Popup visibility state
const showPopup = ref(false)

// Function to handle form submission (and update ticket validation for point system accordingly)
const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const netIDResponse = await fetch('http://localhost:8082/api/getNetID');
    const netIDData = await netIDResponse.json();
    const netID = netIDData.netID;

    // Assume textInput.value has ticket QR info, like "eventID$$$hashedNetID"
    const parts = textInput.value.split('$$$');
    if (parts.length !== 2) {
      throw new Error("Invalid ticket input format");
    }

    const eventID = parseInt(parts[0]);  // eventID is before the $$$

    console.log("Submitting Verification: ", { netID, eventID });

    const response = await fetch('http://localhost:3001/verifyticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ netID, eventID }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify ticket');
    }

    const result = await response.json();
    console.log(result.message);

    showPopup.value = true;
    textInput.value = '';
    fileInput.value = null;
  } catch (error) {
    console.error('Error verifying ticket:', error);
    alert(`Verification Failed: ${error.message}`);
  }
};

// Function to close the popup
const closePopup = () => {
  showPopup.value = false
}

onMounted(() => {
  // Any initialization logic can go here
})
</script>

<template>
  <div id="app">
    <Header />
    <main>
      <img src="@/assets/other/verify.jpg" alt="UConn Verify" class="Img" />
      <div class="container">
        <div>
          <h2>Validate Tickets</h2>
          <ul class="validation-box">
            <!-- Form for validation -->
            <form @submit="handleSubmit" class="validation-form">
              <!-- Text input for user -->
              <label for="text-input">Enter Text:</label>
              <input
                id="text-input"
                type="text"
                v-model="textInput"
                placeholder="Enter Ticket Hash Here"
                class="text-input"
              />

              <!-- File input for file submission -->
              <label for="file-input">Upload File:</label>
              <input
                id="file-input"
                type="file"
                @change="(e) => (fileInput.value = e.target.files[0])"
                class="file-input"
              />

              <!-- Submit button -->
              <button type="submit" class="submit-button">Submit</button>
            </form>
          </ul>
        </div>
      </div>
    </main>

    <!-- Popup -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <h3>Submission Successful</h3>
        <p>Your data has been submitted successfully!</p>
        <button @click="closePopup" class="popup-button">OK</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: #FFFFFF;
  text-align: center; /* Center all text */
  margin: 0;
}

.Img {
  width: 80%;
  max-width: 100rem;
  height: auto;
  margin: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 100rem;
  margin: 0 auto;
  text-align: center; /* Center text inside the container */
}

.container > div {
  width: 100%;
  border: 10px solid #000E2F;
  border-radius: 1rem;
  background-color: #000E2F;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  margin-bottom: 1rem;
  padding: 1rem;
  color: white;
  text-align: center; /* Center text inside each section */
}

h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center; /* Center headings */
}

ul {
  list-style: none;
  padding: 0;
  text-align: center; /* Center list items */
}

.validation-box {
  height: auto;
  overflow-y: auto;
}

.validation-form {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center form elements */
  gap: 1rem;
  padding: 1rem;
}

label {
  font-size: 1.25rem; /* Updated text size for labels */
}

.text-input,
.file-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1.25rem; /* Updated text size */
  border: 1px solid #ddd;
  border-radius: 5px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #1B2E67;
  color: white;
  border: none;
  font-family: Arial, sans-serif;
  font-size: 1.25rem; /* Updated text size */
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #E4002B;
}

/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.popup h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #000E2F;
}

.popup p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #000E2F;
}

.popup-button {
  padding: 10px 20px;
  background-color: #1B2E67;
  color: white;
  border: none;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.popup-button:hover {
  background-color: #E4002B;
}
</style>