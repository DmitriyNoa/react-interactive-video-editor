import React, { Component } from 'react';
import * as timeline from './timelineInfo.json';
import './App.css';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
class App extends Component {

  constructor(props) {
    super(props);
    this.playVideo =  this.playVideo.bind(this);
    this.addToTimeline =  this.addToTimeline.bind(this);
    this.processRange =  this.processRange.bind(this);
  }

  state = {
    crop: {
      x: 0,
      y: 0,
      // aspect: 16 / 9,
    },
    maxHeight: 80,
    overlays: timeline,
    currentlyPlaying: []
  }

  videoEnd = 5;

  currentTime = 0;

  currentRangeStart=0;
  currentRangeEnd=0;

  played = [];

  overlays = timeline;

  overlaysElements = [];

  currentlyPlaying = [];


  render() {
    var crop = {
      x: 20,
      y: 10,
      width: 30,
      height: 10
    }

    this.overlaysElements = this.overlays.map((item) => {
      const currentStyle = {
        height: item.positions.height,
        width: item.positions.width,
        left: item.positions.left,
        top: item.positions.top
      };

      const bubblePosition = {
        left: (item.positions.width / 2),
        top: (item.positions.height / 2)
      }
      return (
        <div ref={"o"+ item.id} className="timelineItem" id={"ov"+item.id} style={currentStyle} key={item.id}>
          <div className="bubble-wrapper">
            <div className="bubble">{item.title}</div>
          </div>
        </div>
      )
    })

    return (
      <div className="App">
        <div className="video-editor">
          <div className="video-cart-wrapper">
            <video ref="videoEditor" id="videoEditor" width="800" src="https://d3so4ejy3cg45.cloudfront.net/video/MINTANDBERRY/e4e4/31d9cb6b6953857030715680700.mp4"></video>
            <div className="cropper">
              <ReactCrop maxWidth={800} src="placeholder.png" crop={crop} onChange={this.onCropChange}  {...this.state}  onImageLoaded={this.onImageLoaded}
                         onComplete={this.onCropComplete} />
            </div>
          </div>
          <div className="video-controls">
            <Range onChange={this.processRange} step={0.1} min={0} max={71.808} />
            <button onClick={this.playVideo}>play</button>
            <button onClick={this.addToTimeline}>add to timeline</button>
          </div>
        </div>
        <div className="video-cart-wrapper">
          <video id="videoCart" width="800" src="https://d3so4ejy3cg45.cloudfront.net/video/MINTANDBERRY/e4e4/31d9cb6b6953857030715680700.mp4" controls></video>
          {this.overlaysElements}
        </div>
      </div>
    );
  }

  processRange(e) {
    if(e[0]!==this.currentRangeStart) {
      this.currentRangeStart = e[0];
      this.refs.videoEditor.currentTime =e[0];
      this.currentTime = this.currentRangeStart;
    }

    if(e[1]!==this.currentRangeEnd) {
      this.currentRangeEnd = e[1];
      this.refs.videoEditor.currentTime = e[1];
      this.currentTime = this.currentRangeEnd;
    }
  }

  playVideo() {
    const video = this.refs.videoEditor;
    if (!video.paused) {
      video.pause();
    } else {
      video.play();
    }
  }

  addToTimeline () {
    console.log(this.state.crop);
  }

  componentDidMount() {
    let v = document.getElementById('videoCart');
    let originalVideoWidth = 1920;
    let originalVideoHeight = 1080;
    let currentSize = 800;
    let widthScale = (currentSize / originalVideoWidth) * 100;
    let currentlyPlaying = [];



    v.addEventListener('timeupdate',(event) => {
      this.overlays.forEach((item, index) => {
        if (v.currentTime >= item.timestampStart) {
          this.currentlyPlaying.push(item);
          this.overlays.splice(index, 1);
          this.refs["o" + item.id].style.display = "block";
        }
      });

      this.currentlyPlaying.forEach((item, index) => {
        if (v.currentTime >= item.timestampEnd) {
          this.played.push(item);
          this.currentlyPlaying.splice(index, 1);
          this.refs["o" + item.id].style.display = "none";
        }
      });
    },false);

    v.addEventListener('loadedmetadata',() => {
      this.videoEnd = v.duration;
      console.log(this.videoEnd);
    });
  }

  onImageLoaded = (image) => {
    this.setState({
      crop: makeAspectCrop({
        x: 0,
        y: 0,
        width: 50,
      }, image.naturalWidth / image.naturalHeight),
      image,
    });
  }

  onCropComplete = (crop, pixelCrop) => {
    console.log('onCropComplete, pixelCrop:', pixelCrop);
  }

  onCropChange = (crop) => {
    this.setState({ crop });
  }
}

export default App;
