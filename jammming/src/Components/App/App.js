import React from 'react';
import './App.css';

import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [
        {
          name: 'Song A',
          artist: 'Artist A',
          album: 'Album A',
          id: '1'
        },
        {
          name: 'Song B',
          artist: 'Artist B',
          album: 'Album B',
          id: '2'
        },
        {
          name: 'Song C',
          artist: 'Artist C',
          album: 'Album C',
          id: '3'
        },
        {
          name: 'Song D',
          artist: 'Artist D',
          album: 'Album D',
          id: '4'
        }
      ],
      playlists: [
        {
          playlistName: 'Playlist A',
          playlistTracks: [
            {
              name: 'Song E',
              artist: 'Artist E',
              album: 'Album E',
              id: '5'
            },
            {
              name: 'Song F',
              artist: 'Artist F',
              album: 'Album F',
              id: '6'
            }
          ]
        },
        {
          playlistName: 'Playlist B',
          playlistTracks: [
            {
              name: 'Song G',
              artist: 'Artist G',
              album: 'Album G',
              id: '7'
            },
            {
              name: 'Song H',
              artist: 'Artist H',
              album: 'Album H',
              id: '8'
            }
          ]
        }
      ]
    };
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} />
            <Playlist playlists={this.state.playlists} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
