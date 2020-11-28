import * as SDK from 'azure-devops-extension-sdk';
import axios from 'axios';

export async function LoadServiceNowAssets() {
    const inputs = SDK.getConfiguration().witInputs;
    const address = inputs.RestServiceAddress;
    const username = inputs.RestServiceUserName;
    const password = inputs.RestServicePassword;
    var params:any = {}
    if (inputs.RestCallParameters){
        try {
            params = JSON.parse(inputs.RestCallParameters);
        } catch(e) {
            //return error?
        }
    }

    var req = axios.create({
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        auth: {
            username: username,
            password: password
        }
    })
    return req.get(address,
        {
            params: params
        }
    );
}