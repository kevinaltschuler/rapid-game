import Inferno from 'inferno';
import Component from 'inferno-component';
import Player from './components/player/Player.js';
import defaultPlayerData from './components/Player/defaultPlayerData.js';

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

		const otherPlayerShieldsRef = firebase.database().ref(otherID + '/shields');

        otherPlayerShieldsRef.once('value', (_snapshot) => {
        	if(_snapshot.val()) {
	        	for(var i = 0; i < _snapshot.val().length; i++) {
	        		const shieldId = _snapshot.val()[i];
	        		const defRef = firebase.database().ref(otherID + '/defending' + shieldId);
	        		defRef.once('value', (snapshot) => {
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

	reset() {
		for(var key in PLAYERS) {
			const player = PLAYERS[key]
			const playerRef = firebase.database().ref(player);
			playerRef.set(defaultPlayerData);
			const playerNameRef = firebase.database().ref(player + '/name');
			playerNameRef.set(player);
		}
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
				<button onClick={this.reset} style={{ zIndex: 99, position: 'absolute', top: '20px', right: '20px'}}>
					reset
				</button>
				{ this.renderPlayers() }
			</div>
		)
	}
}
