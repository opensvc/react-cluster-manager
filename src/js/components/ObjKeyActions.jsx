import React from "react";
import useUser from "../hooks/User.jsx"
import { useStateValue } from '../state.js';
import { splitPath } from '../utils.js';
import { apiInstanceAction } from "../api.js";
import { Actions, ActionsSection, ActionsItem, ActionsDivider } from './Actions.jsx';
import useApiResponse from "../hooks/ApiResponse.jsx"


import DeleteIcon from "@mui/icons-material/Delete"
//import RefreshIcon from "@mui/icons-material/Refresh"
//import PlayArrowIcon from "@mui/icons-material/PlayArrow"
//import StopIcon from "@mui/icons-material/Stop"
//import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
//import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
//import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled"
//import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline"
//import ShuffleIcon from "@mui/icons-material/Shuffle"
//import LabelIcon from "@mui/icons-material/Label"

function ObjKeyActions(props) {
	const { auth } = useUser()
	const [{cstat}, dispatch] = useStateValue()
	const { dispatchAlerts } = useApiResponse()
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
				(data) => dispatchAlerts({data: data}),
				auth
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
