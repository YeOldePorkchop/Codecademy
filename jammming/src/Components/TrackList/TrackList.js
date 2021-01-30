import React from 'react';
import PropTypes from 'prop-types';
import './TrackList.css';
import { Track } from '../Track/Track';

export class TrackList extends React.Component {
  render() {
    return (
      <div class="TrackList">
        {
          this.props.tracks.map((track) => {
            return <Track key={track.id} track={track} />;
          })
        }
      </div>
    );
  }
}

TrackList.propTypes = {
  tracks: PropTypes.array
}