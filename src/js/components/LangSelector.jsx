import React from "react";
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useClasses from "../hooks/useClasses.jsx";

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

const styles = theme => ({
	formControl: {
		margin: theme.spacing(1),
	},
})

function LangSelector(props) {
	const classes = useClasses(styles);
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
