import * as React from 'react'
import { MultiSelectLister, ColumnInfo, CellInfo } from '../utils/multiselectlister'
import { CategoryTree } from './categorytree'
import { MonthSelect } from '../utils/monthselect'
import { AccountRecord, Assignment, Plan } from '../utils/dtos'
import * as acss from './css/account.css'
import * as css from '../css/index.css'
import { SendMessage, MessageID } from '../utils/messageid'
import { AssignEdit } from '../assign/assignedit'
import { ContextMenuDef, ContextMenuEntry } from '../utils/contextmenu'
import { label } from '../utils/misc'


interface CategoriesProps {
    sendmessage: SendMessage;
}

interface IState {
    selectedSubCategory?: number;
    selectedCategory?: number;
    month: number;
    year: number;
    assignEdit: boolean;
    selectedAssignments: Assignment[];
}

export class Categories extends React.Component<CategoriesProps, IState> {

    columns: ColumnInfo<Assignment>[];
    lister: React.RefObject<MultiSelectLister<Assignment>|null> = React.createRef();

    constructor(props: CategoriesProps) {
        super(props);
        var currentTime = new Date();
        this.state = {
            selectedSubCategory: undefined,
            selectedCategory: undefined,
            month: currentTime.getMonth() + 1,
            year: currentTime.getFullYear(),
            assignEdit: false,
            selectedAssignments: []
        };
        this.lister = React.createRef();
        this.columns= this.createColumns();

        this.handleSelected = this.handleSelected.bind(this);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
        this.commitAssignment = this.commitAssignment.bind(this);
        this.commitSelected = this.commitSelected.bind(this);
        this.commitAll = this.commitAll.bind(this);
        this.removeAssignment = this.removeAssignment.bind(this);
        this.acceptValueAssignment = this.acceptValueAssignment.bind(this);
        this.editAssignment = this.editAssignment.bind(this);
        this.createFooter = this.createFooter.bind(this);
        this.onAssign = this.onAssign.bind(this);
    }

    componentDidMount(): void {
		var self: Categories = this;
        fetch('assign/youngestassignment')
        .then((response: Response) => response.text())
        .then((data: string) => {
            if (data != "") {
                var month: number = parseInt(data.substring(6, 8));
                var year: number = parseInt(data.substring(1, 5));
                self.setState({ month: month, year: year });
            }
        }
     ); 
    }


    createColumns(): ColumnInfo<Assignment>[] {
        return [
            {
                header: label("shortdescription"),
                getdata: (z: Assignment) => { return z.detail }
            },
            {
                header: label("check.plan"),
                cellrender: (cell: CellInfo<Assignment>) => {
                    var planned = (cell.data == undefined || cell.data.planed == undefined) ? 0 : cell.data.planed;
                    if (planned == 0) {
                        return null;
                    }
                    else {
                        return (
                            <div style={{ textAlign: 'right' }}>
                                {(planned / 100).toFixed(2)}
                            </div>
                        )
                    }
                }
            },
            {
                header: label("check.real"),
                cellrender: (cell: CellInfo<Assignment>) :React.JSX.Element => {
                    var real = (cell.data == undefined || cell.data.real == undefined) ? 0 : cell.data.real;
                    return (
                        <div style={{ textAlign: 'right', backgroundColor: this.getColor(cell.data) }}>
                            {(cell.data.accountrecord == 0) ? '--' : (cell.data.real / 100).toFixed(2)}
                        </div>
                    )
                },
            },
            {
                header: 'ok',
                cellrender: (cell: CellInfo<Assignment>):React.JSX.Element|null => {
                    if (cell.data.accountrecord != 0 && cell.rownum != -1)
                        return (
                            <input type='checkbox'
                                checked={cell.data.committed}
                                onClick={() => this.commitAssignment(cell.data)} />
                        )
                    else
                        return null;
                },
            }
        ];
    }

    getColor(a: Assignment): string {
        if (a.accountrecord == 0 || a.plan == 0 || a.planed == undefined || a.real == undefined )
            return 'lightgrey';
        else if (a.planed > a.real)
            return 'red';
        else
            return 'green';
    }

