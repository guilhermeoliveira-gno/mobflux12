
    const API_KEY = 'AIzaSyC3XLRTTYVeZcoR5PKv2gx_t3xqVQSyme8';
const videoContainer = document.getElementById('video-container');
  const videoTitle = document.getElementById('video-title');

  function getLastVideoData() {
    const saved = localStorage.getItem('daily_video');
    return saved ? JSON.parse(saved) : null;
  }

  function saveVideoData(videoId, title) {
    const data = {
      videoId,
      title,
      timestamp: Date.now()
    };
    localStorage.setItem('daily_video', JSON.stringify(data));
  }

  function has24HoursPassed(timestamp) {
    const now = Date.now();
    return now - timestamp > 24 * 60 * 60 * 1000;
  }

  async function fetchNewVideo() {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=cadeirantes&type=video&order=date&key=${API_KEY}`);
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        videoContainer.innerHTML = 'Nenhum vídeo encontrado.';
        return;
      }

      const video = data.items[0];
      const videoId = video.id.videoId;
      const title = video.snippet.title;

      saveVideoData(videoId, title);
      displayVideo(videoId, title);
    } catch (error) {
      console.error('Erro ao buscar vídeo:', error);
      videoContainer.innerHTML = 'Erro ao carregar o vídeo.';
    }
  }

  function displayVideo(videoId, title) {
    videoTitle.textContent = title;
    videoContainer.innerHTML = `
      <iframe class="w-100 h-100" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    `;
  }

  function loadDailyVideo() {
    const videoData = getLastVideoData();

    if (videoData && !has24HoursPassed(videoData.timestamp)) {
      displayVideo(videoData.videoId, videoData.title);
    } else {
      fetchNewVideo();
    }
  }

  loadDailyVideo();
