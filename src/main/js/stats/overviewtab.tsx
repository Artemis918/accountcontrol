import * as React from 'react'
import { useIntl, WrappedComponentProps } from 'react-intl';

type Create = (props:OverviewTabProps) => JSX.Element;
export const OverviewTab:Create = (p) => {return (<_OverviewTab {...p} intl={useIntl()}/>); }

export interface OverviewTabProps {
}

interface IState {
}

class _OverviewTab extends React.Component<OverviewTabProps & WrappedComponentProps, IState> {
	constructor(props: OverviewTabProps & WrappedComponentProps) {
		super(props);
		this.state = {};
	}

	render(): JSX.Element {
		return (
		<div>
		some text
		</div>	
		)
	}
}