import Inferno from 'inferno';
import Component from 'inferno-component';

import defaultPlayerData from './defaultPlayerData';
import ActionButton from './../ActionButton/ActionButton.js';
import ClickElement from './ClickElement.js';

import firebase from '../../firebase.js';

export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            clickElements: [],
        };
        let defaultData = defaultPlayerData;
        defaultData.name = 'Player ' + Number(this.state.id + 1);
        this.state = Object.assign(this.state, defaultData);

        this.click = this.click.bind(this);
        this.attack = this.attack.bind(this);
        this.defend = this.defend.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        const playerRef = firebase.database().ref('player' + this.state.id)

        playerRef.once('value', (snapshot) => {
            this.setState(snapshot.val());
        });
        playerRef.on('value', (snapshot) => {
            if(snapshot.val()) {
                this.setState(snapshot.val());
            }
        });
    }

    click() {
        const coinsRef = firebase.database().ref('player' + this.state.id + '/coins');
        const coins = this.state.coins + this.state.clickValue || 0;
        coinsRef.set(coins);
        let clickElements = this.state.clickElements;
        clickElements.push(<ClickElement clickValue={this.state.clickValue} />);
        this.setState({ clickElements });
    }

    pay(amnt) {
        const coinsRef = firebase.database().ref('player' + this.state.id + '/coins');
        let coins = this.state.coins - amnt;
        if(coins < 0) {
            coins = 0;
        }
        let clickElements = this.state.clickElements;
        clickElements.push(<ClickElement clickValue={-1 * amnt} />);
        this.setState({ clickElements });
        coinsRef.set(coins);
    }

    attack() {
        if(this.state.coins >= 100) {
            this.pay(100);
            const attackingRef = firebase.database().ref('player' + this.state.id + '/attacking');
            attackingRef.set(true);

            this.setState({attacking: true});

            setTimeout(function() { 
                attackingRef.set(false); 
            }, 3000);
        }
    }

    defend() {
        if(this.state.coins >= 100) {
            this.pay(100);
            const defendingRef = firebase.database().ref('player' + this.state.id + '/defending');
            defendingRef.set(true);

            this.setState({defending: true});

            setTimeout(function() { 
                defendingRef.set(false); 
            }, 3000);
        }
    }

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    alignItems: 'center',
                    position: 'relative'
                }}
            >
                { this.state.clickElements }
                {/* player header */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: '10px 0px',
                        width: '200px'
                    }}
                >
                    <div>
                        {this.state.name}
                    </div>
                    <div>
                        health: {this.state.health}
                    </div>
                </div>
                {/* player actions */}
                <div style={{ display: 'flex' }}>
                    <ActionButton
                        disabled={this.state.defending}
                        onClick={this.defend} 
                        content={<img width='112' alt='shield' src='https://cdns.iconmonstr.com/wp-content/assets/preview/2017/240/iconmonstr-shield-33.png'/>}
                    />
                    <ActionButton
                        onClick={this.click}
                        content={this.state.coins}
                    />
                    <ActionButton
                        disabled={this.state.attacking}
                        onClick={this.attack} 
                        content={<img width='128' alt="Sword" src="http://www.clker.com/cliparts/2/a/P/l/b/r/black-sword.svg"/>}
                    />
                </div>
                
            </div>
        );
    }
}
