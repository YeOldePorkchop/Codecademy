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
      playlistName: 'Default Name',
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
        },
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
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (!this.state.playlistTracks.some(entry => entry.id === track.id)){
      let tracks = this.state.playlistTracks;
      tracks.push(track);

      this.setState({playlistTracks: tracks});
    }
  }

  removeTrack(track) {
    this.setState({playlistTracks: this.state.playlistTracks.filter(entry => entry.id !== track.id)});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((track) => {
      return track.id;
    });
  }

  search(term) {
    console.log(`Search term is ${term}.`);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
