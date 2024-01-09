import React, { useState } from "react";
import useUser from "../hooks/User.jsx"
import { useTranslation } from 'react-i18next';
import { useStateValue } from '../state.js';
import { splitPath } from '../utils.js';
import { apiInstanceAction } from "../api.js"
import useApiResponse from "../hooks/ApiResponse.jsx"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function SectionDelete(props) {
	const {path, rid} = props
        const sp = splitPath(path)
	const { dispatchAlerts } = useApiResponse()

        if (["vol", "svc"].indexOf(sp.kind) < 0) {
                return null
        }

	const { auth } = useUser()
	const [open, setOpen] = useState(false)
	const { t, i18n } = useTranslation()
	const [{}, dispatch] = useStateValue()
        function handleClick(e) {
                e.stopPropagation()
                setOpen(true)
        }
        function handleClose(e) {
                setOpen(false)
        }
        function handleSubmit() {
		var _data = {
			rid: rid,
		}
		var ok = "Resource " + rid + " deleted."
                apiInstanceAction("ANY", path, "delete", _data, ($) => dispatchAlerts({
                        ok: ok,
                        data: $
                }), auth)
		handleClose()
	}

	return (
		<React.Fragment>
			<DeleteForeverIcon color="action" onClick={handleClick} />
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">
					{t("Delete section {{rid}} of {{path}}", {rid: rid, path: path})}
				</DialogTitle>
                                <DialogContent>
					{t("delete_resource")}
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
	SectionDelete,
}
