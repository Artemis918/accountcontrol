import * as React from 'react'
import { useIntl, WrappedComponentProps,IntlShape } from 'react-intl'

import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { Category, SubCategory } from '../utils/dtos'
import { AddTool } from './addtool'

type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface CategoryConfigProps { 
    sendmessage: SendMessageCallback;
}

interface IState {
    category: Category;
    subcategory: SubCategory;
    addcat: boolean;
    addsub: boolean;
    delcat: boolean;
    delsub: boolean;
     
}

export class _CategoriesConfig extends React.Component<CategoryConfigProps & WrappedComponentProps, IState> {
    
    catlister: React.RefObject<SingleSelectLister<Category>>;
    sublister: React.RefObject<SingleSelectLister<SubCategory>>;

    constructor( props: CategoryConfigProps & WrappedComponentProps) {
        super( props );
        this.state = { category: undefined,
                       subcategory: undefined,
                       addcat: false,
                       addsub: false,
                       delcat: false,
                       delsub: false,
        };
        this.setCategory = this.setCategory.bind( this );
        this.setSubCategory = this.setSubCategory.bind( this );
        this.saveCat = this.saveCat.bind( this );
        this.saveSub = this.saveSub.bind( this );
        this.delCat = this.delCat.bind( this );
        this.delSub = this.delSub.bind( this );
        this.catlister = React.createRef();
        this.sublister = React.createRef();
    }

    label(id: string) : string {
        return this.props.intl.formatMessage({id: id});
    }
    
    setCategory( category: Category ): void {
        this.setState({category: category})
    }

    setSubCategory( subcategory: SubCategory ): void {
        this.setState({subcategory: subcategory})
    }

    delSub():void {
        var self = this;
        if (this.state.subcategory != undefined) {
            fetch( '/category/delsub/' +this.state.subcategory.id ) 
                 .then( function( response ) {
                    self.setState({delsub: false});
                    self.sublister.current.reload();
                }
            );
        }
    }
    
    delCat(short: string, desc: string):void {
        var self = this;
        if (this.state.category != undefined) {
            fetch( '/category/delcat/' +this.state.category.id ) 
                 .then( function( response ) {
                    self.setState({delcat: false});
                    self.sublister.current.reload();
                }
            );
        }
    }

    
    saveSub(short: string, desc: string):void {
        var self = this;
        if (short != undefined && short != '') {
            var subCategory:SubCategory = {id: 0, shortdescription:short, description: desc, category: this.state.category.id, art: 0};
            var jsonbody = JSON.stringify( subCategory );
            fetch( '/category/savesub', {
                       method: 'post',
                       body: jsonbody,
                       headers: {"Content-Type": "application/json" }
                  }
            ).then( 
                function( response ) {
                   self.setState({addsub: false});
                   self.sublister.current.reload();
                }
            );
        }
        else {
            self.setState({addsub: false});
        }
    }
    
    saveCat(short: string, desc: string):void {
        var self = this;
        if (short != undefined && short != '') {
            var category:Category = {id: 0, shortdescription:short, description: desc};
            var jsonbody = JSON.stringify( category );
            fetch( '/category/savecat', {
                       method: 'post',
                       body: jsonbody,
                       headers: {"Content-Type": "application/json" }
                  }
            ).then( 
                function( response ) {
                   self.setState({addcat: false});
                   self.catlister.current.reload();
                }
            );
        }
        else {
            self.setState({addcat: false});
        }
    }
    
    renderAdd(): JSX.Element {
        var create: string = this.props.intl.formatMessage({id: "create"});
        var cancel: string = this.props.intl.formatMessage({id: "cancel"});
        var dellabel: string = this.props.intl.formatMessage({id: "delete"});
    
        if (this.state.addcat) {
            return ( <AddTool save={this.saveCat} createlabel={create} cancellabel={cancel}/> )
        }
        else if (this.state.addsub) {
            return ( <AddTool save={this.saveSub} createlabel={create} cancellabel={cancel} category={this.state.category.shortdescription}/> )
        }
        else {
            return null;
        }
    }

    
    render(): JSX.Element {
        var columnsCat: ColumnInfo<Category>[] = [ { header: this.label("config.category"), getdata: ( c: Category ) => { return c.shortdescription; } } ];
        var columnsSub: ColumnInfo<SubCategory>[] = [ { header: this.label("config.subcategory"), getdata: ( c: SubCategory ) => { return c.shortdescription; } } ]; 
        return (
            <div>
            <table>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                                <SingleSelectLister<Category>
                                    url='category/cat'
                                    ext=''
                                    lines={15}
                                    handleChange={this.setCategory}
                                    columns={columnsCat} 
                                    ref={this.catlister}/> 
                       </td>
                       <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                                 <SingleSelectLister<SubCategory>
                                     url='category/sub/'
                                     lines={15}
                                     ext={(this.state.category == undefined)?undefined : "/" + this.state.category.id.toString()}
                                     columns={columnsSub}
                                     ref={this.sublister}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                    <button onClick={()=>this.setState({addcat: true})}> + </button>
                                    <button> - </button>
                            </td>
                            <td>
                                    <button onClick={()=>this.setState({addsub: true})} disabled={this.state.category==undefined}> + </button>
                                    <button> - </button>
                            </td>
                        </tr>
                </tbody>
            </table>
            {this.renderAdd()}
            </div>
        );
    }
}

type Creator = (props:CategoryConfigProps) => JSX.Element;

const CategoriesConfig:Creator = (props : CategoryConfigProps) => {
    return (<_CategoriesConfig {...props} intl={useIntl()}/>);
}

export default CategoriesConfig;