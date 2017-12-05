import Inferno from 'inferno';
import Component from 'inferno-component';
import firebase from '../../firebase.js';

import ProgressBar from 'progressbar.js';

import './actionButton.scss';

export default class ActionButton extends Component {
	constructor(props) {
		super(props);
		this.componentDidUpdate = this.componentDidUpdate.bind(this);
	}

	disable() {
		const selector = '#loading-' + this.props.id;
		const bar = new ProgressBar.Circle(selector, {
		  	strokeWidth: 6,
		  	easing: 'easeInOut',
		  	duration: this.props.time,
		  	color: '#fff',
		  	trailColor: '#eee',
		  	trailWidth: 1,
		  	svgStyle: null
		});
		bar.animate(1.0);
	}

	componentDidUpdate() {
		const disabled = (this.state) ? this.state.disabled : false;

		if(this.props.disabled && !disabled) {
			this.disable();
			this.setState({ disabled: true });
			return;
		} else if(!this.props.disabled && disabled) {
			this.setState({ disabled: false });
		}
	}

	render() {
		let classnames = 'actionButton ';

		let content;

		if(this.props.disabled) {
			classnames += 'disabled '
			content = <div style={{width: '100px', height: '100px'}} id={'loading-' + this.props.id}/>;
		} else {
			content = this.props.content;
		}

		return <button
			onClick={() => this.props.onClick()}
			className={classnames}
			style={{
				fontSize: '48px'
			}}
			disabled={this.props.disabled}
		>
			{content}
		</button>
	}
};