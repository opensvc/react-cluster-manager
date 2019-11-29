import React, {useState} from "react"
import { useTranslation } from "react-i18next"
import { useStateValue } from "../state.js"

import { makeStyles } from "@material-ui/core/styles"
import FormControl from "@material-ui/core/FormControl"
import TextField from "@material-ui/core/TextField"
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'


const useStyles = makeStyles(theme => ({
        control: {
		marginBottom: theme.spacing(2),
	},
        root: {
		marginTop: theme.spacing(4),
        }
}))

function Login(props) {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [{ basicLogin }, dispatch] = useStateValue()
	const { t, i18n } = useTranslation()
	const classes = useStyles()

	function handleSubmit(e) {
		dispatch({
			type: "setBasicLogin",
			data: {"username": username, "password": password},
		})
	}
	function handleEnterKeyDown(e){
		if(e.keyCode == 13) {
			handleSubmit(e)
		}
	}
	function handleChangeMethod(e) {
		dispatch({type: "setAuthChoice", data: ""})
	}

	return (
                <Dialog
                        open={true}
                        aria-labelledby="dialog-title"
                >
                        <DialogTitle id="dialog-title">
                                {t("Login")}
                        </DialogTitle>
                        <DialogContent>
				<FormControl className={classes.control} fullWidth>
					<TextField
						placeholder={t("Username")}
						autoFocus={true}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</FormControl>
				<FormControl className={classes.control} fullWidth>
					<TextField
						className={classes.input}
						type="password"
						placeholder={t("password")}
						onChange={(e) => setPassword(e.target.value)}
						onKeyDown={handleEnterKeyDown}
					/>
				</FormControl>
                        </DialogContent>
                        <DialogActions>
                                <Button onClick={handleSubmit}>
                                        {t("Submit")}
                                </Button>
                                <Button onClick={handleChangeMethod}>
                                        {t("Change Method")}
                                </Button>
                        </DialogActions>
                </Dialog>
	)
}

export default Login
