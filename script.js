/* =====================================================
   SCRIPT.JS — All the interactivity for INSPIRED

   This file does four things:
   1. Handles SPA navigation (shows/hides sections)
   2. Controls the mobile slide-in menu
   3. Sets up the banner (date, daily word, upload count)
   4. Builds the gallery grid from a data array

   JavaScript runs TOP TO BOTTOM when the page loads.
   Functions (reusable blocks of code) are defined here
   and called either by HTML (onclick="...") or by us
   at the bottom inside window.onload.
   ===================================================== */


/* =====================================================
   PART 1: SPA NAVIGATION

   SPA = Single Page Application.
   We never reload the page. Instead, we:
   - Hide ALL sections
   - Show ONLY the one the user clicked
   
   This is what makes it a "single page" app.
   ===================================================== */

// 'function' defines a reusable block of code with a name.
// showSection('explore') will run this code with sectionName = 'explore'
function showSection(sectionName) {

  // --- Step 1: Hide ALL sections ---
  // querySelectorAll finds every element with class "page-section"
  // It returns a list (like an array) of all of them
  var allSections = document.querySelectorAll('.page-section');

  // .forEach loops through each item in the list and runs the function for each one
  allSections.forEach(function(section) {
    section.classList.remove('active-section');
    // classList.remove takes off the CSS class "active-section"
    // Without "active-section", the CSS hides it (display: none)
  });

  // --- Step 2: Remove the highlight from ALL nav links ---
  var allNavLinks = document.querySelectorAll('.nav-link');

  allNavLinks.forEach(function(link) {
    link.classList.remove('active');
    // Removes the "active" style (the light background) from every link
  });

  // --- Step 3: Show ONLY the section we want ---
  // If sectionName = 'explore', we look for id="section-explore"
  var targetSection = document.getElementById('section-' + sectionName);
  
  if (targetSection) {
    // 'if' checks that the element actually exists before trying to use it
    targetSection.classList.add('active-section');
    // classList.add adds the "active-section" CSS class → makes it visible
  }

  // --- Step 4: Highlight the matching nav link ---
  // querySelector (without All) finds just the FIRST match
  // [data-section="explore"] finds the element with that custom attribute
  var activeLink = document.querySelector('[data-section="' + sectionName + '"]');

  if (activeLink) {
    activeLink.classList.add('active');
    // Adds the "active" style (background highlight) to the clicked link
  }

}


/* =====================================================
   PART 2: MOBILE MENU

   The mobile menu is a <div> that starts off-screen.
   We toggle the "open" CSS class on it.
   The CSS handles the actual sliding animation.
   ===================================================== */

function openMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  // getElementById finds the one element with id="mobile-menu"
  
  menu.classList.add('open');
  // Adding "open" triggers the CSS transition (translateX from -100% to 0)
  // = slides the menu into view from the left
}

function closeMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  menu.classList.remove('open');
  // Removing "open" slides the menu back off-screen
}


/* =====================================================
   PART 3: BANNER — DATE, DAILY WORD, UPLOAD COUNT
   ===================================================== */

// An ARRAY of words. Each day of the year uses a different one.
// Day 1 → words[0], Day 2 → words[1], and so on.
// When we run out, it loops back to the start (using the % operator).
var dailyWords = [
  'CROWN',  'SHADOW', 'EMBER',  'BLOOM',  'STORM',
  'FORGE',  'LUNAR',  'VAPOR',  'SPINE',  'FROST',
  'DRIFT',  'PRISM',  'RAVEN',  'THORN',  'FLARE',
  'ABYSS',  'CREST',  'DUSK',   'GLYPH',  'HAUNT',
  'IVORY',  'KNELL',  'LUMEN',  'MURK',   'NEXUS',
  'OCHRE',  'PYRE',   'QUILL',  'RIFT',   'SMEAR',
  'TRACE',  'UMBRA',  'VENOM',  'WRATH',  'XENON',
  'YAWL',   'ZENITH', 'ASHES',  'BRINE',  'CRYPT',
  'DIRGE',  'EPOCH',  'FABLE',  'GORSE',  'HINGE',
  'INDEX',  'JOUST',  'KUDOS',  'LEDGE',  'MARSH'
];

function setupBanner() {

  // --- DATE ---
  // 'new Date()' creates an object representing right now
  var today = new Date();

  // toLocaleDateString formats the date into readable text
  // { year, month, day } tells it what to include and how to format it
  var formattedDate = today.toLocaleDateString('en-US', {
    year:  'numeric',  // e.g. 2026
    month: 'long',     // e.g. February (not 02)
    day:   'numeric'   // e.g. 20 (not 020)
  });
  // Result example: "February 20, 2026"

  // Put the formatted date into the HTML element with id="current-date"
  document.getElementById('current-date').textContent = formattedDate;


  // --- DAILY WORD ---
  // Figure out which day of the year it is (0 = Jan 1, 364 = Dec 31)
  var startOfYear = new Date(today.getFullYear(), 0, 1);
  // getFullYear() → 2026
  // new Date(2026, 0, 1) → January 1st, 2026
  // Month 0 = January (JavaScript counts months from 0, not 1!)

  // Subtract Jan 1 from today to get the difference in milliseconds
  var millisecondsDiff = today - startOfYear;

  // Convert milliseconds → days
  // 1 day = 1000ms × 60sec × 60min × 24hr = 86,400,000 milliseconds
  var dayOfYear = Math.floor(millisecondsDiff / 86400000);
  // Math.floor rounds DOWN to a whole number (e.g. 1.8 → 1)

  // The % (modulo) operator gives us the REMAINDER after division.
  // Example: if dayOfYear = 53 and we have 50 words:
  //          53 % 50 = 3, so we use words[3]
  // This makes the word list "loop" endlessly without going out of bounds.
  var wordIndex = dayOfYear % dailyWords.length;
  // .length = how many items are in the array

  document.getElementById('daily-word').textContent = dailyWords[wordIndex];


  // --- UPLOAD COUNT ---
  // We animate the counter counting up from 0 to the target number.
  // This gives a satisfying "live counter" effect on page load.
  animateCounter('upload-count', 267, ' Uploads');
  // Source: Upload count is placeholder data for demonstration purposes.

}


