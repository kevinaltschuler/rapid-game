import Inferno from 'inferno';
import Component from 'inferno-component';
import ProgressBar from 'progressbar.js';

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
        defaultData.name = this.state.id;
        this.state = Object.assign(this.state, defaultData);

        this.click = this.click.bind(this);
        this.attack = this.attack.bind(this);
        this.defend = this.defend.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.clickTimer = setTimeout(() => { 
            this.setState({ clickElements: [] });
        }, 1000);

    }

    componentDidMount() {
        const playerRef = firebase.database().ref(this.state.id)

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
        const coinsRef = firebase.database().ref(this.state.id + '/coins');
        const coins = this.state.coins + this.state.clickValue || 0;
        coinsRef.set(coins);
        let clickElements = this.state.clickElements || [];
        clickElements.push(<ClickElement id={Math.random()} clickValue={this.state.clickValue} />);
        this.setState({ clickElements });
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => { 
            this.setState({ clickElements: [] });
        }, 800);
    }

    pay(amnt) {
        const coinsRef = firebase.database().ref(this.state.id + '/coins');
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
        if(this.state.coins >= 100 && !this.state.attacking) {
            this.pay(100)
            const attackingRef = firebase.database().ref(this.state.id + '/attacking');
            attackingRef.set(true);

            this.setState({attacking: true});

            setTimeout(() => { 
                this.props.attack(this.props.id);
                attackingRef.set(false);
            }, 3000);
        }
    }

    defend() {
        if(this.state.coins >= 100 && !this.state.defending) {
            this.pay(100);
            const defendingRef = firebase.database().ref(this.state.id + '/defending');
            defendingRef.set(true);

            this.setState({defending: true});

            setTimeout(function() { 
                defendingRef.set(false); 
            }, 3000);
        }
    }

    render() {
        const hearts = [];
        for(var i = 0; i < this.state.health; i++) {
            hearts.push(<img width='24' alt='heart' src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/OOjs_UI_icon_heart.svg/2000px-OOjs_UI_icon_heart.svg.png'/>);
        }
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
                { this.state.attackEffect }
                { this.state.defendEffect }
                {/* player header */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: '10px 0px',
                        width: '500px'
                    }}
                >
                    <div>
                        {this.state.name}
                    </div>
                    <div>
                        {hearts}
                    </div>
                </div>
                {/* player actions */}
                <div style={{ display: 'flex' }}>
                    <ActionButton
                        disabled={this.state.defending}
                        onClick={this.defend} 
                        id={this.props.id + 'defend'}
                        content={<img width='112' alt='shield' src='https://cdns.iconmonstr.com/wp-content/assets/preview/2017/240/iconmonstr-shield-33.png'/>}
                    />
                    <ActionButton
                        onClick={this.click}
                        id={2}
                        content={this.state.coins}
                    />
                    <ActionButton
                        disabled={this.state.attacking}
                        onClick={this.attack} 
                        id={this.props.id + 'attack'}
                        content={<img width='128' alt="Sword" src="http://www.clker.com/cliparts/2/a/P/l/b/r/black-sword.svg"/>}
                    />
                </div>
                
            </div>
        );
    }
}
