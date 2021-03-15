let accessToken;

const client_id = '89b0cc957f1b411dac0211a0c0c6b816';
const redirect_uri = 'http://yeoldeporkchop.surge.sh/';
const scopes = 'user-read-private,user-read-email,playlist-modify-public,playlist-modify-private';

export const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    
    const tempAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const tempExpirationTime = window.location.href.match(/expires_in=([^&]*)/);

    if (tempAccessToken && tempExpirationTime) {
      accessToken = tempAccessToken[1];
      const expirationTime = tempExpirationTime[1];

      window.setTimeout(() => accessToken = '', expirationTime * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {      
      const url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=${scopes}&redirect_uri=${redirect_uri}`
      window.location = url;      
    }
  },
  search(term) {
    let token = Spotify.getAccessToken();
    
    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      { 
        headers: {Authorization: `Bearer ${token}`}
      }
    ).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks.items) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      }
    });
  },
  async savePlaylist(playlistName, playlistTrackURIs) {
    if (!playlistName || !playlistTrackURIs) {
      return;
    }

    let token = Spotify.getAccessToken();
    let header = { Authorization: `Bearer ${token}` };
    let userId;

    await fetch(
      'https://api.spotify.com/v1/me',
      { 
        headers: header
      }
    ).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse) {
        userId = jsonResponse.id;
      }
    });

    let playlistId;

    await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      { 
        headers: header,
        method: 'POST',
        body: JSON.stringify({
          name: playlistName,
          description: 'This is created from my Codecademy project',
          public: true
        })
     }
    ).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse) {
        playlistId = jsonResponse.id;
      }
    }).catch(error => {
      console.log(error);
    });

    await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
      { 
        headers: header,
        method: 'POST',
        body: JSON.stringify({
          uris: playlistTrackURIs
        })
     }
    ).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse) {
        playlistId = jsonResponse.id;
      }
    }).catch(error => {
      console.log(error);
    });
  }
}