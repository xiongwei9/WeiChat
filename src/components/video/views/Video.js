import React from 'react';
import { connect } from 'react-redux';

import { actions as socketActions } from '../../../lib/socketStoreEnhancer/';
import { view as modal } from '../../modal/';
import './video.scss';

const Toast = modal.Toast;

class Video extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showCacel: false,
            showVideo: false,
            isResponse: 'offer' in this.props.video,
        };

        this.connectionOption = {
            offerToReceiveVideo: 1,
            offerToReceiveAudio: 1,
            // iceServers: [{
            //     // url: 'stun:stun.l.google.com:19302',
            //     url: 'stun.xten.com',
            // }]
        }
        this.constraints = {
            audio: true,
            video: {
                width: {
                    min: 320,
                    max: 960,
                },
                height: {
                    min: 320,
                    max: 1280,
                },
                facingMode: 'user',
            },
        };

        this.onAccept = this.onAccept.bind(this);
        this.onReject = this.onReject.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this._showCacel = this._showCacel.bind(this);

        this._requestVideo = this._requestVideo.bind(this);
        this._responseVideo = this._responseVideo.bind(this);
        this._getUserMedia = this._getUserMedia.bind(this);
        this._addIceCandidate = this._addIceCandidate.bind(this);

    }
    
    // componentWillReceiveProps(nextProps) {
    //     const newIceCandidate = nextProps.video.icecandidate;
    //     if (newIceCandidate && this.props.video.icecandidate !== newIceCandidate) {
    //         console.log(`addIceCandidate newIceCandidate`);
    //         this.localConnection.addIceCandidate(new RTCIceCandidate(newIceCandidate));
    //     }
    // }

    onAccept() {
        // this._responseVideo();
        this.props.videoAccept({
            fromUid: this.props.uid,
            uid: this.props.to,
            ret: 0,
        });
        this.setState({
            showVideo: true,
        });
    }

    onReject() {
        this.props.videoAccept({
            fromUid: this.props.uid,
            uid: this.props.to,
            ret: -10000,
        });
        this.props.back();
    }

    onCancel() {
        this.props.back();
    }

    render() {
        let content = null;
        if (this.state.showVideo) {
            const myClass = (this.state.showCacel ? '' : 'none') + ' btns';
            content = (
                <React.Fragment>
                    <video className='local-video' muted ref={video => this.localVideo = video}></video>
                    <video className='remote-video' ref={video => this.remoteVideo = video} onClick={this._showCacel}></video>
                    <div className={myClass}>
                        <button className='cancel' onClick={this.onCancel}>挂断</button>
                    </div>
                </React.Fragment>
            );
        } else {
            if (this.state.isResponse) {
                content = (
                    <React.Fragment>
                        <h2>{this.props.video.uid}在呼叫你...</h2>
                        <div className='btns'>
                            <button className='accept' onClick={this.onAccept} type='button'>接受</button>
                            <button className='reject' onClick={this.onReject} type='button'>拒绝</button>
                        </div>
                    </React.Fragment>
                );
            } else {
                content = (
                    <React.Fragment>
                        <h2>正在呼叫{this.props.video.uid}...</h2>
                        <div className='btns'>
                            <button className='cancel' onClick={this.onCancel} type='button'>取消</button>
                        </div>
                    </React.Fragment>
                );
            }
        }
        return (
            <div className='video'>
                {content}
            </div>
        );
    }

    componentDidMount() {
        if (!this.state.isResponse) {
            // 发送方
            this.props.videoCall({
                fromUid: this.props.uid,
                uid: this.props.to,
            });
        }
        // if (!this.state.isResponse) {
        //     // 作为发送方
        //     console.log('_requestVideo');
        //     this._requestVideo();
        // } else {
        //     console.log('_responseVideo');
        //     this._responseVideo();
        // }
    }

    componentDidUpdate() {
        console.log(`------- componentDidUpdate start --------`);
        if (!this.state.isResponse) {
            this.ret = this.props.video.ret;
            this._addIceCandidate();
            if (this.ret === undefined && this.props.video.icecandidate.length <= 0) {
                return;
            }
            if (this.ret < 0) {
                Toast.info('对方不在线或拒绝了你');
                this.props.back();
            }
            if (this.ret === 0 && !this.initVideo) {
                this.setState({
                    showVideo: true,
                });
                console.log('_requestVideo');
                this._requestVideo();
                this.initVideo = true;
            }

            if (!this.remoteDescription && this.props.video.answer) {
                this.localConnection.setRemoteDescription(this.props.video.answer)
                .then(() => {
                    console.log(`localConnection.setRemoteDescription success`);
                })
                .catch(() => {
                    console.log(`localConnection.setRemoteDescription fail`);
                });
                this.remoteDescription = true;
            }
        } else {
            if (this.props.video.offer && !this.initVideo) {
                console.log('_responseVideo');
                this._responseVideo();
                this.initVideo = true;
            }
        }

        // console.log(`- addIceCandidate ${this.props.video.icecandidate.length}`);
        // if (this.props.video.icecandidate.length > 0) {
        //     for (let icecandidate of this.props.video.icecandidate) {
        //         const conn = this.localConnection ? this.localConnection : this.remoteConnection;
        //         if (!conn) {
        //             break;
        //         }
        //         conn.addIceCandidate(icecandidate)
        //         .then(() => {
        //             console.log(`addIceCandidate success`);//7 11
        //         }).catch((error) => {
        //             console.log(`addIceCandidate fail`);
        //             console.log(error);
        //         });
        //     }
        // }
        console.log(`------- componentDidUpdate end --------`);
    }

    _showCacel() {
        if (this.state.showCacel) {
            clearTimeout(this.state.showCacel);
        }
        let tmp = setTimeout(() => {
            this.setState({
                showCacel: false,
            });
        }, 1500);
        this.setState({
            showCacel: tmp,
        });
    }

    _requestVideo() {
        this._getUserMedia(this.constraints)
        .then((stream) => {
            this.localVideo.srcObject = stream;
            this.localVideo.play();
            this.mStream = stream;
            // this.localVideo.muted = true;
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
            this.localConnection.addEventListener('addstream', (event) => {
                console.log('add stream');
                const mediaStream = event.stream;
                this.remoteVideo.srcObject = mediaStream;
                this.remoteVideo.play();
                this.fStream = mediaStream;
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
        this._getUserMedia(this.constraints)
        .then((stream) => {

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
                console.log('added stream');
                const mediaStream = event.stream;
                this.remoteVideo.srcObject = mediaStream;
                this.remoteVideo.play();
                this.fStream = mediaStream;
            });

            this.localVideo.srcObject = stream;
            this.localVideo.play();
            this.remoteConnection.addStream(stream);
            // this.localVideo.muted = true;

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

            this._addIceCandidate();
        })
        .catch((error) => {
            Toast.info(`navigator.getUserMedia error: ${error}`);
            console.log('navigator.getUserMedia error: ', error);
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

    _addIceCandidate() {
        if (this.props.video.icecandidate.length > 0) {
            for (let icecandidate of this.props.video.icecandidate) {
                const conn = this.localConnection ? this.localConnection : this.remoteConnection;
                if (!conn) {
                    break;
                }
                conn.addIceCandidate(icecandidate)
                .then(() => {
                    console.log(`addIceCandidate success`);//7 11
                }).catch((error) => {
                    console.log(`addIceCandidate fail`);
                    console.log(error);
                });
            }
        }
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
    videoCall(data) {
        dispatch(socketActions.videoCall(data));
    },
    videoAccept(data) {
        dispatch(socketActions.videoAccept(data));
    },
    back() {
        dispatch(socketActions.videoDuel({
            fromUid: undefined,
            uid: undefined,
        }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Video);