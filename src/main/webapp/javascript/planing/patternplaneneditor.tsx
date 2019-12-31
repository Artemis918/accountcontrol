import * as React from 'react'
import { DropdownService } from '../utils/dropdownservice'
import { PatternEditor } from './patterneditor'
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { CategorySelector } from '../utils/categoryselector'
import { Plan, Pattern } from '../utils/dtos'
import 'react-day-picker/lib/style.css'

type OnChangeCallback = () => void;

interface PlanEditorProps {
    onChange: OnChangeCallback;
}

interface IState {
    plan: Plan;
    message: string;
    patternEdit: boolean;
}

export class PatternPlanEditor extends React.Component<PlanEditorProps, IState> {

    plan: Plan;

    constructor( props: PlanEditorProps ) {
        super( props );
        this.plan = new Plan();
        this.state = { plan: this.plan, message: '', patternEdit: false };
        this.clear = this.clear.bind( this );
        this.save = this.save.bind( this );
        this.delete = this.delete.bind( this );
        this.copy = this.copy.bind( this );
        this.setAnswer = this.setAnswer.bind( this );
        this.setPlan = this.setPlan.bind( this );
    }

    resetEditor(): void {
        this.plan = new Plan();
        this.setState( { plan: this.plan } );
    }

    setPlan( plan: Plan ) {
        if ( plan == undefined ) {
            this.resetEditor();
        }
        else {
            this.plan = plan;
            this.setState( { plan: this.plan } );
        }
    }

    save() {
        var self = this;
        var jsonbody = JSON.stringify( self.state.plan );
        fetch( '/plans/savePattern', {
            method: 'post',
            body: jsonbody,
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function( response ) {
            self.setAnswer( response.json() );
        } );
    }

    setAnswer( data: any ): void {
        this.setState( { message: data.message } );
        if ( !data.error ) {
            this.clear();
        }
        this.props.onChange();
    }

    clear(): void {
        this.props.onChange();
        this.resetEditor();
    }

    delete(): void {
        if ( this.state.plan.id !== undefined ) {
            var self = this;
            fetch( '/plans/delete/' + this.state.plan.id, { method: 'get' } )
                .then( function( response ) { self.setAnswer( response.json() ); } );
        }
    }

    copy(): void {
        this.plan.id = undefined;
        this.plan.shortdescription = "copy of " + this.state.plan.shortdescription;
        this.setState( { plan: this.plan } );
        this.props.onChange();
    }

    setPlanState(): void {
        this.setState( { plan: this.plan, message: '' } );
    }

    setSubCategory( subcategory: number, category: number ): void {
        this.plan.category = category;
        this.plan.subcategory = subcategory;
        this.setState( { plan: this.plan, message: '' } );
    }

    renderButton(): JSX.Element {
        return (
            <div>
                <button onClick={this.save}>Save</button>
                <button onClick={this.clear}>New</button>
                <button onClick={this.copy}>Copy</button>
                <button onClick={this.delete}>Del</button>
            </div>
        );
    }

    render(): JSX.Element {
        return (
            <div>
                <label>{this.state.message}</label>
                <table>
                    <tbody style={{ verticalAlign: 'top' }} >
                        <tr style={{ background: 'darkgray' }}>
                            <td>Name</td>
                            <td><input value={this.state.plan.shortdescription} type='text'
                                onChange={( e ) => { this.plan.shortdescription = e.target.value; this.setPlanState() }} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>Position</td>
                            <td><input value={this.state.plan.position}
                                type='number'
                                onChange={( e ) => { this.plan.position = e.target.valueAsNumber; this.setPlanState() }} />
                            </td>
                        </tr>
                        <tr>
                            <td>Kategorie</td>
                            <td><CategorySelector
                                onChange={( s, c ) => this.setSubCategory( s, c )}
                                subcategory={this.state.plan.subcategory}
                                category={this.state.plan.category} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>Beschreibung</td>
                            <td><textarea cols={20} rows={3}
                                value={this.state.plan.description}
                                onChange={( e ) => { this.plan.description = e.target.value; this.setPlanState() }} />
                            </td>
                        </tr>
                        <tr>
                            <td>Pattern</td>
                            <td><button onClick={() => this.setState( { patternEdit: true } )}>Editieren</button></td>
                        </tr>
                    </tbody>
                </table>
                <p />
                {this.renderButton()}
                {this.state.patternEdit ?
                    <PatternEditor
                        pattern={this.state.plan.patterndto}
                        sendPattern={( e ) => { this.plan.patterndto = e; this.setState( { patternEdit: false, plan: this.plan, message: "" } ) }}
                    />
                    : null
                }
            </div >
        );
    }
}