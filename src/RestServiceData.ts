import * as SDK from 'azure-devops-extension-sdk';
import { WorkItemTrackingServiceIds, IWorkItemFormService } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import { LoadDataFromService } from './rest-call';
import get from 'lodash/get';
import { AxiosResponse } from 'axios';

export class RestServiceData {

  public data = [];

  public async getSuggestedValues(): Promise<string[]> {
    var resp: AxiosResponse<any>;
    try {
      resp = await LoadDataFromService();
    } catch (error) {
      return Promise.resolve([]);
    }
    const keyFieldName = SDK.getConfiguration().witInputs.RestServiceKeyField;
    const arrayPath = SDK.getConfiguration().witInputs.PathToArray;

    var arrayData = get(resp.data, arrayPath, resp.data);

    if (arrayData) {
      this.data = arrayData;
      var fieldSet = arrayData.map((a: any) => a[keyFieldName]);
      return [...new Set<string>(fieldSet.sort())];
    }
    else {
      // if the values input were not specified as an input, get the suggested values for the field.
      const service = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
      return await service.getAllowedFieldValues(SDK.getConfiguration().witInputs.FieldName) as string[];
    }
  }
}