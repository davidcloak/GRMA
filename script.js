async function fetchMediaData() {
    try {
        const response = await fetch('./Media/media_reference.json');
        const mediaData = await response.json();
        return mediaData;
    } catch (error) {
        console.error("Error fetching JSON:", error);
    }
}

function displayMedia(media, container, background) {
    const mediaElement = container.querySelector('.visible');
    if (mediaElement) {
        // Remove the 'visible' class to start the fade-out effect
        mediaElement.classList.remove('visible');
        setTimeout(() => container.removeChild(mediaElement), 250); // Remove after fade-out completes
    }

    background.style.display = 'none'; // Hide the background by default

    if (media.type === 'image') {
        const img = document.createElement('img');
        img.src = `./Media/${media.file_path}`;
        container.appendChild(img);

        img.onload = () => {
            // Display a zoomed-in background for every image
            background.style.backgroundImage = `url('./Media/${media.file_path}')`;
            background.style.display = 'block'; // Always show the background
            img.classList.add('visible'); // Fade in the image
        };
    } else if (media.type === 'video') {
        const video = document.createElement('video');
        video.src = `./Media/${media.file_path}`;
        video.autoplay = true;
        video.controls = false;
        video.loop = false;
        container.appendChild(video);

        video.onloadeddata = () => video.classList.add('visible'); // Fade in the video

        // Hide the background for videos
        background.style.display = 'none';

        // Play the video and automatically proceed to the next item when it ends
        video.onended = () => playNextMedia();
    }
}

let currentIndex = 0;
let mediaList = [];
const mediaContainer = document.getElementById('media-container');
const background = document.createElement('div');
background.id = 'background';
document.body.appendChild(background);

async function playNextMedia() {
    mediaList = JSON.parse(data)

    if (currentIndex >= mediaList.length) {
        currentIndex = 0; // Loop back to the beginning
    }

    const currentMedia = mediaList[currentIndex];
    displayMedia(currentMedia, mediaContainer, background);

    if (currentMedia.type === 'image') {
        setTimeout(() => {
            currentIndex++;
            playNextMedia();
        }, currentMedia.duration * 1000); // Show images for the specified duration
    } else {
        currentIndex++;
    }
}

// Start the media playback
playNextMedia();
