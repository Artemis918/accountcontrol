import * as React from 'react'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { MonthSelect } from '../utils/monthselect'
import { Plan, Pattern, Template, postRequest } from '../utils/dtos'
import { useIntl, WrappedComponentProps } from 'react-intl'
import { PatternEditor } from '../planing/patterneditor'
import { TimeRangeEditor } from './timerangeeditor'
import { myParseJson } from '../utils/misc'

import * as css from '../css/index.css'



type Create = (props:PlanSelectProps) => JSX.Element;
export const PlanSelect:Create = (p) => { return (<_PlanSelect {...p} intl={useIntl()}/>);} 

type OnAssignCallBack = ( plan: Plan ) => void;

export interface PlanSelectProps {
    onAssign: OnAssignCallBack;
	recordid?: number
    month: number
    year: number;
}

interface IState {
	patternfailed: boolean;
	timerangefailed:boolean;
	patterneditor: boolean;
	timerangeeditor: boolean;
	template: Template;
    month: number;
    year: number;
}

export class _PlanSelect extends React.Component<PlanSelectProps & WrappedComponentProps, IState> {

    columns: ColumnInfo<Plan>[];
    lister: SingleSelectLister<Plan>;

    constructor( props: PlanSelectProps & WrappedComponentProps) {
        super( props );
        this.state = { patternfailed: false,
                       timerangefailed: false,
                       patterneditor: false,
                       timerangeeditor: false,
					   template: null,
                       year: this.props.year,
                       month: this.props.month };

        this.setFilter = this.setFilter.bind( this );
        this.handleChange = this.handleChange.bind( this );
		this.assign = this.assign.bind(this);
		this.setPattern = this.setPattern.bind( this );
		this.settimerange = this.settimerange.bind(this);
		
        this.columns = [{
            header: this.label("date"),
            getdata: ( p: Plan ): string => { return p.plandate.toLocaleDateString( 'de-DE', { day: '2-digit', month: '2-digit' } ) }
        }, {
            header: this.label("details"),
            getdata: ( p: Plan ): string => { return p.shortdescription }
        }, {
            header: this.label("value"),
            cellrender: ( cell: CellInfo<Plan> ): JSX.Element => {
                return (
                    <div style={{
                        color: cell.data.value >= 0 ? 'green' : 'red',
                        textAlign: 'right'
                    }}>
                        {( cell.data.value / 100 ).toFixed( 2 )}
                    </div>
                )
            }
        }]
    }

	label(labelid:string):string {return this.props.intl.formatMessage({id: labelid}); }
		
    setFilter( m: number, y: number ): void {
        this.setState( { year: y, month: m } )
    }

	setAnaylzeData (template: Template): void {
		this.setState( {
			timerangefailed: template.additional[1]=='1',
			patternfailed: template.additional[0]=='1',
			template: template
		})
	}

	handleChange(plan: Plan): void {
		if (this.props.recordid != undefined) {
			var self: _PlanSelect = this;
       		this.setState({timerangefailed: false, patternfailed: false});

       		fetch( "assign/analyze/" + this.props.recordid + "/" + plan.id)
               	 .then( ( response: Response ) => response.text() )
               	 .then( ( text ) => { self.setAnaylzeData( myParseJson( text ) ) } )
        }
	}

	assign():void {
		this.props.onAssign(this.lister.getSelected());
	}
	
	setPattern(p: Pattern): void {
		var plan: Plan =  this.lister.getSelected();
		plan.patterndto=p;
		postRequest('/templates/changepattern',plan,undefined);
		this.setState({patterneditor: false});
	}

	settimerange(template: Template): void {
		postRequest('/templates/save',template,undefined);
		this.setState({timerangeeditor: false});
    }

	
	renderAdjustButtons(): JSX.Element {
		if (this.props.recordid == undefined) {
			return null;
		}
		else {
			return (
				<p style={{borderStyle: 'solid'}}>
					{this.label("assign.adjust")}
					<button onClick={() => this.setState({patterneditor: true})} 
                    	className={css.addonbutton}
                        hidden={!this.state.patternfailed}>
                 	   		{this.label("assign.adjustpattern")}
                	</button>
                	<button onClick={() => this.setState({timerangeeditor: true} )} 
                    	className={css.addonbutton}
						hidden={!this.state.timerangefailed}>
                   	   		{this.label("assign.adjusttime")}
                	</button>
				</p>
			);
		}
	}

	
	renderPatternEditor(): JSX.Element {
		if  (this.state.patterneditor) {
			var plan: Plan = this.lister.getSelected();
			return (<PatternEditor intl={this.props.intl} pattern={plan.patterndto} sendPattern={(p: Pattern) => this.setPattern(p)} zIndex={4}/> );
		} 
		else {
			return null;
		}
	}
	
	renderTimRangeEditor() : JSX.Element {
		if  (this.state.timerangeeditor) {
			var plan: Plan = this.lister.getSelected();
			return (<TimeRangeEditor 
					  recorddate= {this.state.template.start}
					  plandate={plan.plandate}
			          template= {this.state.template}
					  sendResult={this.settimerange}
                      intl={this.props.intl} 
					  zIndex={4}/> );
		} 
		else {
			return null;
		}
	}

    render(): JSX.Element {
        return (
		<div>
            <div style={{
                position: 'fixed',
                zIndex: 2,
                left: '0', top: '0', width: '100%', height: '100%'
            }}>
                <div style={{
                    margin: '15% auto',
                    padding: '20px',
                    border: '2px',
                    width: '300px',
                    borderStyle: 'double',
                    background: 'gray',
                    textAlign: 'center',
                }}>
                    <MonthSelect label='' year={this.state.year} month={this.state.month} onChange={this.setFilter} />
                    <div style={{ padding: '10px' }}>
                        <SingleSelectLister<Plan>
                            ext={this.state.year + '/' + this.state.month}
                            url='plans/unassigned/'
                            lines={12}
                            handleChange={this.handleChange}
                            columns={this.columns}
                            ref={( ref ) => { this.lister = ref }} />
						{this.renderAdjustButtons()}
                    	<p>
                    		<button onClick={() => this.assign()} 
                        		    className={css.addonbutton}>
                    	   		{this.label("assign.assign")}
                    		</button>
                    		<button onClick={() => this.props.onAssign( undefined )} 
                        		    className={css.addonbutton}>
                      	   		{this.label("cancel")}
                    		</button>
                		</p>
					</div>
            	</div>
			</div>
			{this.renderPatternEditor()}
			{this.renderTimRangeEditor()}
		</div>
        )
    }
}