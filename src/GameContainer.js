import Inferno from 'inferno';
import Component from 'inferno-component';
import Player from './components/player/Player.js';

import firebase from './firebase.js';

const PLAYERS = ['bearwinkle', 'smashdorf'];

export default class GameContainer extends Component {
	constructor(props) {
		super(props);
		this.renderPlayers = this.renderPlayers.bind(this);
		this.attack = this.attack.bind(this);
	}

	renderPlayers() {
		let players = [];
		for(var i = 0; i < PLAYERS.length; i++) {
			players.push(<Player attack={this.attack} id={PLAYERS[i]} />);
		}
		return players;
	}

	attack(attackerId) {
		const otherID = PLAYERS.filter((id) => id != attackerId)[0];

		const otherPlayerDefRef = firebase.database().ref(otherID + '/defending');

        otherPlayerDefRef.once('value', (snapshot) => {
            if(snapshot.val()) {
            	return;
            } else {
            	const otherPlayerHealthRef = firebase.database().ref(otherID + '/health');
            	otherPlayerHealthRef.once('value', (snapshot) => {
            		if(snapshot.val() > 0)
            			otherPlayerHealthRef.set(snapshot.val() - 1);
            		else {
            			otherPlayerHealthRef.set(0);
            		}
            	})
            }
        });
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
