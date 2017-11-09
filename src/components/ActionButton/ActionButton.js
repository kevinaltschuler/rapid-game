import Inferno from 'inferno';
import Component from 'inferno-component';

import ProgressBar from 'progressbar.js';

import './actionButton.scss';

export default class ActionButton extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.props.onClick();
		if(this.props.disabled) {
			const selector = '#loading-' + this.props.id;
			const bar = new ProgressBar.Circle(selector, {
			  	strokeWidth: 6,
			  	easing: 'easeInOut',
			  	duration: 3000,
			  	color: '#fff',
			  	trailColor: '#eee',
			  	trailWidth: 1,
			  	svgStyle: null
			});
			bar.animate(1.0);
		}
	}

	render() {

		let classnames = 'actionButton ';

		const random = Math.random();
		let content;

		if(this.props.disabled) {
			classnames += 'disabled '
			content = <div style={{width: '100px', height: '100px'}} id={'loading-' + this.props.id}/>;
		} else {
			content = this.props.content;
		}

		return <button
			onClick={this.onClick}
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