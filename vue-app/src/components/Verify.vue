<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'
import axios from 'axios' // Import axios for API calls
import jsQR from 'jsqr'

const router = useRouter()

// Ref for form data
const textInput = ref('') // Ref for the text input
const fileInput = ref(null);
const uploadedFileName = ref('');

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    fileInput.value = file;
    uploadedFileName.value = file.name;
  } else {
    fileInput.value = null;
    uploadedFileName.value = '';
  }
};

const removeFile = () => {
  fileInput.value = null;
  uploadedFileName.value = '';
};


// Popup visibility state
const showPopup = ref(false)

const events = ref([])

const selectedEvent = ref(null)

const fetchEvents = async () => {
    try {
        const response = await axios.get("http://localhost:3001/api/getEvents");
        const data = response.data;
        console.log("Fetched events:", data);

        // Same mapping logic
        events.value = data.map(item => ({
            id: item.eventId,
            title: item.eventName,
            date: item.eventDate,
            location: item.eventLocation, // Customize this if needed
            sport: item.eventName.includes("Basketball") ? "Basketball" : 
                   item.eventName.includes("Football") ? "Football" :
                   item.eventName.includes("Hockey") ? "Hockey" :
                   item.eventName.includes("Soccer") ? "Soccer" : "Other",
            ticketsOpen: item.ticketsOpen, // Use actual data if available
            totalTickets: item.totalTickets
        }));
    } catch (error) {
        console.error("Error fetching events:", error);
    }
};

const decodeQRCode = () => {
  return new Promise((resolve, reject) => {
    if (!fileInput.value) {
      reject("Please upload a file first.");
      return;
    }

    const file = fileInput.value;
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!img.naturalWidth || !img.naturalHeight) {
          reject("Image is not loaded properly.");
          return;
        }

        // Create a canvas to process the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to the image size
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get image data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Decode the QR code
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          resolve(code.data);  // Return the decoded QR code data
        } else {
          reject("No QR code found.");
        }
      };

      img.onerror = (error) => {
        reject("Image loading error: " + error);
      };

      img.src = event.target.result; // Set the image source to the file data URL
    };

    reader.onerror = (error) => {
      reject("FileReader error: " + error);
    };

    reader.readAsDataURL(file); // Read the file as a data URL
  });
};



// Function to handle form submission (and update ticket validation for point system accordingly)
const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    console.log(selectedEvent.value);
    console.log(textInput.value);
    console.log(fileInput.value.type);

    if(!selectedEvent.value || !textInput.value || !fileInput.value){
      throw new Error("All fields in form are required");
    }

    if(fileInput.value.type != 'image/png') {
      throw new Error(`the uploaded file needs to be a png image, received a ${fileInput.value.type} file type.`);
    }

    const decodedQRCode = await decodeQRCode();
    if(!decodeQRCode){
      throw new Error('failed to decode QR code')
    }

    textInput.value = textInput.value.toLowerCase();

    const eventID = selectedEvent.value.id;
    const netID = textInput.value;
    const QRCode = decodedQRCode;

    console.log("Submitting Verification: ", { netID, eventID, QRCode });

    const response = await fetch('http://localhost:3001/verifyticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ netID, eventID, QRCode }),
    });

    console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.statusText);
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
  removeFile();
}

onMounted(() => {
  fetchEvents();
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
              <!-- Student ID -->
              <label for="netID">Enter Student NetID:</label>
              <input
                id="text-input"
                type="text"
                v-model="textInput"
                class="text-input"
              />

              <!-- Event dropdown menu -->
              <label for="event">Select Event:</label>
              <select id="event" v-model="selectedEvent">
                <option v-for="event in events" :key="event.id" :value="event">
                  {{ event.title }}
                </option>
              </select>

              <!-- File input for file submission -->
              <label for="file-input">Upload QR code:</label>
              <div v-if="!uploadedFileName">
                <input
                  id="file-input"
                  type="file"
                  @change="handleFileUpload"
                  class="file-input"
                />
              </div>
              <div v-else class="file-display">
                <p>{{ uploadedFileName }}</p>
                <button type="button" @click="removeFile" class="remove-button">✕</button>
              </div>

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
        <p>Ticket Validated</p>
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

select,
.text-input{
  display: flex;
  align-items: left;
  width: 100%;
  padding: 0.5rem;
  font-size: 1.25rem; /* Updated text size */
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
}

.file-input,
.file-display {
  display: flex;
  align-items: center; /* Align items vertically */
  justify-content: space-between; /* Distribute space between input and label */
  padding: 0.5rem 0.75rem; /* Same padding for both file input and file display */
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  font-size: 1.25rem;
  color: #333;
  width: 100%; /* Ensure it fills the width of its container */
  box-sizing: border-box; /* Ensure padding and border are included in width calculation */
}

.file-input input {
  width: 100%; /* Ensure the file input stretches across */
  padding: 0.5rem 0.75rem; /* Make sure it matches the size of other inputs */
}


.file-display p {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-grow: 1;
  color: #000E2F;
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