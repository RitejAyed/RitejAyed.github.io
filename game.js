// languette menu
document.getElementById('menuButton') // Get the element with ID 'menuButton'
  .addEventListener('click', function() { // Add a click event listener to it
    var sidebar = document.getElementById('sidebar'); // Get the sidebar element by ID

    sidebar.classList.toggle('open'); // Toggle the 'open' class on the sidebar:
    // - If 'open' is not present, it adds it
    // - If 'open' is already there, it removes it
    // This allows showing or hiding the sidebar via CSS
});