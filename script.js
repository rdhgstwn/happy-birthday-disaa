// ===================================
// GALLERY MODAL FUNCTIONALITY
// ===================================
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
let currentImageIndex = 0;

// Image URLs array
const imageUrls = [
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg',
    'images/6.jpg',
    'images/7.jpg',
    'images/8.jpg',
    'images/9.jpg',
    'images/10.jpg',
    'images/11.jpg',
    'images/12.jpg',
    'images/13.jpg',
    'images/14.jpg',
    'images/15.jpg',
    'images/16.jpg',
    'images/17.jpg',
    'images/18.jpg'
];

function openModal(imageSrc) {
    currentImageIndex = imageUrls.indexOf(imageSrc);
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) {
        currentImageIndex = imageUrls.length - 1;
    } else if (currentImageIndex >= imageUrls.length) {
        currentImageIndex = 0;
    }
    modalImg.src = imageUrls[currentImageIndex];
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'block') {
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        }
    }
});

// ===================================
// MUSIC PLAYER FUNCTIONALITY
// ===================================
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const trackName = document.getElementById('trackName');
const trackArtist = document.getElementById('trackArtist');
const progressBar = document.getElementById('progress');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');

// Playlist
const playlist = [
    {
        name: 'Blue',
        artist: 'Yung Kai',
        url: 'Music/yung kai - blue.mp3'
    },
    {
        name: 'Golden Hour',
        artist: 'JVKE',
        url: 'Music/JVKE - golden hour.mp3'
    },
    {
        name: 'BIRDS OF A FEATHER',
        artist: 'Billie Eilish',
        url: 'Music/Billie Eilish - BIRDS OF A FEATHER.mp3'
    },
    {
        name: 'Here With Me',
        artist: 'D4vd',
        url: 'Music/d4vd - Here With Me.mp3'
    },
    {
        name: 'FIFTY FIFTY (피프티피프티)',
        artist: 'Cupid',
        url: 'Music/Cupid - LIVE IN STUDIO FIFTY FIFTY (피프티피프티).mp3'
    }
];

let currentTrackIndex = 0;
let isPlaying = false;

// Initialize player
function initPlayer() {
    loadTrack(currentTrackIndex);
    audioPlayer.volume = 0.5;
    
    // Try to autoplay
    audioPlayer.muted = true;
    audioPlayer.play().then(() => {
        setTimeout(() => {
            audioPlayer.muted = false;
            isPlaying = true;
            updatePlayPauseButton();
        }, 500);
    }).catch(error => {
        console.log('Autoplay prevented:', error);
        showMusicPrompt();
    });
}

function loadTrack(index) {
    const track = playlist[index];
    trackName.textContent = track.name;
    trackArtist.textContent = track.artist;
    audioPlayer.src = track.url;
    
    if (isPlaying) {
        audioPlayer.play();
    }
}

function toggleMusic() {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.muted = false;
        audioPlayer.play().catch(error => {
            console.log('Play prevented:', error);
            showMusicPrompt();
        });
    }
    isPlaying = !isPlaying;
    updatePlayPauseButton();
}

function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        playPauseBtn.style.animation = 'pulse 2s infinite';
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        playPauseBtn.style.animation = 'none';
    }
}

function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    resetProgress();
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    resetProgress();
}

function resetProgress() {
    progressBar.style.width = '0%';
}

// Volume control
function changeVolume(value) {
    audioPlayer.volume = value / 100;
    updateVolumeIcon();
}

function toggleMute() {
    if (audioPlayer.muted) {
        audioPlayer.muted = false;
        volumeSlider.value = audioPlayer.volume * 100;
    } else {
        audioPlayer.muted = true;
        volumeSlider.value = 0;
    }
    updateVolumeIcon();
}

function updateVolumeIcon() {
    const icon = muteBtn.querySelector('i');
    if (audioPlayer.muted || audioPlayer.volume === 0) {
        icon.className = 'fas fa-volume-mute';
    } else if (audioPlayer.volume < 0.5) {
        icon.className = 'fas fa-volume-down';
    } else {
        icon.className = 'fas fa-volume-up';
    }
}

// Update progress bar
audioPlayer.addEventListener('timeupdate', function() {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + '%';
    }
});

// Play next track when current ends
audioPlayer.addEventListener('ended', function() {
    nextTrack();
});

// Progress bar click to seek
progressBar.addEventListener('click', function(e) {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

// Show music prompt for user interaction
function showMusicPrompt() {
    const existingPrompt = document.querySelector('.music-prompt');
    if (existingPrompt) return;
    
    const prompt = document.createElement('div');
    prompt.className = 'music-prompt';
    prompt.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(255, 105, 180, 0.3);
        z-index: 2000;
        text-align: center;
        animation: scaleIn 0.5s ease;
    `;
    prompt.innerHTML = `
        <div style="font-size: 3rem; color: #ff69b4; margin-bottom: 15px;">🎵</div>
        <p style="margin-bottom: 20px; color: #666; font-size: 1.1rem;">Klik untuk memutar playlist ulang tahun</p>
        <button onclick="this.parentElement.remove(); toggleMusic();" style="
            background: linear-gradient(135deg, #ff69b4, #ff1493);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: transform 0.3s ease;
        ">Putar Musik</button>
    `;
    document.body.appendChild(prompt);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        if (prompt.parentElement) {
            prompt.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => prompt.remove(), 500);
        }
    }, 8000);
}

// ===================================
// SECRET MESSAGE FUNCTIONALITY
// ===================================
function revealLove() {
    const secret = document.getElementById('secret');
    secret.style.display = 'block';
    
    // Trigger confetti when secret is revealed
    showConfetti();
    
    // Scroll to secret message
    setTimeout(() => {
        secret.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

// ===================================
// THEME TOGGLE FUNCTIONALITY
// ===================================
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    body.classList.toggle('dark');
    
    if (body.classList.contains('dark')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('themeIcon');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

// ===================================
// CONFETTI FUNCTIONALITY
// ===================================
function showConfetti() {
    // Main confetti burst
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#ffffff']
    });
    
    // Side confetti bursts
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff69b4', '#ff1493', '#ffb6c1']
        });
    }, 250);
    
    setTimeout(() => {
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff69b4', '#ff1493', '#ffb6c1']
        });
    }, 400);
}

// ===================================
// ANIMATION ENHANCEMENTS
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme
    loadTheme();
    
    // Initialize music player
    initPlayer();
    
    // Create sparkles
    createSparkles();
    
    // Add floating hearts periodically
    setInterval(createFloatingHeart, 3000);
    
    // Show confetti on page load
    setTimeout(showConfetti, 1000);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.fade-in').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(item);
    });
});

// Create sparkles effect
function createSparkles() {
    const sparklesContainer = document.querySelector('.sparkles');
    if (!sparklesContainer) return;
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        sparklesContainer.appendChild(sparkle);
    }
}

// Create floating heart
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.style.cssText = `
        position: fixed;
        font-size: ${Math.random() * 20 + 15}px;
        color: rgba(255, 105, 180, ${Math.random() * 0.5 + 0.3});
        left: ${Math.random() * 100}%;
        bottom: -50px;
        z-index: 1;
        pointer-events: none;
        animation: floatHeart ${Math.random() * 5 + 10}s linear;
    `;
    document.body.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 15000);
}

// Add CSS animation for floating heart
const style = document.createElement('style');
style.textContent = `
    @keyframes floatHeart {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;
document.head.appendChild(style);