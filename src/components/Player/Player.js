import Inferno from 'inferno';
import Component from 'inferno-component';
import ProgressBar from 'progressbar.js';

import defaultPlayerData from './defaultPlayerData';
import ActionButton from './../ActionButton/ActionButton.js';
import UpgradeButton from './../UpgradeButton/UpgradeButton.js';
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
        this.pay = this.pay.bind(this);
        this.buyClicker = this.buyClicker.bind(this);
        this.buyShield = this.buyShield.bind(this);
        this.buySword = this.buySword.bind(this);
        this.renderSwords = this.renderSwords.bind(this);
        this.renderShields = this.renderShields.bind(this);
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

        setInterval(() => {
            this.click(this.state.clickers * this.state.clickValue);
        }, 1000);
    }

    click(value) {
        if(value <= 0) {
            return;
        }
        const coinsRef = firebase.database().ref(this.state.id + '/coins');
        const coins = this.state.coins + value || 0;
        coinsRef.set(coins);
        let clickElements = this.state.clickElements || [];
        clickElements.push(<ClickElement id={Math.random()} clickValue={value} />);
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

    attack(i) {
        if(!this.state['attacking' + i]) {
            const attackingRef = firebase.database().ref(this.state.id + '/attacking' + i);
            attackingRef.set(true);

            const swordsRef = firebase.database().ref(this.state.id + '/swords');

            setTimeout(() => { 
                this.props.attack(this.props.id);
                attackingRef.set(false);
                let swords = this.state.swords;
                const index = this.state.swords.indexOf(i);
                swords.splice(index, 1);
                swordsRef.set(swords);
            }, 3000);
        }
    }

    defend(id) {
        if(!this.state['defending' + id]) {
            const defendingRef = firebase.database().ref(this.state.id + '/defending' + id);
            defendingRef.set(true);

            const shieldsRef = firebase.database().ref(this.state.id + '/shields');

            setTimeout(() => { 
                defendingRef.set(false);
                let shields = this.state.shields;
                const index = this.state.shields.indexOf(id);
                shields.splice(index, 1);
                shieldsRef.set(shields); 
            }, 800);
        }
    }

    buyClicker(price) {
        this.pay(price);
        const clickersRef = firebase.database().ref(this.state.id + '/clickers');
        const clickers = this.state.clickers + 1 || 0;
        clickersRef.set(clickers);
        clearTimeout(this.clickTimer);
        this.clickTimer = setTimeout(() => { 
            this.setState({ clickElements: [] });
        }, 800);
    }

    buySword(price) {
        this.pay(price);
        const swordsRef = firebase.database().ref(this.state.id + '/swords');
        const swordId = this.idGenerator();
        let swords;
        if(this.state.swords) {
            swords = this.state.swords.slice(0);
            swords.push(swordId);
        }
        else {
            swords = [swordId];
        }
        swordsRef.set(swords);
    }

    buyShield(price) {
        this.pay(price);
        const shieldsRef = firebase.database().ref(this.state.id + '/shields');
        const shieldId = this.idGenerator();
        let shields;
        if(this.state.shields) {
            shields = this.state.shields.slice(0);
            shields.push(shieldId);
        }
        else {
            shields = [shieldId];
        }
        shieldsRef.set(shields);
    }

    renderShields() {

        const shields = [];

        if(!this.state.shields) {
            return;
        }

        for(var i = 0; i < this.state.shields.length; i++) {
            const shieldId = this.state.shields[i];
            console.log(this.state.id, ' ', i, ' ', shieldId);
            if(!shieldId) {
                continue;
            }
            shields.push(<ActionButton
                    disabled={this.state['defending' + shieldId]}
                    myRef={'defending'}
                    time={800}
                    onClick={() => this.defend(shieldId)} 
                    id={this.props.id + 'defend' + shieldId}
                    content={<img width='112' alt='shield' src='https://cdns.iconmonstr.com/wp-content/assets/preview/2017/240/iconmonstr-shield-33.png'/>}
                />)
        }

        const width = 180*this.state.swords.length;

        return <div style={{display: 'flex', minWidth: width}}>{shields}</div>;
    }

    renderSwords() {

        const swords = [];

        if(!this.state.swords) {
            return <div/>;
        }

        for(var i = 0; i < this.state.swords.length; i++) {
            const swordId = this.state.swords[i];
            if(!swordId) {
                continue;
            }
            swords.push(
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <ActionButton
                        disabled={this.state['attacking' + swordId]}
                        myRef={'attacking' + swordId}
                        time={3000}
                        onClick={() => this.attack(swordId)}
                        id={this.props.id + 'attack' + swordId}
                        content={<img width='128' alt="Sword" src="http://www.clker.com/cliparts/2/a/P/l/b/r/black-sword.svg"/>}
                    />
                </div>
            )
        }

        const width = 180*this.state.shields.length;

        return <div style={{display: 'flex', minWidth: width}}>{swords}</div>;
    }

    idGenerator() {
        return (this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4());
    }

    S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };

    render() {
        const hearts = [];
        for(var i = 0; i < this.state.health; i++) {
            hearts.push(<img width='24' alt='heart' src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/OOjs_UI_icon_heart.svg/2000px-OOjs_UI_icon_heart.svg.png'/>);
        }

        const clickerPrice = 20 * (this.state.clickers + 1);
        const shieldPrice = 200 * (this.state.shields.length + 1);
        const swordPrice = 200 * (this.state.swords.length + 1);
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
                    {this.renderShields()}
                    <ActionButton
                        onClick={() => this.click(this.state.clickValue)}
                        id={2}
                        content={<div>{this.state.coins} <br/> <div style={{fontSize: '18px'}}>{this.state.clickers * this.state.clickValue} CPS</div></div>}
                    />
                    {this.renderSwords()}
                </div>
                
                {/* upgrades */}
                <div style={{display: 'flex'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <UpgradeButton
                            coins={this.state.coins}
                            price={shieldPrice}
                            onClick={() => this.buyShield(shieldPrice)}
                            content={'+ shield'}
                        />
                        ${shieldPrice}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <UpgradeButton
                            coins={this.state.coins}
                            price={clickerPrice}
                            onClick={() => this.buyClicker(clickerPrice)}
                            content={'+ miner'}
                        />
                        ${clickerPrice}
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <UpgradeButton
                            coins={this.state.coins}
                            price={swordPrice}
                            onClick={() => this.buySword(swordPrice)}
                            content={'+ sword'}
                        />
                        ${swordPrice}
                    </div>
                </div>
            </div>
        );
    }
}
