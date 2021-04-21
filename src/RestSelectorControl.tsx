import * as React from "react";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Observer } from "azure-devops-ui/Observer";
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { FormItem } from "azure-devops-ui/FormItem";
import { getConfiguration } from 'azure-devops-extension-sdk';

const inputField = React.createRef<HTMLTextAreaElement & HTMLInputElement>();
const optionsObservable = new ObservableValue<Array<string>>([]);
const errorObservable = new ObservableValue<boolean>(false);

export interface ISelectorProps {
    selected: ObservableValue<string>;
    options: Promise<string[]>;
    fieldName: string;
    placeholder:string;
    message: ObservableValue<string>;
}

export class RestSelectorControl extends React.Component<ISelectorProps> {
    constructor(props : ISelectorProps) {
        super(props);
        this.state = { focused: false, value: "" };
        
        this.props.options.then(o => optionsObservable.value = o);

        optionsObservable.subscribe(() => {
            this.dataLoaded.value = true;
        });

        this.props.message.subscribe(m => {
            errorObservable.value = !!m
        });
    }

    private dataLoaded = new ObservableValue<boolean>(false);

    componentDidMount() {
        inputField.current.setAttribute("list", "datalist-"+this.props.fieldName);
    }

    public render() {
        let labelVar = '';
            if (!getConfiguration().witInputs.HideFieldLabel) {
              labelVar = this.props.fieldName;
            }
        return <FormItem label={labelVar} className="work-item-label" message={this.props.message} error={errorObservable}>
            <div className="flex-row" style={{ width:"100%" }}>
                <TextField
                    value={this.props.selected}
                    onChange={(e, newValue) => (this.props.selected.value = newValue)}
                    placeholder={this.props.placeholder}
                    width={TextFieldWidth.standard}
                    autoComplete={true}
                    inputElement={inputField}                                        
                />
                <ConditionalChildren inverse={true} renderChildren={this.dataLoaded}>
                    <div style={{ marginLeft: "1em" }} />
                    <Spinner size={SpinnerSize.large} />
                </ConditionalChildren>
                <datalist id={"datalist-"+this.props.fieldName}>
                    <Observer options={optionsObservable}>
                        {(props: { options: string[] }) => {
                            return props.options.map(function (item) {
                                return <option key={item} value={item}>{item}</option>
                            })
                        }}
                    </Observer>
                </datalist>
            </div>
        </FormItem>
    }
}