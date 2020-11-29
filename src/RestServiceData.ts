import * as SDK from 'azure-devops-extension-sdk';
import { WorkItemTrackingServiceIds, IWorkItemFormService } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import { LoadDataFromService } from './rest-call';
import get from 'lodash/get'; 

export class RestServiceData {

  public data = [];

  public async getSuggestedValues(): Promise<string[]> {
    const resp = await LoadDataFromService();
    const keyFieldName = SDK.getConfiguration().witInputs.RestServiceKeyField;
    const arrayPath = SDK.getConfiguration().witInputs.PathToArray;
    
    var arrayData = get(resp, arrayPath);
    if (arrayData) {
      this.data = arrayData;
      var a = arrayData.map((a: any) => a[keyFieldName]);
      return [...new Set<string>(a.sort())];
    }
    else {
      // if the values input were not specified as an input, get the suggested values for the field.
      const service = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
      return await service.getAllowedFieldValues(SDK.getConfiguration().witInputs.FieldName) as string[];
    }
  }
}