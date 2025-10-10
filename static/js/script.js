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
    otherCard.classList.remove('has-scroll');
    // Clean up scroll handlers
    if (otherCard.scrollHandler) {
      otherCard.removeEventListener('scroll', otherCard.scrollHandler);
      otherCard.scrollHandler = null;
    }
  });

  // Remove backdrop if closing
  if (isCurrentlyExpanded) {
    projectsGrid.classList.remove('has-expanded');
    // Re-enable body scroll
    document.body.style.overflow = '';
    // Pause all videos when closing
    card.querySelectorAll('video').forEach(video => {
      video.pause();
      const mediaItem = video.closest('.media-item');
      const playBtn = mediaItem.querySelector('.video-play-btn');
      mediaItem.classList.remove('video-playing');
      if (playBtn) playBtn.classList.remove('playing');
    });
  } else {
    // Expand the clicked card
    card.classList.add('expanded');
    projectsGrid.classList.add('has-expanded');
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Check if content is scrollable and add indicator
    setTimeout(() => {
      checkScrollability(card);
    }, 300);
    
  // Don't auto-play videos on expand - let user control playback
  // This respects browser autoplay policies and user preferences
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
        // Pause all videos in the card
        card.querySelectorAll('video').forEach(video => {
          video.pause();
          const mediaItem = video.closest('.media-item');
          const playBtn = mediaItem.querySelector('.video-play-btn');
          mediaItem.classList.remove('video-playing');
          if (playBtn) playBtn.classList.remove('playing');
        });
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
        // Pause all videos in the card
        card.querySelectorAll('video').forEach(video => {
          video.pause();
          const mediaItem = video.closest('.media-item');
          const playBtn = mediaItem.querySelector('.video-play-btn');
          mediaItem.classList.remove('video-playing');
          if (playBtn) playBtn.classList.remove('playing');
        });
        card.classList.remove('expanded');
      });
      projectsGrid.classList.remove('has-expanded');
      // Re-enable body scroll
      document.body.style.overflow = '';
    }
  }
});

// Media Gallery Functions
function navigateMedia(button, direction) {
  // Prevent event bubbling to avoid triggering card expansion
  event.stopPropagation();
  
  const gallery = button.closest('.media-gallery');
  const mediaItems = gallery.querySelectorAll('.media-item');
  const thumbnails = gallery.querySelectorAll('.thumbnail');
  
  let currentIndex = 0;
  mediaItems.forEach((item, index) => {
    if (item.classList.contains('active')) {
      currentIndex = index;
    }
  });
  
  // Calculate new index
  let newIndex = currentIndex + direction;
  if (newIndex >= mediaItems.length) newIndex = 0;
  if (newIndex < 0) newIndex = mediaItems.length - 1;
  
  // Update active states
  updateMediaActive(gallery, newIndex);
}

function selectMedia(thumbnail, index) {
  // Prevent event bubbling to avoid triggering card expansion
  event.stopPropagation();
  
  const gallery = thumbnail.closest('.media-gallery');
  updateMediaActive(gallery, index);
}

function updateMediaActive(gallery, activeIndex) {
  const mediaItems = gallery.querySelectorAll('.media-item');
  const thumbnails = gallery.querySelectorAll('.thumbnail');
  
  // Pause all videos and reset play states
  gallery.querySelectorAll('video').forEach((video, index) => {
    const mediaItem = video.closest('.media-item');
    const playBtn = mediaItem.querySelector('.video-play-btn');
    
    video.pause();
    mediaItem.classList.remove('video-playing');
    if (playBtn) {
      playBtn.classList.remove('playing');
    }
  });
  
  // Update media items
  mediaItems.forEach((item, index) => {
    item.classList.toggle('active', index === activeIndex);
  });
  
  // Update thumbnails
  thumbnails.forEach((thumb, index) => {
    thumb.classList.toggle('active', index === activeIndex);
  });
  
  // Don't auto-play videos when navigating - respect browser autoplay policies
  // Videos will only play when user explicitly clicks the play button
}

