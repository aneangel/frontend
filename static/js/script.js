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
    
    // Auto-play active video if there is one
    const activeVideo = card.querySelector('.media-item.active[data-type="video"] video');
    if (activeVideo) {
      const videoItem = activeVideo.closest('.media-item');
      const playBtn = videoItem.querySelector('.video-play-btn');
      
      setTimeout(() => {
        activeVideo.play().then(() => {
          videoItem.classList.add('video-playing');
          if (playBtn) playBtn.classList.add('playing');
        }).catch(err => {
          console.log('Autoplay prevented on expand:', err);
        });
      }, 400);
    }
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
  
  // Auto-play video if the new active item is a video
  const activeItem = mediaItems[activeIndex];
  if (activeItem && activeItem.dataset.type === 'video') {
    const video = activeItem.querySelector('video');
    const playBtn = activeItem.querySelector('.video-play-btn');
    
    if (video) {
      // Small delay to ensure the transition is smooth
      setTimeout(() => {
        video.play().then(() => {
          activeItem.classList.add('video-playing');
          if (playBtn) {
            playBtn.classList.add('playing');
          }
        }).catch(err => {
          console.log('Autoplay prevented:', err);
          // Autoplay was prevented, show play button
          if (playBtn) {
            playBtn.classList.remove('playing');
          }
        });
      }, 300);
    }
  }
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
  
  // Auto-play active videos on page load
  document.querySelectorAll('.media-gallery').forEach(gallery => {
    const activeVideo = gallery.querySelector('.media-item.active[data-type="video"] video');
    if (activeVideo) {
      const videoItem = activeVideo.closest('.media-item');
      const playBtn = videoItem.querySelector('.video-play-btn');
      
      activeVideo.play().then(() => {
        videoItem.classList.add('video-playing');
        if (playBtn) playBtn.classList.add('playing');
      }).catch(err => {
        console.log('Initial autoplay prevented:', err);
      });
    }
  });
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