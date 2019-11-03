import React, { useState } from "react";

import { useReactOidc } from '@axa-fr/react-oidc-context'
import { apiInstanceAction } from "../api.js"
import { useStateValue } from '../state.js';
import useApiResponse from "../hooks/ApiResponse.jsx"

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import LinearScaleIcon from '@material-ui/icons/LinearScale';

const useStyles = makeStyles(theme => ({
        formcontrol: {
                margin: theme.spacing(2, 0),
        },
}))

function ObjScale(props) {
        const {path} = props
	const { oidcUser } = useReactOidc()
	const [{ cstat }, dispatch] = useStateValue()
	const { dispatchAlerts } = useApiResponse()

	if (cstat.monitor === undefined) {
		return null
	}
	if (cstat.monitor.services[path] === undefined) {
		return null
	}
	if (!("scale" in cstat.monitor.services[path])) {
		return null
	}
        const [open, setOpen] = React.useState(false)
	const [scale, setScale] = useState(cstat.monitor.services[path].scale)
	const classes = useStyles()

	function handleChange(e) {
		if (e.target.value < 0) {
			setScale(0)
		} else {
			setScale(e.target.value)
		}
	}
        function handleClickOpen(e) {
                e.stopPropagation()
                setOpen(true)
        }
        function handleClose(e) {
                setOpen(false)
        }
	function handleSubmit() {
		apiInstanceAction(
			"ANY",
			path,
			"scale",
			{"to": scale},
			(data) => dispatchAlerts({data: data}),
			oidcUser
		)
		handleClose()
	}
	return (
                <React.Fragment>
                        <IconButton
                                aria-label="Scale"
                                aria-haspopup={true}
                                onClick={handleClickOpen}
                        >
                                <LinearScaleIcon />
                        </IconButton>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Scale {path}</DialogTitle>
                                <DialogContent>
                                        <DialogContentText>
                                                Change the target number instances for this service.
                                        </DialogContentText>
					<FormControl className={classes.formcontrol} fullWidth>
						<TextField
							label="Number of instances"
							id="scale"
							value={scale}
							onChange={handleChange}
							type="number"
						/>
					</FormControl>
                                </DialogContent>
                                <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                                Cancel
                                        </Button>
                                        <Button onClick={handleSubmit} color="secondary">
                                                Submit
                                        </Button>
                                </DialogActions>
                        </Dialog>
                </React.Fragment>
	)
}

export {
	ObjScale,
}
