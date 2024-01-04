import React from "react"
import clsx from "clsx"

import MuiErrorIcon from '@mui/icons-material/Error'
import { makeStyles } from '@mui/styles'

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
