import Inferno from 'inferno';
import Component from 'inferno-component';
import Player from './components/player/Player.js';

const NUM_PLAYERS = 2;

export default class GameContainer extends Component {
	renderPlayers() {
		let players = [];
		for(var i = 0; i < NUM_PLAYERS; i++) {
			players.push(<Player id={i} />);
		}
		return players;
	}

	render() {
		return (
			<div 
				style={{
					height: '100vh',
					backgroundColor: '#eee',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between'
				}}
			>
				{ this.renderPlayers() }
			</div>
		)
	}
}
