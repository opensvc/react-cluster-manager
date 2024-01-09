import React from "react";
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ErrorIcon from '@mui/icons-material/Error';
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
        root: {
                marginTop: theme.spacing(3),
                padding: theme.spacing(3),
        },
})

function NotFound(props) {
	const { t, i18n } = useTranslation()
	const classes = useClasses(styles)
        return (
		<Paper className={classes.root}>
			<Typography component="div" variant="h2" align="center">
				<ErrorIcon fontSize="large" color="secondary" />
			</Typography>
			<Typography component="div" variant="subtitle1" align="center">
				{t("Page Not Found")}
			</Typography>
		</Paper>
        )
}

export {
	NotFound
}