    commit(alist: Assignment[]): void {
        var ids: (number|undefined)[] = alist.map((a: Assignment) => { return a.id; });
        var self: Categories = this;
        fetch('assign/commit', {
            method: 'post',
            body: JSON.stringify(ids),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function () {
            self.lister.current?.reload();
        });
    }

    commitAssignment(a: Assignment): void {
        var self: Categories = this;
        fetch('assign/invertcommit/' + a.id)
            .then(function () {
                self.lister.current?.reload();
            });
    }

    commitSelected(): void {
        this.commit(this.state.selectedAssignments);
        this.setState({selectedAssignments: []});
        this.lister.current?.reload();
    }

    commitAll(): void {
        if (this.lister.current == null) {
            return;
        }
        this.commit(this.lister.current.getDataAll());
        this.lister.current?.reload();
    }

    editAssignment(): void {
        if (this.state.selectedAssignments.length != 1) {
            this.props.sendmessage(label("assign.onevalue"), MessageID.INVALID_DATA);
            return;
        }

        if (this.state.selectedAssignments[0].accountrecord == 0 ) {
            this.props.sendmessage(label("check.noassignment"), MessageID.INVALID_DATA);
            return;
        }

        this.setState({ assignEdit: true });
    }

    acceptValueAssignment(): void {
        var assignments: Assignment[] = this.state.selectedAssignments;
        if (assignments.length != 1) {
            this.props.sendmessage(label("assign.onevalue"), MessageID.INVALID_DATA);
        }
        else {
            var id: number | undefined = assignments[0].id;
            var url: string = 'assign/newvalue/';

            if (id == 0 || id == undefined) {
                id = assignments[0].plan;
                url = 'assign/endplan/';
            }

            if (id != undefined) {
                var self: Categories = this;
                fetch(url + id, { headers: { "Content-Type": "application/json" } })
                    .then((response: Response) => response.text())
                    .then(() => self.lister.current?.reload());
            }
        }
    }

    removeAssignment(): void {
        var ids: number[] = this.state.selectedAssignments.map((assign: Assignment) => { return assign.accountrecord; });
        var self: Categories = this;
        fetch('assign/remove', {
            method: 'post',
            body: JSON.stringify(ids),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function () {
            self.lister.current?.reload();
        });
    }

    onAssign(changed: boolean): void {
        this.setState({ assignEdit: false });
        if (changed) {
            this.lister.current?.reload();
        }
    }

    createExt(): string {
        var date: string = '/' + this.state.year + '/' + this.state.month + '/';
        if (this.state.selectedSubCategory != undefined) {
            return '/getsubcategory' + date + this.state.selectedSubCategory;
        }
        else if (this.state.selectedCategory != undefined) {
            return '/getcategory' + date + this.state.selectedCategory;
        }
        else {
            return '/getcategory' + date + '1';
        }
    }

    handleSelected(data: Assignment[]): void {
        this.setState({selectedAssignments: data});
    }

    handleCategorySelect(kg?: number,sub?:number ): void {
        this.setState({ selectedCategory: kg, selectedSubCategory: sub,  selectedAssignments: [] });
    }


    renderAssignEdit(): React.JSX.Element {
        if (this.state.assignEdit) {
            var assignment: Assignment = this.state.selectedAssignments[0]
            var recordId: number | undefined = assignment.accountrecord

            return <AssignEdit sendMessage={this.props.sendmessage}
                recordId={recordId}
                assignment={assignment}
                onAssign={this.onAssign}
                />;}
        else
            return <></>;
    }

    createFooter(z: Assignment[]): Assignment {
        var real: number = 0;
        var planed: number = 0;
        z.map((assignment: Assignment) => { real += assignment.real; if (assignment.planed != undefined) planed += assignment.planed; })
        return {
            detail: label("check.sum"),
            real: real,
            planed: planed,
            description:  label("check.sum"),
            committed: false,
            accountrecord: -1,
            subcategory: 0
        };
    }

    render(): React.JSX.Element {


        let singleline: boolean = this.lister.current != null && this.state.selectedAssignments.length == 1;
        let hasPlan: boolean = singleline && this.state.selectedAssignments[0].plan != 0 
                                          && this.state.selectedAssignments[0].planed != this.state.selectedAssignments[0].real;

        let mainentries: ContextMenuEntry<AccountRecord>[] = [
            { name: label("check.removeassign"), func: this.removeAssignment, active: true },
            { name: label("check.acceptvalue"), func: this.acceptValueAssignment, active: hasPlan },
            { name: label("edit"), func: this.editAssignment, active: singleline},
        ];

        var contextMenu: ContextMenuDef<AccountRecord> = {
            entries: mainentries,
            title: label("check.check")
        }

        return (
            <div>
                <div style={{ border: '1px solid black' }}>

                    <button className={css.actionbutton}
                        onClick={() => this.commitSelected()}
                        disabled={this.state.selectedAssignments.length == 0}>
                        {label("check.commitselected")}
                    </button>
                    <button className={css.actionbutton}
                        onClick={() => this.commitAll()}>
                        {label("check.commitall")}
                    </button>

                    <button className={css.actionbutton}
                        onClick={() => this.acceptValueAssignment()}
                        disabled={this.state.selectedAssignments.length != 1 || !hasPlan}>
                        {label("check.acceptvalue")}
                    </button>
                    <button className={css.actionbutton}
                        onClick={() => this.editAssignment()}
                        disabled={this.state.selectedAssignments.length != 1}>
                        {label("edit")}
                    </button>
                    <button className={css.actionbutton}
                        onClick={() => this.removeAssignment()}
                        disabled={this.state.selectedAssignments.length == 0}>
                        {label("check.removeassign")}
                    </button>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                                <div className={acss.monthselect}>
                                    <MonthSelect label={label("month")}
                                        onChange={(m: number, y: number) => this.setState({ month: m, year: y })}
                                        month={this.state.month}
                                        year={this.state.year} />
                                </div>
                                <CategoryTree
                                    handleCatSelect={(cat: number) => this.handleCategorySelect( cat, undefined )}
                                    handleSubSelect={(sub: number) => this.handleCategorySelect( undefined, sub)}
                                />
                            </td>
                            <td style={{ border: '1px solid black' }}>
                                <MultiSelectLister<Assignment>
                                    createFooter={this.createFooter}
                                    url='assign'
                                    lines={28}
                                    ext={this.createExt()}
                                    columns={this.columns}
                                    ref={this.lister}
                                    handleselect={this.handleSelected}
                                    menu={contextMenu} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                {this.renderAssignEdit()}
            </div>
        );
    }
}