import React from "react"
import { useTranslation } from "react-i18next"
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

function Authenticating(props) {
	const {i18n, t} = useTranslation()
	return (
		<Dialog
			open={true}
			aria-labelledby="dialog-title"
		>
			<DialogTitle id="dialog-title">
				{t("Authentication")}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{t("Authentication in progress. You will be redirected to the openid provider.")}
				</DialogContentText>
			</DialogContent>
		</Dialog>
	)
}

export default Authenticating
