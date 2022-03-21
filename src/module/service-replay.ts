import { requestCommand, Result } from './soap';
import { OnvifServiceBase, OnvifServiceBaseConfigs } from './service-base';

export class OnvifServiceReplay extends OnvifServiceBase {
    constructor(configs: OnvifServiceReplayConfigs) {
        const {xaddr, user, pass, timeDiff} = configs;
        super({xaddr, user, pass});
        this.timeDiff = timeDiff;
        this.namespaceAttrList = [
            'xmlns:trp="http://www.onvif.org/ver10/replay/wsdl"',
            'xmlns:tt="http://www.onvif.org/ver10/schema"'
        ];
    }


    /* ------------------------------------------------------------------
     * Method: getReplayUri(GetReplayUriParams): Promise<Result>
     * ---------------------------------------------------------------- */
    getReplayUri(params: GetReplayUriParams): Promise<Result> {
		let soapBody = '';
		soapBody += '<trp:GetReplayUri>';
		soapBody +=   '<trp:StreamSetup>';
		soapBody +=     '<tt:Stream>' + params['StreamSetup']['Stream'] + '</tt:Stream>';
		soapBody +=     '<tt:Transport>';
		soapBody +=       '<tt:Protocol>' + params['StreamSetup']['Transport']['Protocol'] + '</tt:Protocol>';
		soapBody +=     '</tt:Transport>';
		soapBody +=   '</trp:StreamSetup>';
		soapBody +=   '<trp:RecordingToken>' + params['RecordingToken'] + '</trp:RecordingToken>';
		soapBody += '</trp:GetReplayUri>';

        let soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetReplayUri', soap)
    }

}

/*
 * - params:
 *   - StreamSetup     | Object  | required | the connection parameters to be used for the stream
 *     - Stream        | String  | required | either RTP-Unicast, RTP-Multicast
 *     - Transport     | Object  | required |
 *       - Protocol    | String  | required | either UDP, TCP, RTSP, HTTP
 *       - Tunnel      | Object  | optional | TODO not implemented
 *   - RecordingToken  | String  | required | identifier of the recording to be streamed
*/

export interface GetReplayUriParams {
    StreamSetup: {
        Stream: "RTP-Unicast" | "RTP-Multicast",
        Transport:{
            Protocol: "UDP" | "TCP" | "RTSP" | "HTTP",
            Tunnel?: any
        }
    } ,
    RecordingToken: string
}


export interface OnvifServiceReplayConfigs extends OnvifServiceBaseConfigs {
    timeDiff: number;
}