import React, { useState } from "react";
import useUser from "../hooks/User.jsx"
import { apiInstanceAction } from "../api.js"
import { useStateValue } from '../state.js';
import useApiResponse from "../hooks/ApiResponse.jsx"
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import useClasses from "../hooks/useClasses.jsx";

const useStyles = theme => ({
        formcontrol: {
                margin: theme.spacing(2, 0),
        },
})

function ObjScale(props) {
        const {path} = props
	const { auth } = useUser()
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
	const classes = useClasses(useStyles)

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
			auth
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
