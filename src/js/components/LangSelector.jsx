import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';

import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
				color="primary"
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

export default LangSelector
