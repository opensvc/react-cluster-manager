import React from "react"
import { useTranslation } from "react-i18next"
import useAuthInfo from "../hooks/AuthInfo.jsx"
import { useStateValue } from '../state.js'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

function NotAuthorized(props) {
	const {i18n, t} = useTranslation()
        const authInfo = useAuthInfo()
        const [{ authChoice }, dispatch] = useStateValue()

	return (
		<Dialog
			open={true}
			aria-labelledby="dialog-title"
		>
			<DialogTitle id="dialog-title">
				{authChoice}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{t("You are not authorized. Choose another authentication method, or another user certificate.")}
				</DialogContentText>
			</DialogContent>
                        <DialogActions>
                                {authInfo && authInfo.openid && authInfo.openid.well_known_uri &&
                                <Button onClick={() => dispatch({type: "setAuthChoice", data: "openid"})}>
                                        OpenId
                                </Button>
                                }
                                <Button onClick={() => dispatch({type: "setAuthChoice", data: "x509"})}>
                                        x509
                                </Button>
                        </DialogActions>
		</Dialog>
	)
}

export default NotAuthorized
