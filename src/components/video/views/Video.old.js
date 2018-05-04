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
            showVideo: this.props.video.fromUid === this.props.uid,
        }

        this.connectionOption = {
            // offerToReceiveVideo: 1,
            iceServers: [{
                // url: 'stun:stun.l.google.com:19302',
                url: 'stun.xten.com',
            }]
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
    
    componentWillReceiveProps(nextProps) {
        const newIceCandidate = nextProps.video.icecandidate;
        if (newIceCandidate && this.props.video.icecandidate !== newIceCandidate) {
            console.log(`addIceCandidate newIceCandidate`);
            this.localConnection.addIceCandidate(new RTCIceCandidate(newIceCandidate));
        }
    }

    onAcceptClick() {
        this._responseVideo();
    }

    render() {
        let content = null;
        if (!this.state.showVideo) {
            content = (
                <button type='button' onClick={this.onAcceptClick}>接受</button>
            );
        };
        return (
            <div className='video'>
                <video ref={video => this.localVideo = video}></video>
                <video ref={video => this.remoteVideo = video}></video>
                {content}
            </div>
        );
    }

    componentDidMount() {
        if (this.props.video.fromUid === this.props.uid) {
            // 作为发送方
            console.log('_requestVideo');
            this._requestVideo();
        }
    }

    componentDidUpdate() {
        // 作为视频请求方，收到远程的响应answer时
        if (!('answer' in this.props.video) || this.props.video.answer === undefined || this.props.video.uid === this.props.uid) {
            return;
        }
        if (!this.props.video.answer) {
            // 对方拒绝视频
            Toast.info('对方拒绝视频');
            return;
        }
        this.localConnection.setRemoteDescription(this.props.video.answer)
        .then(() => {
            console.log(`localConnection.setRemoteDescription success`);
        })
        .catch(() => {
            console.log(`localConnection.setRemoteDescription fail`);
        })
    }

    /**
     * 视频通话请求发送前的初始化
     */
    _requestVideo() {
        // 打开摄像头
        this._getUserMedia(this.constraints)
        .then((stream) => {
            // 实例化RTC连接
            this.localConnection = this._getRtcPeerConnection(this.localVideo);
            // 把摄像头的视频数据流加载到localVideo
            this.localConnection.onaddstream({ stream });
            // 打印摄像头数据流所占用的设备
            this.localVideoTracks = stream.getVideoTracks();
            this.localAudioTracks = stream.getAudioTracks();
            if (this.localVideoTracks.length > 0) {
                console.log(`using video device: ${this.localVideoTracks[0].label}`);
            }
            if (this.localAudioTracks.length > 0) {
                console.log(`using audio device: ${this.localAudioTracks[0].label}`);
            }
            // 把视频的数据流添加到RTC连接中
            this.localConnection.addStream(stream);
            // 创建offer
            this.localConnection.createOffer(this.connectionOption)
            .then((offer) => {
                console.log(`localPeerConnection.createOffer success.`);
                console.log(`localPeerConnection.setLocalDescription start.`);
                // 保存本地的offer
                this.localConnection.setLocalDescription(offer)
                .then(() => {
                    //  发送offer给远程
                    this.props.videoReq({
                        fromUid: this.props.video.fromUid,
                        uid: this.props.video.uid,
                        offer,
                    });
                })
                .catch(() => {
                    console.log(`localPeerConnection.setLocalDescription fail`);
                });
            })
            .catch(() => {
                console.log(`localPeerConnection.createOffer fail`);
            });
        })
        .catch((error) => {
            Toast.info(`navigator.getUserMedia error: ${error}`);
            console.log('navigator.getUserMedia error: ', error);
        });
    }

    _responseVideo() {
        
    }

    /**
     * 视频通话请求接收方对RTC连接的处理
     */
    _responseVideo2() {
        // 打开摄像头
        this._getUserMedia(this.constraints)
        .then((stream) => {
            // 实例化RTC连接
            this.localConnection = this._getRtcPeerConnection(this.localVideo);
            this.localConnection.addEventListener('addstream', (event) => {
                const mediaStream = event.stream;
                this.remoteVideo.srcObject = mediaStream;
                console.log(`Remote peer connection received remote stream.`);
            });
            // 把摄像头的视频数据流加载到localVideo
            this.localConnection.onaddstream({ stream });
            // 打印摄像头数据流所占用的设备
            this.localVideoTracks = stream.getVideoTracks();
            this.localAudioTracks = stream.getAudioTracks();
            if (this.localVideoTracks.length > 0) {
                console.log(`using video device: ${this.localVideoTracks[0].label}`);
            }
            if (this.localAudioTracks.length > 0) {
                console.log(`using audio device: ${this.localAudioTracks[0].label}`);
            }
            // 把视频的数据流添加到RTC连接中
            this.localConnection.addStream(stream);
            // 保存请求方的offer配置
            this.localConnection.setRemoteDescription(this.props.video.offer)
            .then(() => {
                console.log(`localConnection.setRemoteDescription success`);
            })
            .catch(() => {
                console.log(`localConnection.setRemoteDescription fail`);
            });
            // 创建answer
            this.localConnection.createAnswer(this.connectionOption)
            .then((answer) => {
                console.log(`localPeerConnection.createAnswer success.`);
                console.log(`localPeerConnection.setLocalDescription start.`);

                //  发送answer给请求方
                // this.props.videoRes({
                //     fromUid: this.props.video.fromUid,
                //     uid: this.props.video.uid,
                //     answer,
                // });
                // 保存本地的offer
                this.localConnection.setLocalDescription(answer)
                .then(() => {
                    //  发送answer给请求方
                    this.props.videoRes({
                        fromUid: this.props.video.fromUid,
                        uid: this.props.video.uid,
                        answer,
                    });
                })
                .catch(() => {
                    console.log(`localPeerConnection.setLocalDescription fail`);
                });
            })
            .catch(() => {
                console.log(`localPeerConnection.createAnswer fail`);
            });
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