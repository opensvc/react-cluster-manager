import React from "react"
import clsx from "clsx"

import MuiErrorIcon from '@material-ui/icons/Error'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	root: {
		color: theme.status.error,
	},
}))

const ErrorIcon = React.forwardRef(function ErrorIcon(props, ref) {
	const classes = useStyles()
	return <MuiErrorIcon {...props} ref={ref} className={clsx(classes.root, props.className)} />
})

export default ErrorIcon
