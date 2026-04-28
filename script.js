/* =====================================================
   SCRIPT.JS — All the interactivity for INSPIRED

   This file is split into 7 parts:
   
   PART 1 — Lock screen (unlockSite)
   PART 2 — SPA navigation (showSection)
   PART 3 — Mobile menu (open/close)
   PART 4 — Banner (date, daily word, upload counter)
   PART 5 — Explore gallery (buildGallery)
   PART 6 — Friends feed (buildFriendsFeed)
   PART 7 — Profile page (tabs, friends list,
             settings, calendar, privacy toggle)
   PART 8 — Startup (window.onload)

   JavaScript runs top to bottom when the page loads.
   ===================================================== */


/* =====================================================
   PART 1 — LOCK SCREEN

   The lock screen covers the entire page on load.
   When the user clicks either upload button, this
   function fades it out and then removes it from the
   DOM (the live HTML of the page) entirely.
   ===================================================== */

function unlockSite() {

  var lock = document.getElementById('lock-screen');
  // getElementById finds the ONE element with id="lock-screen"

  lock.classList.add('hidden');
  // Adding "hidden" triggers the CSS opacity transition:
  //   opacity goes from 1 (fully visible) → 0 (invisible)
  //   over 0.4 seconds (set in CSS: transition: opacity 0.4s)

  // Wait 400ms (the length of the fade animation), THEN remove the element
  setTimeout(function() {
    lock.remove();
    // .remove() deletes the element from the page completely.
    // After this, it's gone — no invisible layer blocking clicks.
  }, 400);
  // setTimeout(function, delay) runs the function ONCE after 'delay' milliseconds

}


/* =====================================================
   PART 2 — SPA NAVIGATION

   SPA = Single Page Application.
   We never reload the page. Instead we:
     1. Hide ALL sections
     2. Show ONLY the one the user clicked
   ===================================================== */

function showSection(sectionName) {

  // Step 1: Hide EVERY section
  // querySelectorAll returns a list of ALL elements matching the selector
  var allSections = document.querySelectorAll('.page-section');

  allSections.forEach(function(section) {
    section.classList.remove('active-section');
    // Without "active-section" the CSS sets display: none → invisible
  });

  // Step 2: Remove the highlight from ALL nav links
  var allNavLinks = document.querySelectorAll('.nav-link');

  allNavLinks.forEach(function(link) {
    link.classList.remove('active');
  });

  // Step 3: Show ONLY the section we want
  // If sectionName = 'explore', this finds id="section-explore"
  var targetSection = document.getElementById('section-' + sectionName);

  if (targetSection) {
    // 'if' checks the element exists before trying to use it
    targetSection.classList.add('active-section');
    // Adding "active-section" sets display: block → visible
  }

  // Step 4: Highlight the matching nav link
  // [data-section="explore"] finds the element with that custom attribute
  var activeLink = document.querySelector('[data-section="' + sectionName + '"]');

  if (activeLink) {
    activeLink.classList.add('active');
  }

}


/* =====================================================
   PART 3 — MOBILE MENU

   The menu starts off-screen (CSS: translateX(-100%)).
   Adding the "open" class slides it into view.
   The CSS transition handles the animation automatically.
   ===================================================== */

function openMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  menu.classList.add('open');
}

function closeMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  menu.classList.remove('open');
}


/* =====================================================
   PART 4 — BANNER: DATE / DAILY WORD / UPLOAD COUNT
   ===================================================== */

