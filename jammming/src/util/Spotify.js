let accessToken;

const client_id = '89b0cc957f1b411dac0211a0c0c6b816';
const redirect_uri = 'http://localhost:3000/';
const scopes = 'user-read-private user-read-email';

export const Spotify = {
  getAccessToken() {
    if (accessToken) {
      console.log('Already have a token.');
      return accessToken;
    }

    console.log('Getting a token.');
    
    const testA = window.location.href.match(/access_token=([^&]*)/);
    const testB = window.location.href.match(/expires_in=([^&]*)/);

    if (testA && testB) {
      console.log('Got a token');
      accessToken = testA[1];
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
      console.log('Help!');
    }
//
    //  
    //window.setTimeout(() => accessToken = '', expiration * 1000);
    //window.history.pushState('Access Token', null, '/');  
    //  
    //console.log(`Receiving a token and it's ${token}`);
    //
    //accessToken = token;

    //return token;
  },
  search(term) {
    const token = Spotify.getAccessToken();

    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${term}`,
      { 
        headers: {Authorization: `Bearer ${token}`}
      }
    ).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artist,
          album: track.album,
          uri: track.uri
        }));
      }
    })
  }
}