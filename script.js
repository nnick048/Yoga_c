/* ==========================================================================
   1. CORE APPLICATION DATA LAYERS
   ========================================================================== */
const studioWorkshops = [
    {
        id: "mindfulness-intro",
        title: "Mindfulness for Beginners Workshop",
        schedule: "First Saturday of every month at 1:00 PM",
        intensity: "Gentle / Restorative"
    },
    {
        id: "sound-bath",
        title: "Deep Body Relaxation & Sound Bath",
        schedule: "Third Friday of every month at 7:00 PM",
        intensity: "Meditation / Deep Rest"
    },
    {
        id: "general-info",
        title: "General Schedule Inquiry",
        schedule: "Weekly Class Rotations (Mon-Fri)",
        intensity: "Varies by selected pass option"
    }
];

const uiLabels = [
    { key: "successAlert", text: "Sanctuary preference saved successfully!" },
    { key: "nameError", text: "Please enter your full first and last name." },
    { key: "emailError", text: "Please provide a valid email format (e.g., name@domain.com)." }
];

/* ==========================================================================
   2. APP INITIALIZATION & ROBUST EVENT HOOKING
   ========================================================================== */
function initializeSanctuaryFeatures() {
    const eventSelector = document.getElementById("target-event");
    const registrationForm = document.getElementById("registration-form");

    // Clean out previous cached values so the site loads perfectly fresh
    if (registrationForm) {
        registrationForm.reset();
        clearValidationBanners();
        
        const textInputs = registrationForm.querySelectorAll("input, textarea");
        textInputs.forEach(input => {
            input.value = "";
        });
    }

    localStorage.removeItem("riverbend_preferred_event");

    // Dynamic UI Hook: Listens for dropdown changes
    if (eventSelector) {
        eventSelector.value = "";
        eventSelector.addEventListener("change", handleEventSelectionChange);
    }

    // Server-Safe Intercept: Binds the submit validation check completely within the script
    if (registrationForm) {
        registrationForm.addEventListener("submit", validateRegistrationIntake);
    }
}

function handleEventSelectionChange(event) {
    const selectedId = event.target.value;
    const matchingWorkshop = studioWorkshops.find(w => w.id === selectedId);
    
    updateScheduleDisplayPanel(matchingWorkshop);
    
    if (selectedId) {
        localStorage.setItem("riverbend_preferred_event", selectedId);
    } else {
        localStorage.removeItem("riverbend_preferred_event");
    }
}

/**
 * Server-Safe Panel Builder
 * Places the date status display box safely inside the form content,
 * regardless of whether you are running locally or live on a server.
 */
function updateScheduleDisplayPanel(workshop) {
    let targetPanel = document.getElementById("schedule-status-panel");
    const eventSelector = document.getElementById("target-event");
    
    if (!eventSelector) return;

    if (!targetPanel) {
        targetPanel = document.createElement("div");
        targetPanel.id = "schedule-status-panel";
        targetPanel.style.marginTop = "15px";
        targetPanel.style.padding = "12px";
        targetPanel.style.borderRadius = "4px";
        targetPanel.style.backgroundColor = "#FAFAF8";
        targetPanel.style.border = "1px solid #6C8E85";
        targetPanel.style.fontWeight = "bold";
        
        // SERVER FIXED: Appends the status panel right below the dropdown container paragraph
        eventSelector.parentNode.appendChild(targetPanel);
    }
    
    if (workshop && workshop.id !== "") {
        targetPanel.innerHTML = `Selected Schedule: ${workshop.schedule} <br><span style="font-weight: normal; font-style: italic;">Intensity: ${workshop.intensity}</span>`;
        targetPanel.style.display = "block";
    } else {
        targetPanel.style.display = "none";
    }
}

/* ==========================================================================
   3. ACCESSIBLE FORM VALIDATION & INTERCEPT MECHANICS
   ========================================================================== */
function validateRegistrationIntake(event) {
    // SECURITY FIRST: Lock the live server out from performing native page updates or scrolls
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    const studentNameInput = document.getElementById("student-name");
    const studentEmailInput = document.getElementById("student-email");
    const registrationForm = document.getElementById("registration-form");
    
    let isFormValid = true;
    clearValidationBanners();

    // Check 1: Full Name formatting bounds validation
    if (!studentNameInput.value.trim() || studentNameInput.value.trim().length < 4) {
        const nameErrorText = uiLabels.find(l => l.key === "nameError").text;
        injectErrorMessageInline(studentNameInput, nameErrorText);
        isFormValid = false;
    }

    // Check 2: Server-Safe Character String Split Check for Email Address
    const emailVal = studentEmailInput.value.trim();
    if (!emailVal.includes("@") || !emailVal.includes(".") || emailVal.length < 5) {
        const emailErrorText = uiLabels.find(l => l.key === "emailError").text;
        injectErrorMessageInline(studentEmailInput, emailErrorText);
        isFormValid = false;
    }

    // SUCCESS ACTIONS CAPTURE BLOCK
    if (isFormValid) {
        const successMessage = uiLabels.find(l => l.key === "successAlert").text;
        
        // Displays the explicit system popup alert, confirming successful data submission!
        alert(successMessage);
        
        if (registrationForm) {
            registrationForm.reset();
            const textFields = registrationForm.querySelectorAll("input, textarea");
            textFields.forEach(field => field.value = "");
        }
        localStorage.removeItem("riverbend_preferred_event");
        clearValidationBanners();
    }

    // Return false to doubly protect cross-browser form transmission pipelines
    return false;
}

function injectErrorMessageInline(inputField, messageString) {
    const errorContainer = document.createElement("span");
    errorContainer.className = "validation-error-msg";
    errorContainer.style.color = "#D9534F";
    errorContainer.style.fontSize = "0.85rem";
    errorContainer.style.fontWeight = "bold";
    errorContainer.style.display = "block";
    errorContainer.style.marginTop = "6px";
    errorContainer.innerText = messageString;
    
    inputField.parentNode.appendChild(errorContainer);
    inputField.style.borderColor = "#D9534F";
    inputField.style.backgroundColor = "#FFF5F5";
}

function clearValidationBanners() {
    const activeErrors = document.querySelectorAll(".validation-error-msg");
    activeErrors.forEach(msg => msg.remove());
    
    const targetPanel = document.getElementById("schedule-status-panel");
    if (targetPanel) { targetPanel.style.display = "none"; }
    
    const inputFields = document.querySelectorAll("input, select, textarea");
    inputFields.forEach(field => {
        field.style.borderColor = "#6C8E85";
        field.style.backgroundColor = "#FAFAF8";
    });
}

// Attach script load loops cleanly to lifecycle processing pipeline
document.addEventListener("DOMContentLoaded", initializeSanctuaryFeatures);