// 50 daily prompt words — one per day of the year.
// The list loops back to the start after running out.
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
  var today = new Date();
  // new Date() creates an object representing RIGHT NOW.
  // It has methods like .getFullYear(), .getMonth() etc.

  var formattedDate = today.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric'
  });
  // Result: "April 28, 2026" (for example)

  document.getElementById('current-date').textContent = formattedDate;


  // --- DAILY WORD ---
  // Work out which day of the year today is (0 = Jan 1st)
  var startOfYear = new Date(today.getFullYear(), 0, 1);
  // Month 0 = January. JavaScript counts months from 0, not 1.

  var millisecondsDiff = today - startOfYear;
  // Subtracting two Date objects gives the difference in milliseconds

  var dayOfYear = Math.floor(millisecondsDiff / 86400000);
  // 86,400,000 = 1000ms × 60sec × 60min × 24hr (milliseconds in a day)
  // Math.floor rounds down: 1.9 → 1

  var wordIndex = dayOfYear % dailyWords.length;
  // % = modulo (remainder after division).
  // If dayOfYear = 53 and there are 50 words: 53 % 50 = 3 → words[3]
  // This makes the word list loop endlessly.

  document.getElementById('daily-word').textContent = dailyWords[wordIndex];

  // Also set the same word in the lock screen word bar
  // so both display the same daily prompt
  var lockWord = document.getElementById('lock-daily-word');
  if (lockWord) {
    lockWord.textContent = dailyWords[wordIndex];
  }


  // --- UPLOAD COUNT (animated counter) ---
  // Source: Upload count is placeholder data for demonstration purposes.
  animateCounter('upload-count', 267, ' Uploads');

}

// Counts up from 0 to 'target' over ~1.2 seconds
// elementId = which HTML element to update
// target    = the final number
// suffix    = text after the number (e.g. " Uploads")
function animateCounter(elementId, target, suffix) {

  var element = document.getElementById(elementId);
  var current = 0;
  var duration = 1200;              // 1.2 seconds total
  var fps = 60;                     // Update 60 times per second
  var totalFrames = (duration / 1000) * fps;
  var increment   = target / totalFrames;
  // increment = how much to add each frame so we reach 'target' exactly

  var timer = setInterval(function() {
    // setInterval runs a function repeatedly every X milliseconds

    current += increment;

    if (current >= target) {
      current = target;
      clearInterval(timer);
      // clearInterval STOPS the repeating timer — we're done
    }

    element.textContent = Math.floor(current) + suffix;
    // Math.floor removes decimals: 266.8 → 266

  }, 1000 / fps);
  // 1000 / 60 ≈ 16ms between each update = 60 updates per second

}


/* =====================================================
   PART 5 — EXPLORE GALLERY

   artworkData is an array of objects.
   Each object = one post.
   buildGallery() loops through them and creates
   an art card for each one.
   
   To add more posts: add more objects to artworkData.
   To use a real image: set imageSrc to the file path.
   ===================================================== */

// Source: All artwork data is placeholder/mock data for demonstration.
var artworkData = [
  { username: 'Just-Passing-Thru737', time: '2 hours ago',    imageSrc: 'images/OTHERjustpassing.png' },
  { username: 'inkman82',             time: '34 minutes ago', imageSrc: 'images/inkman.png'           },
  { username: 'ezuntimmy',            time: '5 hours ago',    imageSrc: 'images/ezu.png'              },
  { username: 'Just-Passing-Thru737', time: '2 hours ago',    imageSrc: 'images/justpassing.png'      },
  { username: 'inkman82',             time: '23 minutes ago', imageSrc: 'images/OTHERinkman.png'      },
  { username: 'ezuntimmy',            time: '5 hours ago',    imageSrc: 'images/OTHERez.png'          }
];

function buildGallery() {

  var grid = document.getElementById('gallery-grid');
  // Find the container div where cards will be placed

  artworkData.forEach(function(artwork) {
    // forEach loops through every item in the array.
    // 'artwork' = the current item on each loop pass.

    var card = document.createElement('div');
    // createElement creates a new <div> in memory (not on screen yet)

    card.className = 'art-card';
    // Give it the CSS class so it gets styled correctly

    // Choose: real image or placeholder?
    var imageHTML;

    if (artwork.imageSrc) {
      imageHTML = '<img src="' + artwork.imageSrc + '" alt="Artwork by ' + artwork.username + '">';
    } else {
      imageHTML = '<div class="art-placeholder">[ artwork ]</div>';
    }

    // Build the card's inner HTML as a string
    card.innerHTML =
      imageHTML +
      '<div class="art-info">' +
        '<span class="art-username">' + artwork.username + '</span>' +
        '<span class="art-time">'     + artwork.time     + '</span>' +
      '</div>';

    grid.appendChild(card);
    // appendChild places the card inside the grid — now it appears on screen

  });

}


