// ...existing code...

// Function to delete a trigger
function deleteTrigger(triggerId) {
    // Store the active ID in local storage
    localStorage.setItem('activeId', triggerId);

    // ...existing code to delete the trigger...

    // Reload the page
    location.reload();
}

// Function to set the active ID after page reload
function setActiveIdAfterReload() {
    const activeId = localStorage.getItem('activeId');
    if (activeId) {
        // Set the active ID to the retrieved value
        // ...code to set the active ID...
        
        // Clear the active ID from local storage
        localStorage.removeItem('activeId');
    }
}

// Call the function to set the active ID after page reload
setActiveIdAfterReload();

// ...existing code...
