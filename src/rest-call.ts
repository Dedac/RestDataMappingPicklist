import * as SDK from 'azure-devops-extension-sdk';
import axios from 'axios';
import { ReplaceFieldParameters } from './parameter-replacement';

export async function LoadDataFromService() {
    const inputs = SDK.getConfiguration().witInputs;
    const address = inputs.RestServiceAddress;
    const username = inputs.RestServiceUserName;
    const password = inputs.RestServicePassword;
    
    var params: any = {}
    if (inputs.RestCallParameters) {
        try {
            params = JSON.parse(await ReplaceFieldParameters(inputs.RestCallParameters));            
        } catch (err) {
            console.log(err);
            return;
        }
    }

    var reqConfig = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (username || password) {
        if (username == "Bearer" || username == "bearer")
            reqConfig.headers["Authorization"] = username + " " + password;
        else
            reqConfig['auth'] = { username: username, password: password };
    }

    var req = axios.create(reqConfig);
    return req.get(address,
        {
            params: params
        }
    ).catch(err => {
        console.log(err);
        throw err;
    });
}