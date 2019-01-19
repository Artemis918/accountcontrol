import * as React from 'react'
import { DropdownService } from '../utils/dropdownservice'
import { PatternEditor, Pattern} from './patterneditor'
import { KSDayPickerInput } from '../utils/KSDayPickerInput'
import { KontenSelector } from '../konten/kontenselector'

import 'react-day-picker/lib/style.css'

type OnChangeCallback = ()=>void;

export interface Plan {
    id: number,
    startdate: Date,
    plandate: Date,
    enddate: Date,
    position: number,
    description: string,
    shortdescription: string,
    kontogroup: number,
    konto: number,
    wert: number,
    patterndto: Pattern,
    matchstyle: number,
}

interface PlanEditorProps {
    onChange: OnChangeCallback;
}

interface IState {
    plan: Plan;
    message: string;
    patternEdit: boolean;
}

export default class PlanEditor extends React.Component<PlanEditorProps,IState> {
    
    plan: Plan;

    constructor( props: PlanEditorProps ) {
        super( props );
        this.plan = this.createNewPlan();
        this.state = { plan: this.plan , message: '', patternEdit: false };
        this.clear = this.clear.bind( this );
        this.delete = this.delete.bind( this );
        this.copy = this.copy.bind( this );
        this.setAnswer = this.setAnswer.bind( this );
        this.setPlan = this.setPlan.bind( this );
    }

    resetEditor() : void {
        this.plan = this.createNewPlan();
        this.setState( { plan: this.plan } );
    }

    setPlan( id: number ) :void {
        if ( id == undefined ) {
            this.resetEditor();
        }
        else {
            var self = this;
            fetch( 'http://localhost:8080/plans/id/' + id )
                .then( response => response.json() )
                .then( p => { self.plan = p; self.setState( { plan: self.plan } ) } );
        }
    }

    createNewPlan() : Plan {
        var date = new Date();
        return {
            id: undefined,
            startdate: date,
            plandate: date,
            enddate: date,
            position: 0,
            description: 'Neuer Plan',
            shortdescription: 'neu',
            kontogroup: 1,
            konto: 1,
            wert: 0,
            patterndto: {
                sender: '',
                senderID: '',
                receiver: '',
                referenceID: '',
                details: '',
                mandat: '',
            },
            matchstyle: 0,
        }
    }

    save() {
        var self = this;
        var jsonbody = JSON.stringify( self.state.plan );
        fetch( '/plans/save', {
            method: 'post',
            body: jsonbody,
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function( response ) {
            self.setAnswer( response.json() );
        } );
    }

    setAnswer( data: any ) :void {
        this.setState( { message: data.message } );
        if ( !data.error ) {
            this.clear();
        }
    }

    clear() : void {
        this.props.onChange();
        this.resetEditor();
    }

    delete() :void {
        if ( this.state.plan.id !== undefined ) {
            var self = this;
            fetch( '/plans/delete/' + this.state.plan.id, { method: 'get' } )
                .then( function( response ) { self.setAnswer( response.json() ); } );
        }
    }

    copy() :void {
        this.plan.id = undefined;
        this.plan.shortdescription = "copy of " + this.state.plan.shortdescription;
        this.setState( { plan: this.plan } );
        this.props.onChange();
    }

    setPlanState() : void {
        this.setState( { plan: this.plan, message: '' } );
    }

    setKonto( konto: number, group: number ) :void {
        this.plan.kontogroup = group;
        this.plan.konto = konto;
        this.setState( { plan: this.plan, message: '' } );
    }

    renderButton(): JSX.Element {
        return (
            <div>
                <button onClick={this.save.bind( this )}>Save</button>
                <button onClick={this.clear}>New</button>
                <button onClick={this.copy}>Copy</button>
                <button onClick={this.delete}>Del</button>
            </div>
        );
    }


    render() :JSX.Element{
        const FORMAT = "dd.MM.YYYY";

        return (
            <div>
                <label>{this.state.message}</label>
                <table>
                    <tbody style={{ verticalAlign: 'top' }} >
                        <tr style={{ background: 'darkgray' }}>
                            <td>Name</td>
                            <td><input value={this.state.plan.shortdescription} type='text'
                                       onChange={( e ) =>  {this.plan.shortdescription=e.target.value; this.setPlanState()} } />
                            </td>
                        </tr>
                        <tr>
                            <td>Stardatum</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => {this.plan.startdate = d; this.setPlanState()}}
                                startdate={this.state.plan.startdate} /></td>

                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>Plandatum</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => {this.plan.plandate = d; this.setPlanState()}}
                                startdate={this.state.plan.plandate} /></td>
                        </tr>
                        <tr> <td>Enddatum</td>
                            <td><KSDayPickerInput
                                onChange={( d ) => {this.plan.enddate = d; this.setPlanState()}}
                                startdate={this.state.plan.enddate} /></td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>Position</td>
                            <td><input value={this.state.plan.position}
                                type='number'
                                onChange={( e ) =>  {this.plan.position=e.target.valueAsNumber; this.setPlanState()}} />
                            </td>
                        </tr>
                        <tr>
                            <td>Konto</td>
                            <td>
                                <KontenSelector
                                    onChange={( k, g ) => this.setKonto( k, g )}
                                    konto={this.state.plan.konto}
                                    group={this.state.plan.kontogroup} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>MatchArt</td>
                            <td>
                                <DropdownService value={this.state.plan.matchstyle}
                                    onChange={( e ) =>  {this.plan.matchstyle=e; this.setPlanState()}}
                                    url='collections/matchstyle'
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Wert</td>
                            <td><input value={this.state.plan.wert / 100}
                                type='number'
                                step='0.01'
                                onChange={( e ) =>  {this.plan.wert=e.target.valueAsNumber*100; this.setPlanState()}} />
                            </td>
                        </tr>
                        <tr style={{ background: 'darkgray' }}>
                            <td>Beschreibung</td>
                            <td><textarea cols={20} rows={3}
                                value={this.state.plan.description}
                                onChange={( e ) => {this.plan.description=e.target.value; this.setPlanState()}} />
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