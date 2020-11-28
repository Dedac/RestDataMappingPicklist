import * as SDK from 'azure-devops-extension-sdk';
import { WorkItemTrackingServiceIds, IWorkItemFormService } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import { LoadServiceNowAssets } from './rest-call';

export class RestServiceData {

  public data = [];

  public async getSuggestedValues(): Promise<string[]> {
    const resp = await LoadServiceNowAssets();
    const keyFieldName = SDK.getConfiguration().witInputs.RestServiceKeyField;

    if (resp.data.result) {
      this.data = resp.data.result;
      var a = resp.data.result.map((a: any) => a[keyFieldName]);
      return [...new Set<string>(a.sort())];
    }
    else {
      // if the values input were not specified as an input, get the suggested values for the field.
      const service = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
      return await service.getAllowedFieldValues(SDK.getConfiguration().witInputs.FieldName) as string[];
    }
  }
}