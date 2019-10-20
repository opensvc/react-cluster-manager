import React, { useState } from "react"
import { useStateValue } from '../state.js'
import useClusterStatus from "../hooks/ClusterStatus.jsx"
import useUser from "../hooks/User.jsx"
import PropGroup from "./PropGroup.jsx"
import Prop from "./Prop.jsx"
import NodeLabelAdd from "./NodeLabelAdd.jsx"
import NodeLabelEdit from "./NodeLabelEdit.jsx"
import NodeLabelRemove from "./NodeLabelRemove.jsx"

import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'

function EditButton(props) {
	const { user } = useUser()
        if (!user.grant) {
                return null
        }
        if (!("root" in user.grant)) {
                return null
        }
	return (
		<IconButton
			aria-label="Edit Labels"
			aria-haspopup={true}
			onClick={props.toggle}
		>
			<EditIcon />
		</IconButton>
	)
}

function NodeLabels(props) {
	const { name } = props
	const { cstat } = useClusterStatus()
	const [edit, setEdit] = useState(false)

	try {
		var labels = cstat.monitor.nodes[name].labels
	} catch(e) {
		return null
	}

	return (
		<PropGroup
			title="Labels"
			action={
				<React.Fragment>
					<EditButton toggle={() => {setEdit(!edit)}} />
					<NodeLabelAdd node={name} />
				</React.Fragment>
			}
		>
			{Object.keys(labels).sort().map((k) => (
			<Prop
				key={k}
				title={k}
				value={labels[k]}
				change={edit ? <NodeLabelEdit node={name} labelKey={k} labelCurrent={labels[k]} /> : null}
				remove={edit ? <NodeLabelRemove node={name} labelKey={k} /> : null}
			/>
			))}
		</PropGroup>
	)
}

export default NodeLabels
