// Replace this with your real Spotify OAuth Token
const token = 'YOUR_SPOTIFY_ACCESS_TOKEN_HERE';

window.onSpotifyWebPlaybackSDKReady = () => {
  const player = new Spotify.Player({
    name: 'Spotify Web Player',
    getOAuthToken: cb => { cb(token); },
    volume: 0.5
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message); document.getElementById('status').innerText = "Initialization error: " + message; });
  player.addListener('authentication_error', ({ message }) => { console.error(message); document.getElementById('status').innerText = "Authentication error: " + message; });
  player.addListener('account_error', ({ message }) => { console.error(message); document.getElementById('status').innerText = "Account error: " + message; });
  player.addListener('playback_error', ({ message }) => { console.error(message); document.getElementById('status').innerText = "Playback error: " + message; });

  // Playback status updates
  player.addListener('player_state_changed', state => { console.log(state); });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    document.getElementById('status').innerText = "Player is ready! Device ID: " + device_id;

    // Transfer playback to this device
    fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [device_id],
        play: false
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
  });

  // Connect to the player!
  player.connect();

  // Expose controls to window
  window.play = () => { player.resume(); };
  window.pause = () => { player.pause(); };
};
