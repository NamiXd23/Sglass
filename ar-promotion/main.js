import { CSS3DObject } from '../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
const THREE = window.MINDAR.IMAGE.THREE;

let player; // global for access in start/stop

// Load YouTube API
const loadYoutubeAPI = () => {
  return new Promise((resolve, reject) => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = resolve;
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    await loadYoutubeAPI();

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../assets/targets/glasses.mind',
    });

    const { renderer, cssRenderer, cssScene, camera } = mindarThree;

    const playerDiv = document.createElement('div');
    playerDiv.id = 'player';
    playerDiv.style.width ='1000px';
    playerDiv.style.height = '685px';

    const arDiv = document.querySelector("#ar-div");
    const cssObject = new CSS3DObject(arDiv);
    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(cssObject);

    // Initially hide the AR div
    arDiv.style.display = "none";

    cssAnchor.onTargetFound = () => {
      if (!player) {
        player = new YT.Player('player', {
          height: '685',
          width: '1000px',
          videoId: '8XWrQsEimkQ',
          events: {
            onReady: () => {
              player.playVideo();
            },
            onError: (e) => console.error('YouTube Player Error:', e)
          }
        });
      } else {
        player.playVideo();
      }

      // Show AR container
      arDiv.style.display = "block";
    };

    cssAnchor.onTargetLost = () => {
      if (player) player.pauseVideo();
      arDiv.style.display = "none"; // Hide when not tracking
    };

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      cssRenderer.render(cssScene, camera);
    });
  };

  start();
});
