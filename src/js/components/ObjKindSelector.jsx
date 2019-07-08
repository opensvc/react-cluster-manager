import React from "react";

function ObjKindSelectorButton(props) {
	if (props.selected) {
		var cl = "w-100 btn btn-secondary active"
	} else {
		var cl = "w-100 btn btn-light"
	}
	function handleClick(e) {
		props.onClick(props.kind)
		e.target.blur()
	}
	return (
		<button type="button" className={cl} onClick={handleClick}>{props.kind}</button>
	)
}
function ObjKindSelector(props) {
	return (
		<div className="d-flex btn-group btn-group-toggle" data-toggle="buttons">
			{["svc", "vol", "sec", "cfg", "usr", "ccfg"].map((kind) => (
				<ObjKindSelectorButton key={kind} kind={kind} onClick={props.onClick} selected={props.value == kind ? true : false} />
			))}
		</div>
	)
}

export {
	ObjKindSelector
}