/* =====================================================
   PART 6 — FRIENDS FEED

   Same idea as the gallery, but:
   - Single centred column instead of 3-column grid
   - Uses 'friend-card' CSS class instead of 'art-card'
   - friendsData is a separate array (only from friends)
   ===================================================== */

// Source: All friends feed data is placeholder/mock data for demonstration.
var friendsData = [
  { username: 'Just-Passing-Thru737', time: '2 hours ago',    imageSrc: 'images/justpassing.png'      },
  { username: 'Just-Passing-Thru737', time: '2 hours ago',    imageSrc: 'images/OTHERjustpassing.png' },
  { username: 'inkman82',             time: '34 minutes ago', imageSrc: 'images/inkman.png'           },
  { username: 'inkman82',             time: '34 minutes ago', imageSrc: 'images/OTHERinkman.png'      },
  { username: 'ezuntimmy',            time: '5 hours ago',    imageSrc: 'images/ezu.png'              }
];

function buildFriendsFeed() {

  var feed = document.getElementById('friends-feed');

  friendsData.forEach(function(post) {

    var card = document.createElement('div');
    card.className = 'friend-card';
    // 'friend-card' is a wider, centred version of the art card

    var imageHTML;

    if (post.imageSrc) {
      imageHTML = '<img src="' + post.imageSrc + '" alt="Artwork by ' + post.username + '">';
    } else {
      imageHTML = '<div class="art-placeholder">[ artwork ]</div>';
    }

    card.innerHTML =
      imageHTML +
      '<div class="art-info">' +
        '<span class="art-username">' + post.username + '</span>' +
        '<span class="art-time">'     + post.time     + '</span>' +
      '</div>';

    feed.appendChild(card);

  });

}


/* =====================================================
   PART 7 — PROFILE PAGE

   Contains four separate functions:
   - showProfileTab()   → switches between the 3 tabs
   - togglePrivacy()    → flips Private ↔ Public
   - buildCalendar()    → draws the upload calendar
   - removeFriend()     → removes a friend from the list
   - addFriend()        → adds a new friend to the list
   - saveSettings()     → shows a confirmation message
   ===================================================== */


// --- Profile tab switcher ---
// Works exactly like showSection() but for the 3 sub-tabs
// inside the Profile page.
function showProfileTab(tabName) {

  // Hide all tab panels
  var allPanels = document.querySelectorAll('.tab-panel');
  allPanels.forEach(function(panel) {
    panel.classList.remove('active-tab-panel');
  });

  // Remove active styling from all tab buttons
  var allTabs = document.querySelectorAll('.profile-tab');
  allTabs.forEach(function(tab) {
    tab.classList.remove('active-tab');
  });

  // Show the panel for the selected tab
  var targetPanel = document.getElementById('tab-' + tabName);
  if (targetPanel) {
    targetPanel.classList.add('active-tab-panel');
  }

  // Highlight the correct tab button
  // data-tab is the custom attribute we use to identify each button
  var activeTab = document.querySelector('[data-tab="' + tabName + '"]');
  if (activeTab) {
    activeTab.classList.add('active-tab');
  }

}


// --- Privacy toggle ---
// Clicking the "Private" / "Public" text on the profile flips it.
function togglePrivacy() {

  var privacyValue = document.getElementById('privacy-value');
  // Gets the span that shows "Private" or "Public"

  if (privacyValue.textContent === 'Private') {
    privacyValue.textContent = 'Public';
  } else {
    privacyValue.textContent = 'Private';
  }
  // .textContent reads or sets the text inside an element

}


