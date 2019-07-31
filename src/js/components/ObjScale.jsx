import React, { useState } from "react";

import { apiInstanceAction } from "../api.js"
import { useStateValue } from '../state.js';

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
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
        fab: {
                marginTop: theme.spacing(2),
        },
}))

function ObjScale(props) {
        const {path} = props
	const [{ cstat }, dispatch] = useStateValue();

	if (cstat.monitor === undefined) {
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
			(data) => dispatch({type: "parseApiResponse", data: data})
		)
		handleClose()
	}
	return (
                <React.Fragment>
                        <Fab
                                color="primary"
                                onClick={handleClickOpen}
				className={classes.fab}
                        >
                                <LinearScaleIcon />
                        </Fab>
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