// Video control functions
function toggleVideoPlayback(videoItem) {
  event.stopPropagation();
  
  const video = videoItem.querySelector('video');
  const playBtn = videoItem.querySelector('.video-play-btn');
  
  if (video.paused) {
    video.play().then(() => {
      videoItem.classList.add('video-playing');
      playBtn.classList.add('playing');
    }).catch(err => {
      console.log('Play prevented:', err);
    });
  } else {
    video.pause();
    videoItem.classList.remove('video-playing');
    playBtn.classList.remove('playing');
  }
}

function toggleVideoMute(muteBtn) {
  event.stopPropagation();
  
  const video = muteBtn.closest('.media-item').querySelector('video');
  const volumeOn = muteBtn.querySelector('.volume-on');
  const volumeOff = muteBtn.querySelector('.volume-off');
  
  if (video.muted) {
    video.muted = false;
    volumeOn.style.display = 'block';
    volumeOff.style.display = 'none';
  } else {
    video.muted = true;
    volumeOn.style.display = 'none';
    volumeOff.style.display = 'block';
  }
}

// Initialize video controls when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add click handlers to video play buttons
  document.querySelectorAll('.video-play-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const videoItem = this.closest('.media-item');
      toggleVideoPlayback(videoItem);
    });
  });
  
  // Add click handlers to mute buttons
  document.querySelectorAll('.mute-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      toggleVideoMute(this);
    });
  });
  
  // Add click handlers to videos themselves
  document.querySelectorAll('.media-item video').forEach(video => {
    video.addEventListener('click', function() {
      const videoItem = this.closest('.media-item');
      toggleVideoPlayback(videoItem);
    });
  });
  
  // Don't auto-play videos on page load - respect browser autoplay policies
  // Videos will only play when user explicitly interacts with them
});

// Keyboard navigation for media gallery
document.addEventListener('keydown', function(event) {
  const expandedCard = document.querySelector('.project-card.expanded');
  if (!expandedCard) return;
  
  const gallery = expandedCard.querySelector('.media-gallery');
  if (!gallery) return;
  
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    const prevBtn = gallery.querySelector('.nav-btn.prev');
    if (prevBtn) navigateMedia(prevBtn, -1);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    const nextBtn = gallery.querySelector('.nav-btn.next');
    if (nextBtn) navigateMedia(nextBtn, 1);
  }
});

// Function to check if content is scrollable and add visual indicators
function checkScrollability(card) {
  // Ensure scrolling is enabled by default
  card.style.overflowY = 'auto';
  card.style.overflowX = 'hidden';
  
  // Force recalculation of dimensions
  card.offsetHeight; // Force reflow
  
  const hasVerticalScroll = card.scrollHeight > card.clientHeight;
  
  // Optional debug logging (commented out to reduce console noise)
  // console.log('Scroll check:', { hasScroll: hasVerticalScroll });
  
  if (hasVerticalScroll) {
    card.classList.add('has-scroll');
    
    // Remove existing scroll listeners to prevent duplicates
    if (card.scrollHandler) {
      card.removeEventListener('scroll', card.scrollHandler);
    }
    
    // Add scroll event listener to update fade indicators
    card.scrollHandler = function() {
      updateScrollIndicators(card);
    };
    card.addEventListener('scroll', card.scrollHandler);
    
    // Initial update
    updateScrollIndicators(card);
    
    // Force initial scroll position check
    setTimeout(() => {
      updateScrollIndicators(card);
    }, 50);
  } else {
    card.classList.remove('has-scroll');
  }
}

// Function to update scroll fade indicators based on scroll position
function updateScrollIndicators(card) {
  const isAtTop = card.scrollTop === 0;
  const isAtBottom = card.scrollTop + card.clientHeight >= card.scrollHeight - 1;
  
  // Update top fade indicator (hide when at top)
  card.style.setProperty('--top-fade-opacity', isAtTop ? '0' : '1');
  
  // Update bottom fade indicator (hide when at bottom)
  card.style.setProperty('--bottom-fade-opacity', isAtBottom ? '0' : '1');
}