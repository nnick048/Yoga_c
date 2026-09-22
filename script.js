/* ==========================================================================
   1. CORE APPLICATION DATA STRUCTURES (DATA LAYER)
   ========================================================================== */

/**
 * Array Object 1: Workshops Database Collection
 * Managed dynamically to display schedule arrays on the user interface.
 */
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

/**
 * Array Object 2: Client Preference Configuration State
 * Tracks the localized text UI messages and application mapping targets.
 */
const uiLabels = [
    { key: "successAlert", text: "Sanctuary preference saved successfully!" },
    { key: "nameError", text: "Please enter your full first and last name." },
    { key: "emailError", text: "Please provide a valid email format (e.g., name@domain.com)." }
];

/* ==========================================================================
   2. INTERACTIVE COMPONENT LAYER & STATE RESET
   ========================================================================== */

/**
 * Function 1: Initialize User Interface Triggers
 * Clears form fields on clean reloads and attaches event handlers.
 */
function initializeSanctuaryFeatures() {
    const eventSelector = document.getElementById("target-event");
    const registrationForm = document.querySelector("form");

    // Clear text values and old error banners on fresh window loads
    if (registrationForm) {
        registrationForm.reset(); 
        clearValidationBanners();
        
        const inputs = registrationForm.querySelectorAll("input, textarea");
        inputs.forEach(input => {
            input.value = "";
        });
    }

    // Clear out old storage flags so choices begin fresh on fresh reloads
    localStorage.removeItem("riverbend_preferred_event");

    if (eventSelector) {
        eventSelector.value = ""; 
        eventSelector.addEventListener("change", handleEventSelectionChange);
    }

    if (registrationForm) {
        registrationForm.addEventListener("submit", validateRegistrationIntake);
    }
}

/**
 * Function 2: Handle Event Dropdown Selections
 * Updates page dynamically to surface relevant workshop scheduling fields.
 */
function handleEventSelectionChange(event) {
    const selectedId = event.target.value;
    const matchingWorkshop = studioWorkshops.find(workshop => workshop.id === selectedId);
    
    updateScheduleDisplayPanel(matchingWorkshop);
    
    if (selectedId) {
        localStorage.setItem("riverbend_preferred_event", selectedId);
    } else {
        localStorage.removeItem("riverbend_preferred_event");
    }
}

/**
 * Function 3: Update Schedule Display Panel
 * Generates semantic message parameters dynamically inside form view.
 */
function updateScheduleDisplayPanel(workshop) {
    let targetPanel = document.getElementById("schedule-status-panel");
    
    if (!targetPanel) {
        targetPanel = document.createElement("div");
        targetPanel.id = "schedule-status-panel";
        targetPanel.style.marginTop = "15px";
        targetPanel.style.padding = "12px";
        targetPanel.style.borderRadius = "4px";
        targetPanel.style.backgroundColor = "#FAFAF8";
        targetPanel.style.border = "1px solid #6C8E85";
        
        const formFieldset = document.querySelector("fieldset");
        if (formFieldset) {
            formFieldset.appendChild(targetPanel);
        }
    }
    
    if (workshop && workshop.id !== "general-info") {
        targetPanel.innerHTML = `<strong>Selected Schedule:</strong> ${workshop.schedule} <br> <em>Intensity Class: ${workshop.intensity}</em>`;
        targetPanel.style.display = "block";
    } else if (workshop && workshop.id === "general-info") {
        targetPanel.innerHTML = `<strong>Inquiry Routing:</strong> ${workshop.schedule}`;
        targetPanel.style.display = "block";
    } else {
        targetPanel.style.display = "none";
    }
}

/* ==========================================================================
   3. FORM VALIDATION RULES ENGINE (ERROR PREVENTION LAYER)
   ========================================================================== */

/**
 * Function 4: Validate Registration Intake Form
 * Intercepts form data submissions to prevent errors and enforce valid string rules.
 */
function validateRegistrationIntake(event) {
    const studentNameInput = document.getElementById("student-name");
    const studentEmailInput = document.getElementById("student-email");
    
    let isFormValid = true;
    
    // Wipe out older visual warnings from layout containers before computing
    clearValidationBanners();
    
    // Check 1: Full Name field validation string rules
    if (!studentNameInput.value.trim() || studentNameInput.value.trim().length < 4) {
        const nameErrorText = uiLabels.find(label => label.key === "nameError").text;
        injectErrorMessageInline(studentNameInput, nameErrorText);
        isFormValid = false;
    }
    
    // FIX: Using a bulletproof format query pattern that explicitly avoids escaping bugs
    const cleanEmailString = studentEmailInput.value.trim();
    const splitCheck = cleanEmailString.split("@");
    
    if (splitCheck.length !== 2 || splitCheck[0] === "" || !splitCheck[1].includes(".")) {
        const emailErrorText = uiLabels.find(label => label.key === "emailError").text;
        injectErrorMessageInline(studentEmailInput, emailErrorText);
        isFormValid = false;
    }
    
    // Interrupt layout pipeline routines if calculations determine invalid targets
    if (!isFormValid) {
        event.preventDefault();
    } else {
        const successMessage = uiLabels.find(label => label.key === "successAlert").text;
        alert(successMessage);
    }
}

/**
 * Function 5: Inject Error Message Inline
 * Spawns explicit red validation warnings directly underneath broken fields.
 */
function injectErrorMessageInline(inputField, messageString) {
    const errorContainer = document.createElement("span");
    errorContainer.className = "validation-error-msg";
    errorContainer.style.color = "#D9534F"; 
    errorContainer.style.fontSize = "0.85rem";
    errorContainer.style.fontWeight = "bold";
    errorContainer.style.marginTop = "4px";
    errorContainer.innerText = messageString;
    
    inputField.parentNode.appendChild(errorContainer);
    inputField.style.borderColor = "#D9534F";
    inputField.style.backgroundColor = "#FFF5F5";
}

/**
 * Function 6: Clear Validation Banners
 * Resets form input aesthetics back to pristine baseline states on edit loops.
 */
function clearValidationBanners() {
    const activeErrors = document.querySelectorAll(".validation-error-msg");
    activeErrors.forEach(msg => msg.remove());
    
    const targetPanel = document.getElementById("schedule-status-panel");
    if (targetPanel) {
        targetPanel.style.display = "none";
    }
    
    const inputFields = document.querySelectorAll("input, select, textarea");
    inputFields.forEach(field => {
        field.style.borderColor = "#6C8E85";
        field.style.backgroundColor = "#FAFAF8";
    });
}

// Attach lifecycle registration script loop to execution sequence
document.addEventListener("DOMContentLoaded", initializeSanctuaryFeatures);
