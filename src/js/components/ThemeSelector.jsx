import React from "react"
import { useTranslation } from 'react-i18next'
import { useStateValue } from '../state.js'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import useClasses from "../hooks/useClasses.jsx";

const themes = [
	"dark",
	"light",
]

const useStyles = theme => ({
	formControl: {
		margin: theme.spacing(1),
	},
});

function ThemeSelector(props) {
	const classes = useClasses(useStyles);
	const [anchorEl, setAnchorEl] = React.useState(null)
        const { t, i18n } = useTranslation()
	const [{ theme }, dispatch] = useStateValue()

	function handleClick(event) {
		setAnchorEl(event.currentTarget)
	}
	function handleClose(event) {
		setAnchorEl(null)
	}
	function handleChange(i) {
		dispatch({type: "setTheme", data: i})
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
				{theme}
				<KeyboardArrowDownIcon />
			</Button>
			<Menu
				id="language"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{themes.map((i) => (
					<MenuItem key={i} onClick={() => handleChange(i)}>{t(i)}</MenuItem>
				))}
			</Menu>
		</React.Fragment>
	)
}

export default ThemeSelector
