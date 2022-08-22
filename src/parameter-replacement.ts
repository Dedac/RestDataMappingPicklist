import * as SDK from 'azure-devops-extension-sdk';
import { IWorkItemFormService, WorkItemTrackingServiceIds } from 'azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices';

export async function ReplaceFieldParameters(hasFields:string) : Promise<string> {
    const service = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
    var index = hasFields.indexOf("$(");
    while (index > -1) {
        var endIndex = hasFields.indexOf(")", index);
        if (endIndex < index) break;
        var replaceMe = hasFields.substring(index, endIndex + 1);
        var fieldName = replaceMe.replace('$(', '').replace(')', '').trim();
        var value = await service.getFieldValue(fieldName, { returnOriginalValue: false });
        if (!!value && !!value.toString()) {
            var escapedValue = JSON.stringify(value);
            // remove outer quotes from the escaped value if they exist
            // this assumes the user has added quotes of their own in the configuration
            if (escapedValue.startsWith('"') && escapedValue.endsWith('"')) {
                escapedValue = escapedValue.substring(1, escapedValue.length - 1);
            }

            hasFields = hasFields.replace(replaceMe, escapedValue);
        } else  {
            hasFields = hasFields.replace(replaceMe, "");
        }
        index = hasFields.indexOf("$(");
    }  
    return hasFields;
}