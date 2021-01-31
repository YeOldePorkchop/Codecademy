import React from 'react';
import './Playlist.css';

import { TrackList } from '../TrackList/TrackList';

export class Playlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'New Playlist'
    }

    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(e) {
    let name = e.target.value;
    this.props.onNameChange(name);
    this.setState({value: name});
    e.preventDefault();
  }

  render() {
    return (
      <div className="Playlist">
        <input value={this.state.value} onChange={this.handleNameChange} />
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
        <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
      </div>
    );
  }
}