import React, { useState } from "react";

import {useKeyGet} from '../hooks/KeyGet.jsx';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

function KeyData(props) {
	const {path, keyName} = props
	const data = useKeyGet({path: path, keyName: keyName})
	return (
		<Typography component="div" color="textSecondary">
			<pre>
				{data}
			</pre>
		</Typography>
	)
}

function KeyDecode(props) {
	const {path, keyName} = props
	const [open, setOpen] = React.useState(false)
        function handleOpen(e) {
                e.stopPropagation()
                setOpen(true)
        }
        function handleClose(e) {
                setOpen(false)
        }
	return (
		<React.Fragment>
			<Button onClick={handleOpen}>
				Decode
			</Button>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">{keyName}</DialogTitle>
                                <DialogContent>
					<KeyData path={path} keyName={keyName} />
                                </DialogContent>
                                <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                                Dismiss
                                        </Button>
                                </DialogActions>
                        </Dialog>
		</React.Fragment>
	)
}

export {
	KeyDecode,
}
