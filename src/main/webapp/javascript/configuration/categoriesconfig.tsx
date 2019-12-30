import * as React from 'react'
import { SingleSelectLister, ColumnInfo, CellInfo } from '../utils/singleselectlister'
import { EnumDTO } from '../utils/dtos'
import { useIntl, WrappedComponentProps,IntlShape } from 'react-intl'

type SendMessageCallback = ( msg: string, error: boolean ) => void;

interface CategoryConfigProps { 
    sendmessage: SendMessageCallback;
}

interface IState {
    category: EnumDTO;
}

interface Category {
    id: number;
    name: string;
}

export class _CategoriesConfig extends React.Component<CategoryConfigProps & WrappedComponentProps, IState> {


    lister: SingleSelectLister<EnumDTO>;

    constructor( props: CategoryConfigProps & WrappedComponentProps) {
        super( props );
        this.state = { category: undefined };
        this.setCategory = this.setCategory.bind( this );
    }

    label(id: string) : string {
        return this.props.intl.formatMessage({id: id});
    }
    
    setCategory( category: EnumDTO ): void {
        this.setState({category: category})
    }

    render(): JSX.Element {
        var columnsCat: ColumnInfo<EnumDTO>[] = [ { header: this.label("config.category"), getdata: ( c: EnumDTO ) => { return c.text; } } ];
        var columnsSub: ColumnInfo<EnumDTO>[] = [ { header: this.label("config.subcategory"), getdata: ( c: EnumDTO ) => { return c.text; } } ]; 
        return (
            <table>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                                <SingleSelectLister<EnumDTO>
                                    url='category/cat'
                                    ext=''
                                    lines={15}
                                    handleChange={this.setCategory}
                                    columns={columnsCat} />
                        </td>
                       <td style={{ border: '1px solid black', verticalAlign: 'top' }}>
                                 <SingleSelectLister<EnumDTO>
                                     url='category/sub/'
                                     lines={15}
                                     ext={(this.state.category == undefined)?undefined : "/" + this.state.category.value.toString()}
                                     columns={columnsSub}
                                     ref={(ref) =>(this.lister=ref)} />
                            </td>
                        </tr>
                </tbody>
            </table>
        );
    }
}

type Creator = (props:CategoryConfigProps) => JSX.Element;

const CategoriesConfig:Creator = (props : CategoryConfigProps) => {
    return (<_CategoriesConfig {...props} intl={useIntl()}/>);
}

export default CategoriesConfig;