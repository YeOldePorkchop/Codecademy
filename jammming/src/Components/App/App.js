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
            <SearchResults searchResults={this.state.searchResults}/>
            <Playlist />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
