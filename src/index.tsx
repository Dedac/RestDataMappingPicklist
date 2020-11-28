import * as SDK from 'azure-devops-extension-sdk';
import {
  IWorkItemLoadedArgs,
  IWorkItemFieldChangedArgs,
} from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";
import { SelectorEvents } from "./SelectorEvents";

SDK.init({
  applyTheme: true,
  loaded: false,
});

const provider = () => {
  let control: SelectorEvents;

  return {
    onLoaded: (args: IWorkItemLoadedArgs) => {
      if (!control) {
        control = new SelectorEvents();
      }
      control.refresh();
    },
    onFieldChanged: (args: IWorkItemFieldChangedArgs) => {
      if (control && args.changedFields[control.fieldName] !== undefined &&
        args.changedFields[control.fieldName] !== null
      ) {
        control.update();
      }
    },
  };
};

SDK.ready().then(() => {
  SDK.register(SDK.getContributionId(), provider);
  SDK.notifyLoadSucceeded();
});