// --- Calendar builder ---
// Draws a month calendar for the current month.
// Each day number is a clickable link.
function buildCalendar() {

  var box = document.getElementById('calendar-box');

  var today = new Date();
  var year  = today.getFullYear();
  var month = today.getMonth();
  // getMonth() returns 0–11 (0 = January, 11 = December)

  // Get the full month name for the heading (e.g. "April")
  var monthName = today.toLocaleDateString('en-US', { month: 'long' });

  // How many days are in this month?
  // new Date(year, month + 1, 0) = the day BEFORE the 1st of next month = last day of this month
  var daysInMonth = new Date(year, month + 1, 0).getDate();

  // What day of the week does the 1st fall on? (0 = Sunday, 1 = Monday ...)
  var firstDayOfWeek = new Date(year, month, 1).getDay();
  // We want Monday = 0, so we shift: if getDay() is 0 (Sunday) → treat as 6
  // This makes our Mon Tue Wed Thu Fri Sat Sun headers line up correctly
  var startOffset = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;

  // How many days from the PREVIOUS month do we show to fill the first row?
  var daysInPrevMonth = new Date(year, month, 0).getDate();

  // --- Build the HTML string ---
  // We'll put it all together and inject it at the end with innerHTML

  var html = '<div class="calendar-month-heading">' + monthName + ' ' + year + '</div>';
  html += '<div class="calendar-grid">';

  // Day-of-week headers
  var dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  dayNames.forEach(function(d) {
    html += '<div class="cal-header">' + d + '</div>';
  });

  // Fill in the "padding" days from the previous month
  for (var i = 0; i < startOffset; i++) {
    var prevDay = daysInPrevMonth - startOffset + 1 + i;
    html += '<div class="cal-day other-month">' + prevDay + '</div>';
  }

  // Fill in the actual days of the current month
  for (var day = 1; day <= daysInMonth; day++) {
    html += '<div class="cal-day">' + day + '</div>';
    // In a real app, days with uploads would have a special style
    // For now they're all the same blue link style
  }

  // Fill in trailing days from NEXT month to complete the last row
  // A grid of 7 columns needs its rows to be multiples of 7.
  var totalCells = startOffset + daysInMonth;
  var remainder  = totalCells % 7;
  // remainder = how many cells are in the last incomplete row
  if (remainder !== 0) {
    var trailingDays = 7 - remainder;
    for (var j = 1; j <= trailingDays; j++) {
      html += '<div class="cal-day other-month">' + j + '</div>';
    }
  }

  html += '</div>';
  // Close the .calendar-grid div

  box.innerHTML = html;
  // Set the finished HTML string as the content of the calendar box

}


// --- Remove a friend ---
// Called by the "Remove" button on each friend row.
// 'btn' is the button element that was clicked.
function removeFriend(btn) {

  var listItem = btn.parentElement;
  // .parentElement gets the element that CONTAINS the button
  // (which is the .friend-list-item div)

  listItem.remove();
  // Removes that entire row from the page

}


// --- Add a new friend ---
// Reads the input, creates a new friend row, clears the input.
function addFriend() {

  var input    = document.getElementById('add-friend-input');
  var feedback = document.getElementById('friend-feedback');
  var username = input.value.trim();
  // .value = the text typed in the input field
  // .trim() removes any leading or trailing spaces

  if (username === '') {
    feedback.textContent = 'Please enter a username.';
    feedback.style.color = '#900';   // Red for errors
    return;
    // 'return' exits the function immediately — stops here if input is empty
  }

  // Create a new friend row element
  var newItem = document.createElement('div');
  newItem.className = 'friend-list-item';
  newItem.innerHTML =
    '<span class="friend-name">' + username + '</span>' +
    '<button class="win95-btn small-btn" onclick="removeFriend(this)">Remove</button>';

  document.getElementById('friend-list').appendChild(newItem);
  // Add it to the bottom of the friends list

  input.value = '';
  // Clear the input field after adding

  feedback.textContent = username + ' added!';
  feedback.style.color = '#006600';  // Green for success

}


// --- Save settings ---
// Shows a confirmation message. In a real app this would
// send the data to a server.
function saveSettings() {

  var feedback = document.getElementById('save-feedback');
  feedback.textContent = 'Settings saved!';

  // Clear the message after 3 seconds so it doesn't linger
  setTimeout(function() {
    feedback.textContent = '';
  }, 3000);
  // setTimeout runs ONCE after the given number of milliseconds
  // 3000ms = 3 seconds

}


/* =====================================================
   PART 8 — STARTUP

   window.onload fires once the whole page has finished
   loading (HTML, CSS, images all ready).
   This is where we call all our setup functions.
   ===================================================== */

window.onload = function() {

  setupBanner();       // Date, daily word, animated upload counter
  buildGallery();      // Explore page: create all art cards
  buildFriendsFeed();  // Friends page: create all friend post cards
  buildCalendar();     // Profile page: draw the upload calendar

};