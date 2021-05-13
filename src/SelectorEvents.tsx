import * as React from "react";
import * as ReactDOM from "react-dom";
import * as SDK from 'azure-devops-extension-sdk';
import { IWorkItemFormService, WorkItemTrackingServiceIds, IWorkItemLoadedArgs, IWorkItemFieldChangedArgs } from "azure-devops-extension-api/WorkItemTracking/WorkItemTrackingServices";

import { RestSelectorControl } from "./RestSelectorControl";
import { RestServiceData } from "./RestServiceData";
import { ObservableValue } from "azure-devops-ui/Core/Observable";

export class SelectorEvents {
    public readonly fieldName = SDK.getConfiguration().witInputs.FieldName;
    public readonly keyFieldName = SDK.getConfiguration().witInputs.RestServiceKeyField;

    private readonly _container = document.getElementById("container") as HTMLElement;
    private readonly valueObservable = new ObservableValue<string>("");
    private readonly messageObservable = new ObservableValue<string>("");
    private updatedViaSet = 0;
    private fieldMap = null;
    private serviceData: RestServiceData = new RestServiceData();

    public async refresh(selected?: string): Promise<void> {
        const formService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
        let fields = await formService.getFields();
        let friendlyName = fields.find((f) => f.referenceName == this.fieldName).name
        this.valueObservable.value = await this._getSelected();
        
        let fieldMapString = SDK.getConfiguration().witInputs.FieldMap;
        if (fieldMapString) {
            try {
                this.fieldMap = JSON.parse(fieldMapString);
            }
            catch (e) {
                console.info("Error parsing the field map " + e);
                //we dont' have to do anything if the map isn't valid json
                this.fieldMap = null;
            }
        }
        this.valueObservable.subscribe((value) => this._setSelected(value));

        ReactDOM.render(<RestSelectorControl
            fieldName={friendlyName}
            selected={this.valueObservable}
            options={this.serviceData.getSuggestedValues()}
            placeholder="Select"
            message={this.messageObservable}
        />, this._container);
    }

    private async _getSelected(): Promise<string> {
        const formService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);

        const value = await formService.getFieldValue(this.fieldName, { returnOriginalValue: false });
        if (typeof value !== "string") {
            return;
        }
        return value;
    }

    private _setSelected = async (value: string): Promise<void> => {
        this.updatedViaSet++;
        const formService = await SDK.getService<IWorkItemFormService>(WorkItemTrackingServiceIds.WorkItemFormService);
        await formService.setFieldValue(this.fieldName, value);

        let restDataRow = this.serviceData.data.find(e => e[this.keyFieldName] == value);

        if (!restDataRow) {
            this.messageObservable.value = SDK.getConfiguration().witInputs.ErrorMessage || "Value not Found";
        } else {
            this.messageObservable.value = "";
            if (this.fieldMap) {
                for (const [key, mapValue] of Object.entries(this.fieldMap)) {
                    if (restDataRow)
                        await formService.setFieldValue(key, restDataRow[mapValue + ""]);
                }
            }
        }
    }

    public async update() {
        this.updatedViaSet--;
        if (this.updatedViaSet < 1)
            this.valueObservable.value = await this._getSelected();
    }
}