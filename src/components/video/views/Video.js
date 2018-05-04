import React from 'react';
import { connect } from 'react-redux';

import { actions as socketActions } from '../../../lib/socketStoreEnhancer/';
import { view as modal } from '../../modal/';
import './video.scss';

const Toast = modal.Toast;

class Video extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     showVideo: this.props.video.fromUid !== this.props.uid,
        // }

        this.connectionOption = {
            offerToReceiveVideo: 1,
            // iceServers: [{
            //     // url: 'stun:stun.l.google.com:19302',
            //     url: 'stun.xten.com',
            // }]
        }
        this.constraints = {
            // audio: true,
            video: true,
        };

        this.onAcceptClick = this.onAcceptClick.bind(this);

        this._requestVideo = this._requestVideo.bind(this);
        this._responseVideo = this._responseVideo.bind(this);
        this._getUserMedia = this._getUserMedia.bind(this);
        this._getRtcPeerConnection = this._getRtcPeerConnection.bind(this);

    }
    
    // componentWillReceiveProps(nextProps) {
    //     const newIceCandidate = nextProps.video.icecandidate;
    //     if (newIceCandidate && this.props.video.icecandidate !== newIceCandidate) {
    //         console.log(`addIceCandidate newIceCandidate`);
    //         this.localConnection.addIceCandidate(new RTCIceCandidate(newIceCandidate));
    //     }
    // }

    onAcceptClick() {
        this._responseVideo();
    }

    render() {
        let content = null;
        // if (!this.state.showVideo) {
        //     content = (
        //         <button type='button' onClick={this.onAcceptClick}>接受</button>
        //     );
        // };
        return (
            <div className='video'>
                <video ref={video => this.localVideo = video}></video>
                {/* <video ref={video => this.remoteVideo = video}></video> */}
                {content}
            </div>
        );
    }

    componentDidMount() {
        if (!('offer' in this.props.video)) {
            // 作为发送方
            console.log('_requestVideo');
            this._requestVideo();
        } else {
            console.log('_responseVideo');
            this._responseVideo();
        }
    }

    componentDidUpdate() {
        if (this.props.video.icecandidate.length > 0) {
            for (let icecandidate of this.props.video.icecandidate) {
                const conn = this.localConnection ? this.localConnection : this.remoteConnection;
                conn.addIceCandidate(icecandidate)
                .then(() => {
                    console.log(`addIceCandidate success`);//7 11
                }).catch((error) => {
                    console.log(`addIceCandidate fail`);
                    console.log(error);
                });
            }
        }
        // 作为视频请求方，收到远程的响应answer时
        if (!('answer' in this.props.video) || this.props.video.answer === undefined || this.props.video.uid === this.props.uid) {
            return;
        }
        if (!this.props.video.answer) {
            // 对方拒绝视频
            Toast.info('对方拒绝视频');
            return;
        }
        if (!this.remoteDescription) {
            this.localConnection.setRemoteDescription(this.props.video.answer)
            .then(() => {
                console.log(`localConnection.setRemoteDescription success`);
            })
            .catch(() => {
                console.log(`localConnection.setRemoteDescription fail`);
            });
            this.remoteDescription = true;
        }
    }

    _requestVideo() {
        this._getUserMedia(this.constraints)
        .then((stream) => {
            this.localVideo.srcObject = stream;
            this.localVideo.play();
            this.mStream = stream;
            this.localVideoTracks = this.mStream.getVideoTracks();
            this.localAudioTracks = this.mStream.getAudioTracks();
            if (this.localVideoTracks && this.localVideoTracks.length > 0) {
                console.log(`using video device: ${this.localVideoTracks[0].label}`);
            }
            if (this.mAudioTracks && this.mAudioTracks.length > 0) {
                console.log(`using audio device: ${this.mAudioTracks[0].label}`);
            }

            this.localConnection = new RTCPeerConnection();
            this.localConnection.addEventListener('icecandidate', (event) => {
                const peerConnection = event.target;
                const iceCandidate = event.candidate;

                if (iceCandidate) {
                    const newIceCandidate = new RTCIceCandidate(iceCandidate);
                    this.props.iceCandidate({
                        fromUid: this.props.uid,
                        uid: this.props.to,
                        data: newIceCandidate,
                    });
                }
            });

            this.localConnection.addStream(this.mStream);
            this.localConnection.createOffer(this.connectionOption)
            .then((description) => {
                console.log(`localPeerConnection setLocalDescription start.`);//1
                this.localConnection.setLocalDescription(description)
                .then(() => {
                    console.log(`mPeerConnection.setLocalDescription success`);//2
                })
                .catch((err) => {
                    console.log(`mPeerConnection.setLocalDescription fail`);
                });
                this.props.videoReq({
                    fromUid: this.props.uid,
                    uid: this.props.to,
                    offer: description,
                });
            })
            .catch((err) => {
                console.log(`mPeerConnection.createOffer fail`);
                console.log(err);
            });
        })
        .catch((error) => {
            Toast.info(`navigator.getUserMedia error: ${error}`);
            console.log('navigator.getUserMedia error: ', error);
        });
    }

    _responseVideo() {
        this.remoteConnection = new RTCPeerConnection();
        this.remoteConnection.addEventListener('icecandidate', (event) => {
            const peerConnection = event.target;
            const iceCandidate = event.candidate;

            if (iceCandidate) {
                const newIceCandidate = new RTCIceCandidate(iceCandidate);
                this.props.iceCandidate({
                    fromUid: this.props.uid,
                    uid: this.props.to,
                    data: newIceCandidate,
                });
            }
        });

        this.remoteConnection.addEventListener('addstream', (event) => {
            const mediaStream = event.stream;
            this.localVideo.srcObject = mediaStream;
            this.localVideo.play();
            this.fStream = mediaStream;
        });

        this.remoteConnection.setRemoteDescription(this.props.video.offer)
        .then(() => {
            console.log(`fPeerConnection.setRemoteDescription success`);//4
        })
        .catch(() => {
            console.log(`fPeerConnection.setRemoteDescription fail`);
        });

        this.remoteConnection.createAnswer()
        .then((description) => {
            console.log(`remotePeerConnection setLocalDescription start.`);//3
            this.remoteConnection.setLocalDescription(description)
            .then(() => {
                console.log(`fPeerConnection.setLocalDescription success`);//6
            })
            .catch(() => {
                console.log(`fPeerConnection.setLocalDescription fail`);
            });

            this.props.videoRes({
                fromUid: this.props.uid,
                uid: this.props.to,
                answer: description,
            });
        })
        .catch((err) => {
            console.log(`fPeerConnection.createAnswer fail`);
            console.log(err);
        });
    }

    /**
     * navigator.mediaDevices.getUserMedia的polyfill版本
     * @param {Object} constraints
     * @return {Promise}
     */
    _getUserMedia(constraints) {
        if (!navigator.mediaDevices) {
            navigator.mediaDevices = {};
        }
        if (!navigator.mediaDevices.getUserMedia) {
            const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }
            return new Promise((resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
        return navigator.mediaDevices.getUserMedia(constraints);
    }

    _getRtcPeerConnection(video) {
        const pc = new RTCPeerConnection();
        pc.addEventListener('icecandidate', (event) => {
            const peerConnection = event.target;
            const iceCandidate = event.candidate;

            if (iceCandidate) {
                const newIceCandidate = new RTCIceCandidate(iceCandidate);
                this.props.iceCandidate({
                    fromUid: this.props.uid,
                    uid: this.props.to,
                    data: newIceCandidate,
                });
                // console.log('newIceCandidate');
                // console.log(newIceCandidate);
            }
        });
        pc.onaddstream = (obj) => {
            const { stream } = obj;
            if ('srcObject' in video) {
                video.srcObject = stream;
            } else if (window.URL) {
                video.src = window.URL.createObjectURL(stream);
            } else {
                video.src = stream;
            }
            video.onloadedmetadata = () => {
                video.play();
            }
        }
        pc.ontrack = pc.onaddstream;  // Firefox打算不用onaddstream了，不过暂时不管它
        // pc.addEventListener('icecandidate', this._handleConnection);
        return pc;
    }
}

const mapStateToProps = (state, ownProps) => ({
    uid: state.auth.uid,
    video: state.video,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    videoReq(data) {
        dispatch(socketActions.videoReq(data));
    },
    videoRes(data) {
        dispatch(socketActions.videoRes(data));
    },
    iceCandidate(data) {
        dispatch(socketActions.iceCandidateExchange(data));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Video);