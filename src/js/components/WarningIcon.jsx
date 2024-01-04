import React from "react"
import clsx from "clsx"

import MuiWarningIcon from '@mui/icons-material/Warning'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
	root: {
		color: theme.status.warning,
	},
}))

const WarningIcon = React.forwardRef(function WarningIcon(props, ref) {
	const classes = useStyles()
	return <MuiWarningIcon {...props} ref={ref} className={clsx(classes.root, props.className)} />
})

export default WarningIcon
