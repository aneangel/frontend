function openSection(evt, sectionName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(sectionName).style.display = "block";
    evt.currentTarget.className += " active";
  }
  
  // Maintain the 'Projects' tab open by default if no tab has been clicked yet
  if (document.getElementById("defaultOpen")) {
    document.getElementById("defaultOpen").click();
  }

// Project card expansion functionality
function toggleExpansion(card) {
  // Check if the click was on a link or inside a link
  if (event.target.closest('a') || event.target.tagName === 'A') {
    return; // Don't toggle expansion if clicking on links
  }

  const projectsGrid = document.querySelector('.projects-grid');
  const isCurrentlyExpanded = card.classList.contains('expanded');

  // Close all expanded cards first
  const allCards = document.querySelectorAll('.project-card.expanded');
  allCards.forEach(otherCard => {
    otherCard.classList.remove('expanded');
  });

  // Remove backdrop if closing
  if (isCurrentlyExpanded) {
    projectsGrid.classList.remove('has-expanded');
    // Re-enable body scroll
    document.body.style.overflow = '';
  } else {
    // Expand the clicked card
    card.classList.add('expanded');
    projectsGrid.classList.add('has-expanded');
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }
}

// Close expanded cards when clicking outside or on backdrop
document.addEventListener('click', function(event) {
  // Check if the click is outside of any project card or on the backdrop
  if (!event.target.closest('.project-card')) {
    const projectsGrid = document.querySelector('.projects-grid');
    const expandedCards = document.querySelectorAll('.project-card.expanded');
    
    if (expandedCards.length > 0) {
      expandedCards.forEach(card => {
        card.classList.remove('expanded');
      });
      projectsGrid.classList.remove('has-expanded');
      // Re-enable body scroll
      document.body.style.overflow = '';
    }
  }
});

// Keyboard accessibility for project cards
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const projectsGrid = document.querySelector('.projects-grid');
    const expandedCards = document.querySelectorAll('.project-card.expanded');
    
    if (expandedCards.length > 0) {
      expandedCards.forEach(card => {
        card.classList.remove('expanded');
      });
      projectsGrid.classList.remove('has-expanded');
      // Re-enable body scroll
      document.body.style.overflow = '';
    }
  }
});