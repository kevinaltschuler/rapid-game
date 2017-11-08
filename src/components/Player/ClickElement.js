import './clickElement.scss';


const ClickElement = (props) => {
	return (
		<div className='clickElement'>
			{ (props.clickValue > 0) ? '+' + props.clickValue : props.clickValue }
		</div>
	);
};

export default ClickElement;