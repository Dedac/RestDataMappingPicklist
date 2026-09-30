import * as React from "react";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Observer } from "azure-devops-ui/Observer";
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { FormItem } from "azure-devops-ui/FormItem";
import { getConfiguration } from "azure-devops-extension-sdk";

const optionsObservable = new ObservableValue<Array<string>>([]);
const errorObservable = new ObservableValue<boolean>(false);

export interface ISelectorProps {
    selected: ObservableValue<string>;
    options: Promise<string[]>;
    fieldName: string;
    placeholder: string;
    message: ObservableValue<string>;
}

function getFieldElementId(prefix: string, fieldName: string): string {
    const safeFieldName = fieldName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, "-")
        .replace(/^-+|-+$/g, "") || "field";
    let fieldNameHash = 0;

    for (let index = 0; index < fieldName.length; index++) {
        fieldNameHash = (Math.imul(31, fieldNameHash) + fieldName.charCodeAt(index)) | 0;
    }

    return `${prefix}-${safeFieldName}-${(fieldNameHash >>> 0).toString(36)}`;
}

export class RestSelectorControl extends React.Component<ISelectorProps> {
    private inputField = React.createRef<HTMLTextAreaElement & HTMLInputElement>();
    private dataLoaded = new ObservableValue<boolean>(false);

    constructor(props: ISelectorProps) {
        super(props);
        this.state = { focused: false, value: "" };

        this.props.options.then(o => optionsObservable.value = o);

        optionsObservable.subscribe(() => {
            this.dataLoaded.value = true;
        });

        this.props.message.subscribe(m => {
            errorObservable.value = !!m;
        });
    }

    componentDidMount() {
        this.updateInputList();
    }

    componentDidUpdate(previousProps: ISelectorProps) {
        if (previousProps.fieldName !== this.props.fieldName) {
            this.updateInputList();
        }
    }

    private getInputId(): string {
        return getFieldElementId("rest-selector-input", this.props.fieldName);
    }

    private getDatalistId(): string {
        return getFieldElementId("rest-selector-options", this.props.fieldName);
    }

    private updateInputList(): void {
        this.inputField.current?.setAttribute("list", this.getDatalistId());
    }

    public render() {
        const label = getConfiguration().witInputs.HideFieldLabel ? undefined : this.props.fieldName;
        const ariaLabel = label ? undefined : this.props.fieldName;
        const datalistId = this.getDatalistId();

        return <FormItem className="work-item-label" message={this.props.message} error={errorObservable}>
            <div className="flex-row" style={{ width: "100%" }}>
                <TextField
                    value={this.props.selected}
                    onChange={(e, newValue) => (this.props.selected.value = newValue)}
                    placeholder={this.props.placeholder}
                    width={TextFieldWidth.standard}
                    autoComplete={true}
                    inputElement={this.inputField}
                    inputId={this.getInputId()}
                    label={label}
                    ariaLabel={ariaLabel}
                />
                <ConditionalChildren inverse={true} renderChildren={this.dataLoaded}>
                    <div style={{ marginLeft: "1em" }} />
                    <Spinner size={SpinnerSize.large} />
                </ConditionalChildren>
                <datalist id={datalistId}>
                    <Observer options={optionsObservable}>
                        {(props: { options: string[] }) => {
                            return props.options.map(function (item) {
                                return <option key={item} value={item}>{item}</option>;
                            });
                        }}
                    </Observer>
                </datalist>
            </div>
        </FormItem>;
    }
}