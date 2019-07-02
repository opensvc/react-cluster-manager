import React from "react";
import { useStateValue } from '../state.js';

function Alerts(props) {
	const [{ alerts }, dispatch] = useStateValue();
	if (!alerts) {
		return null
	}
	return (
		<div>
			{alerts.map((a, i) => (
				<Alert key={i} data={a} i={i} />
			))}
		</div>
	)
}

function Alert(props) {
	const [{}, dispatch] = useStateValue();
	var cl = "alert alert-" + props.data.level
	function handleClick(e) {
		dispatch({
			type: "closeAlert",
			i: e.target.getAttribute("i")
		})
	}
	return (
		<div className={cl}>
			<button type="button" className="close" i={props.i} onClick={handleClick}>&times;</button>
			<small>{props.data.date.toLocaleString()}&nbsp;</small>
			{props.data.body}
		</div>
	)
}

export { Alerts };


