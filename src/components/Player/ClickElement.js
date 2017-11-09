import './clickElement.scss';


const ClickElement = (props) => {
	return (
		<div
			id={props.id}
			className='clickElement'
			style={{
				marginLeft: Number(props.id * 10 - 5) + 'px',
				marginTop: Number((Math.random() * 10 - 5) + 80) + 'px'
			}}
		>
			{ (props.clickValue > 0) ? '+' + props.clickValue : props.clickValue }
		</div>
	);
};

export default ClickElement;