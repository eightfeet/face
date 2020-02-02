/* eslint-disable import/prefer-default-export */

export function setRuntimeVariable(data) {
	return {
		type: 'SET_RUNTIME_VARIABLE',
		payload: data
	};
}
