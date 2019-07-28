import React from "react";
import { useStateValue } from '../state.js';
import { splitPath } from '../utils.js';
import { apiInstanceAction } from "../api.js";
import { Actions, ActionsSection, ActionsItem, ActionsDivider } from './Actions.jsx';

import RefreshIcon from "@material-ui/icons/Refresh"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import StopIcon from "@material-ui/icons/Stop"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import DeleteIcon from "@material-ui/icons/Delete"
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline"
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled"
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline"
import ShuffleIcon from "@material-ui/icons/Shuffle"
import LabelIcon from "@material-ui/icons/Label"

function ObjKeyActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const {path, selected, title, fab} = props
	const sp = splitPath(path)

	function submit(props) {
		if (props.value == "delete") {
			var kws = []
			for (var key of selected) {
				kws.push("data."+key)
			}
			apiInstanceAction(
				"ANY",
				path,
				"unset",
				{
					"kw": kws
				},
				(data) => dispatch({type: "parseApiResponse", data: data})
			)
		}
	}

	return (
		<Actions path={path} title={title} submit={submit} fab={fab}>
			<ActionsSection name="dangerous" color="danger" confirms={6}>
				<ActionsItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}}
					icon=<DeleteIcon />
				/>
			</ActionsSection>
		</Actions>
	)
}

export {
	ObjKeyActions
}
