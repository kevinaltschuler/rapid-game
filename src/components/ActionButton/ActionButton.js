import './actionButton.scss';


const ActionButton = (props) => {
	let classnames = 'actionButton ';

	if(props.disabled) {
		classnames += 'disabled '
	}

	return <button
		onClick={props.onClick}
		className={classnames}
		style={{
			fontSize: '48px'
		}}
	>
		{props.content}
	</button>
};

export default ActionButton;