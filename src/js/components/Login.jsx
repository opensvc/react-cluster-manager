import React, {useState} from "react"
import { useTranslation } from "react-i18next"
import { useStateValue } from "../state.js"

import FormControl from "@mui/material/FormControl"
import TextField from "@mui/material/TextField"
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import useClasses from "../hooks/useClasses.jsx";


const useStyles = theme => ({
        control: {
		marginBottom: theme.spacing(2),
	},
        root: {
		marginTop: theme.spacing(4),
        }
})

function Login(props) {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [{ basicLogin }, dispatch] = useStateValue()
	const { t, i18n } = useTranslation()
	const classes = useClasses(useStyles)

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
                                <Button onClick={handleSubmit} disabled={!username || !password} color="primary">
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
