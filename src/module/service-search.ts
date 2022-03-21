import { requestCommand, Result } from './soap';
import { OnvifServiceBase, OnvifServiceBaseConfigs } from './service-base';

export class OnvifServiceSearch extends OnvifServiceBase {
    constructor(configs: OnvifServiceSearchConfigs) {
        const {xaddr, user, pass, timeDiff} = configs;
        super({xaddr, user, pass});
        this.timeDiff = timeDiff;
        this.namespaceAttrList = [
            'xmlns:tse="http://www.onvif.org/ver10/search/wsdl"',
            'xmlns:tt="http://www.onvif.org/ver10/schema"'
        ];
    }


    /* ------------------------------------------------------------------
     * Method: findRecordings(params: FindRecordingsParams): Promise<Result>
     * ---------------------------------------------------------------- */
    findRecordings(params: FindRecordingsParams): Promise<Result> {
        const IncludedSources = params['Scope']['IncludedSources'];
        const IncludedRecordings = params['Scope']['IncludedRecordings'];

        let soapBody = '';
        soapBody += '<tse:FindRecordings>';
        soapBody += '<tse:Scope>';

        if (IncludedSources && Array.isArray(IncludedSources)) {
            IncludedSources.forEach((o) => {
                soapBody += '<tt:IncludedSources Type="http://www.onvif.org/ver10/schema/Receiver">';
                soapBody += '<tt:Token>' + o['Token'] + '</tt:Token>';
                if (o['Type']) {
                    soapBody += '<tt:Type>' + o['Type'] + '</tt:Type>';
                }
                soapBody += '</tt:IncludedSources>';
            })
        }
        
        if (IncludedRecordings && Array.isArray(IncludedRecordings)) {
            IncludedRecordings.forEach((s) => {
                soapBody += '<tt:IncludedRecordings>' + s + '</tt:IncludedRecordings>';
            })
        }

        if (params['Scope']['RecordingInformationFilter']) {
            soapBody += '<tt:RecordingInformationFilter>' + params['Scope']['RecordingInformationFilter'] + '</tt:RecordingInformationFilter>';
        }
        if (params['Scope']['Extension']) {
            soapBody += '<tt:Extension>' + params['Scope']['Extension'] + '</tt:Extension>';
        }
        soapBody += '</tse:Scope>';

        if (params['MaxMatches']) {
            soapBody += '<tse:MaxMatches>' + params['MaxMatches'] + '</tse:MaxMatches>';
        }

        soapBody += '<tse:KeepAliveTime>PT' + params['KeepAliveTime'] + 'S</tse:KeepAliveTime>';
        soapBody += '</tse:FindRecordings>';

        let soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'FindRecordings', soap)
    }

    /* ------------------------------------------------------------------
     * Method: getRecordingSummary(): Promise<Result>
     * ---------------------------------------------------------------- */
    getRecordingSummary(): Promise<Result> {
        let soapBody = '<tse:GetRecordingSummary/>';
        let soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetRecordingSummary', soap);
    }


    /* ------------------------------------------------------------------
     * Method: getRecordingSearchResults(params: GetRecordingSearchResultsParams): Promise<Result>
     * ---------------------------------------------------------------- */
    getRecordingSearchResults(params: GetRecordingSearchResultsParams): Promise<Result> {
        let soapBody = '';
        soapBody += '<tse:GetRecordingSearchResults>';
        soapBody += '<tse:SearchToken>' + params['SearchToken'] + '</tse:SearchToken>';
        if (params['MinResults']) {
            soapBody += '<tse:MinResults>' + params['MinResults'] + '</tse:MinResults>';
        }
        if (params['MaxResults']) {
            soapBody += '<tse:MaxResults>' + params['MaxResults'] + '</tse:MaxResults>';
        }
        if (params['WaitTime']) {
            soapBody += '<tse:WaitTime>PT' + params['WaitTime'] + 'S</tse:WaitTime>';
        }
        soapBody += '</tse:GetRecordingSearchResults>';
        let soap = this.createRequestSoap(soapBody);
        return requestCommand(this.oxaddr, 'GetRecordingSearchResults', soap)
    }

}

/*
 * - params:
 *   - Scope                        | Object  | required | scope defines the dataset to consider for this search
 *     - IncludedSources            | Array   | optional | a list of sources that are included in the scope
 *       - Type                     | String  | optional |
 *       - Token                    | String  | required |
 *     - IncludedRecordings         | Array   | optional | a list of recordings that are included in the scope
 *     - RecordingInformationFilter | String  | optional | an xpath expression used to specify what recordings to search
 *     - Extension                  | String  | optional | extension point
 *   - MaxMatches                   | Integer | optional | the search will be completed after this many matches
 *   - KeepAliveTime                | Integer | required | the time the search session will be kept alive after responding to this and subsequent requests
 *
*/

export interface FindRecordingsParams {
    Scope: {
        IncludedSources?: Array<{
            Type?: string,
            Token: string
        }>,
        IncludedRecordings?: Array<string>,
        RecordingInformationFilter?: string,
        Extension?: string
    },
    MaxMatches?: number,
    KeepAliveTime: number
}


/*
 * - params:
 *   - SearchToken    | String  | required | the search session to get results from
 *   - MinResults     | Integer | optional | the minimum number of results to return in one response
 *   - MaxResults     | Integer | optional | the maximum number of results to return in one response
 *   - WaitTime       | Integer | optional | the maximum time before responding to the request
 *
*/

export interface GetRecordingSearchResultsParams {
    SearchToken: string,
    MinResults?: number,
    MaxResults?: number,
    WaitTime?: number,
}


export interface OnvifServiceSearchConfigs extends OnvifServiceBaseConfigs {
    timeDiff: number;
}