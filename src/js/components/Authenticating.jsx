import React from "react"
import { useTranslation } from "react-i18next"
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

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
					{t("You are being redirected to the openid provider.")}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => location.reload()}>
					{t("Reload")}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default Authenticating