// HELPER FUNCTION: Animates a number counting up from 0 to 'target'
// Parameters:
//   elementId → the id of the HTML element to update
//   target    → the final number to count up to
//   suffix    → text to add after the number (like " Uploads")
function animateCounter(elementId, target, suffix) {
  var element = document.getElementById(elementId);

  var current = 0;          // Start from 0
  var duration = 1200;      // Total animation time in milliseconds (1.2 seconds)
  var fps = 60;             // Frames per second
  var totalFrames = (duration / 1000) * fps; // How many times the counter updates
  var increment = target / totalFrames;      // How much to add each frame

  // setInterval runs a function repeatedly, every X milliseconds
  // (1000 / 60) ≈ 16ms = roughly 60 times per second
  var timer = setInterval(function() {

    current += increment;   // Add a bit each frame

    if (current >= target) {
      current = target;     // Don't overshoot the target number
      clearInterval(timer); // STOP the interval — we're done
    }

    // Update the text in the HTML element
    // Math.floor converts 266.8 → 266 (no decimal places shown)
    element.textContent = Math.floor(current) + suffix;

  }, 1000 / fps); // Run this every ~16 milliseconds

}


/* =====================================================
   PART 4: BUILD THE GALLERY

   Instead of typing out 6 cards manually in HTML,
   we store the data in an array and use a loop
   to create all the cards automatically.
   
   To add more artwork: just add more objects to
   the artworkData array below!
   ===================================================== */

// Each object { } represents one artwork post.
// Properties: username, time, imageSrc (file path to image)
// Source: All artwork data below is placeholder/mock data for demonstration.
var artworkData = [
  {
    username: 'Just-Passing-Thru737',
    time: '2 hours ago',
    imageSrc: ''   // Leave empty to show a placeholder box.
                   // To use a real image: 'images/artwork1.jpg'
  },
  {
    username: 'inkman82',
    time: '34 minutes ago',
    imageSrc: ''
  },
  {
    username: 'ezuntimmy',
    time: '5 hours ago',
    imageSrc: ''
  },
  {
    username: 'Just-Passing-Thru737',
    time: '2 hours ago',
    imageSrc: ''
  },
  {
    username: 'inkman82',
    time: '23 minutes ago',
    imageSrc: ''
  },
  {
    username: 'ezuntimmy',
    time: '5 hours ago',
    imageSrc: ''
  }
];

function buildGallery() {
  // Find the gallery grid element in the HTML
  var grid = document.getElementById('gallery-grid');

  // Loop through EVERY item in artworkData
  artworkData.forEach(function(artwork) {
    // 'artwork' is the current item in the loop (one at a time)

    // --- Create the card element ---
    var card = document.createElement('div');
    // createElement makes a brand new HTML element in memory (not on screen yet)

    card.className = 'art-card';
    // Give it the CSS class so it gets our card styling

    // --- Decide: real image or placeholder? ---
    var imageHTML;

    if (artwork.imageSrc) {
      // imageSrc is set — use a real <img> tag
      // The 'alt' attribute describes the image for screen readers and if image fails to load
      imageHTML = '<img src="' + artwork.imageSrc + '" alt="Artwork by ' + artwork.username + '">';
    } else {
      // imageSrc is empty — show a styled placeholder box instead
      // To use real images later, just set imageSrc: 'images/yourfile.jpg'
      imageHTML = '<div class="art-placeholder">[ artwork ]</div>';
    }

    // --- Build the inner HTML of the card ---
    // innerHTML lets us set HTML content as a string
    card.innerHTML =
      imageHTML +
      '<div class="art-info">' +
        '<span class="art-username">' + artwork.username + '</span>' +
        '<span class="art-time">'     + artwork.time     + '</span>' +
      '</div>';

    // --- Add the card to the page ---
    grid.appendChild(card);
    // appendChild adds our card as the last child inside the grid div
    // The card is now visible on screen!

  }); // End of forEach loop

} // End of buildGallery


/* =====================================================
   PART 5: START EVERYTHING

   window.onload fires AFTER the browser has finished
   loading all the HTML, CSS, and images on the page.

   It's our "starting gun" — we call all our setup
   functions here so they run in the right order.
   ===================================================== */

window.onload = function() {
  setupBanner();   // Fill in date, daily word, and start the counter animation
  buildGallery();  // Build all the artwork cards and add them to the grid
};
