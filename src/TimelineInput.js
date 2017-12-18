import React, { Component } from 'react';

class TimelineInput extends Component {

  constructor(props) {
    super();
  }

  render() {
    return (
      <div className="timelineItem">
        <input type="text" value="title" />
        <input type="text" value="title" />
      </div>
    )
  }

}