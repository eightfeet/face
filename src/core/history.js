// public hash history
import { createHashHistory } from 'history';
let history;
if (typeof document !== 'undefined') {
	history = createHashHistory();
}
export default history;

