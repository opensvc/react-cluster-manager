import React from "react"
import { useTranslation } from "react-i18next"
import { makeStyles } from "@material-ui/core/styles"

import Tooltip from "@material-ui/core/Tooltip"

const useStyles = makeStyles(theme => ({
        flags: {
		fontFamily: "monospace",
		whiteSpace: "pre",
        },
}))

function Flag(props) {
	return (
		<Tooltip title={props.title}>
			<span>{props.value}</span>
		</Tooltip>
	)
}

function ObjInstanceResourceFlags(props) {
	const {rid, data, idata} = props
	const { t } = useTranslation()
	const classes = useStyles()
	try {
		var retries = idata.monitor.restart[rid]
	} catch(e) {
		var retries = 0
	}
	if (data.restart) {
		var remaining_restart = data.restart - retries
		if (remaining_restart < 0) {
			remaining_restart = 0
		}
	}
	var provisioned = null
	if (data.provisioned) {
		provisioned = data.provisioned.state
	}
	return (
		<div className={classes.flags}>
			{data.running ?
				<Flag value="R" title={t("Running")} /> :
				<Flag value="." title={t("Idle")} />
			}
			{data.monitor ?
				<Flag value="M" title={t("Monitored")} /> :
				<Flag value="." title={t("Not Monitored")} />
			}
			{data.disable ?
				<Flag value="D" title={t("Disabled")} /> :
				<Flag value="." title={t("Enabled")} />
			}
			{data.optional ?
				<Flag value="O" title={t("Optional")} /> :
				<Flag value="." title={t("Mandatory")} />
			}
			{data.encap ?
				<Flag value="E" title={t("Encapsulated")} /> :
				<Flag value="." title={t("Global")} />
			}
			{provisioned ?
				<Flag value="." title={t("Provisioned")} /> :
				(provisioned == null) ?
					<Flag value="/" title={t("Provisioned State Not Applicable")} /> :
					<Flag value="P" title={t("Not Provisioned")} />
			}
			{data.standby ?
				<Flag value="S" title={t("Standby")} /> :
				<Flag value="." title={t("Not Standby")} />
			}
			{!data.restart ?
				<Flag value="." title={t("No Restart")} /> :
				remaining_restart < 10 ?
					<Flag value={remaining_restart} title={t("Number of Restarts Left")} /> :
					<Flag value="+" title={t("{{count}} Restarts Left", remaining_restart)} />
			}
		</div>
	)
}

export default ObjInstanceResourceFlags
