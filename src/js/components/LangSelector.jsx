import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';

import LanguageIcon from '@material-ui/icons/Language';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const languages = [
	{
		title: "en",
		code: "en",
	},
	{
		title: "fr",
		code: "fr",
	},
]

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
	},
}))

function LangSelector(props) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null)
        const { t, i18n } = useTranslation()

	function handleClick(event) {
		setAnchorEl(event.currentTarget)
	}
	function handleClose(event) {
		setAnchorEl(null)
	}
	function handleChange(lng) {
		i18n.changeLanguage(lng)
		setAnchorEl(null)
	}

	return (
		<React.Fragment>
			<Button
				aria-controls="language"
				aria-haspopup="true"
				color="inherit"
				onClick={handleClick}
			>
				{i18n.languages[0]}
				<KeyboardArrowDownIcon />
			</Button>
			<Menu
				id="language"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{languages.map((l, i) => (
					<MenuItem key={i} onClick={() => handleChange(l.code)}>{l.title}</MenuItem>
				))}
			</Menu>
		</React.Fragment>
	)
}

export {
	LangSelector
}
