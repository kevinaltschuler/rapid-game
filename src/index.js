// inferno module
import { render } from 'inferno';
import GameContainer from './GameContainer.js';

const app = (
	<div>
		<GameContainer />
	</div>
);

render(app, document.getElementById('app'));
