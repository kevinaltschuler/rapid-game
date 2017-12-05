import Inferno from 'inferno';
import Component from 'inferno-component';

import ProgressBar from 'progressbar.js';

import './upgradeButton.scss';

export default class UpgradeButton extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		if(this.props.coins >= this.props.price) {
			this.props.onClick();
		}
	}

	render() {

		let classnames = 'upgradeButton ';
		if(!this.props.coins >= this.props.price) {
			classnames += 'disabled';
		}
		let content = this.props.content;

		return <button
			onClick={this.onClick}
			className={classnames}
			style={{
				fontSize: '18px'
			}}
		>
			{content}
		</button>
	}
};