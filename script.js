/* lock screen */

function unlockSite() {

  var lock = document.getElementById('lock-screen');

  lock.classList.add('hidden');

  setTimeout(function() {
    lock.remove();
  }, 400);

}

/* spa navigation */

function showSection(sectionName) {

  var allSections = document.querySelectorAll('.page-section');

  allSections.forEach(function(section) {
    section.classList.remove('active-section');
  });

  var allNavLinks = document.querySelectorAll('.nav-link');

  allNavLinks.forEach(function(link) {
    link.classList.remove('active');
  });

  var targetSection = document.getElementById('section-' + sectionName);

  if (targetSection) {
    targetSection.classList.add('active-section');
  }

  var activeLink = document.querySelector('[data-section="' + sectionName + '"]');

  if (activeLink) {
    activeLink.classList.add('active');
  }

}


/* mobile menu */

function openMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  menu.classList.add('open');
}

function closeMobileMenu() {
  var menu = document.getElementById('mobile-menu');
  menu.classList.remove('open');
}


/* banner */

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

  // date
  var today = new Date();

  var formattedDate = today.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric'
  });

  document.getElementById('current-date').textContent = formattedDate;

  // daily word
  var startOfYear = new Date(today.getFullYear(), 0, 1);

  var millisecondsDiff = today - startOfYear;

  var dayOfYear = Math.floor(millisecondsDiff / 86400000);

  var wordIndex = dayOfYear % dailyWords.length;

  document.getElementById('daily-word').textContent = dailyWords[wordIndex];

  var lockWord = document.getElementById('lock-daily-word');
  if (lockWord) {
    lockWord.textContent = dailyWords[wordIndex];
  }

  // upload count
  animateCounter('upload-count', 267, ' Uploads');

}

function animateCounter(elementId, target, suffix) {

  var element = document.getElementById(elementId);
  var current = 0;
  var duration = 1200;
  var fps = 60;
  var totalFrames = (duration / 1000) * fps;
  var increment   = target / totalFrames;

  var timer = setInterval(function() {

    current += increment;

    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    element.textContent = Math.floor(current) + suffix;

  }, 1000 / fps);

}

/* explore gallery */

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

  artworkData.forEach(function(artwork) {

    var card = document.createElement('div');
    card.className = 'art-card';

    var imageHTML;

    if (artwork.imageSrc) {
      imageHTML = '<img src="' + artwork.imageSrc + '" alt="Artwork by ' + artwork.username + '">';
    } else {
      imageHTML = '<div class="art-placeholder">[ artwork ]</div>';
    }

    card.innerHTML =
      imageHTML +
      '<div class="art-info">' +
        '<span class="art-username">' + artwork.username + '</span>' +
        '<span class="art-time">'     + artwork.time     + '</span>' +
      '</div>';

    grid.appendChild(card);

  });

}


/* friends feed */

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

/* profile page */

// profile tab switcher
function showProfileTab(tabName) {

  var allPanels = document.querySelectorAll('.tab-panel');
  allPanels.forEach(function(panel) {
    panel.classList.remove('active-tab-panel');
  });

  var allTabs = document.querySelectorAll('.profile-tab');
  allTabs.forEach(function(tab) {
    tab.classList.remove('active-tab');
  });

  var targetPanel = document.getElementById('tab-' + tabName);
  if (targetPanel) {
    targetPanel.classList.add('active-tab-panel');
  }

  var activeTab = document.querySelector('[data-tab="' + tabName + '"]');
  if (activeTab) {
    activeTab.classList.add('active-tab');
  }

}

// privacy toggle
function togglePrivacy() {

  var privacyValue = document.getElementById('privacy-value');

  if (privacyValue.textContent === 'Private') {
    privacyValue.textContent = 'Public';
  } else {
    privacyValue.textContent = 'Private';
  }

}

// calendar
function buildCalendar() {

  var box = document.getElementById('calendar-box');

  var today = new Date();
  var year  = today.getFullYear();
  var month = today.getMonth();

  var monthName = today.toLocaleDateString('en-US', { month: 'long' });

  var daysInMonth = new Date(year, month + 1, 0).getDate();

  var firstDayOfWeek = new Date(year, month, 1).getDay();
  var startOffset = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;

  var daysInPrevMonth = new Date(year, month, 0).getDate();

  var html = '<div class="calendar-month-heading">' + monthName + ' ' + year + '</div>';
  html += '<div class="calendar-grid">';

  var dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  dayNames.forEach(function(d) {
    html += '<div class="cal-header">' + d + '</div>';
  });

  for (var i = 0; i < startOffset; i++) {
    var prevDay = daysInPrevMonth - startOffset + 1 + i;
    html += '<div class="cal-day other-month">' + prevDay + '</div>';
  }

  for (var day = 1; day <= daysInMonth; day++) {
    html += '<div class="cal-day">' + day + '</div>';
  }

  var totalCells = startOffset + daysInMonth;
  var remainder  = totalCells % 7;
  if (remainder !== 0) {
    var trailingDays = 7 - remainder;
    for (var j = 1; j <= trailingDays; j++) {
      html += '<div class="cal-day other-month">' + j + '</div>';
    }
  }

  html += '</div>';

  box.innerHTML = html;

}

// remove friend
function removeFriend(btn) {

  var listItem = btn.parentElement;
  listItem.remove();

}

// add friend
function addFriend() {

  var input    = document.getElementById('add-friend-input');
  var feedback = document.getElementById('friend-feedback');
  var username = input.value.trim();

  if (username === '') {
    feedback.textContent = 'Please enter a username.';
    feedback.style.color = '#900';
    return;
  }

  var newItem = document.createElement('div');
  newItem.className = 'friend-list-item';
  newItem.innerHTML =
    '<span class="friend-name">' + username + '</span>' +
    '<button class="win95-btn small-btn" onclick="removeFriend(this)">Remove</button>';

  document.getElementById('friend-list').appendChild(newItem);

  input.value = '';

  feedback.textContent = username + ' added!';
  feedback.style.color = '#006600';

}

// save settings
function saveSettings() {

  var feedback = document.getElementById('save-feedback');
  feedback.textContent = 'Settings saved!';

  setTimeout(function() {
    feedback.textContent = '';
  }, 3000);

}

/* startup */

window.onload = function() {

  setupBanner();
  buildGallery();
  buildFriendsFeed();
  buildCalendar();

};
