import React, { useState } from "react";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
        selected: {
                cursor: "pointer",
        },
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
	paper: {
		width: '80%',
		maxHeight: 435,
	},

})

function TemplateSelectorDialog(props) {
	const classes = useClasses(styles)
	const [search, setSearch] = useState("")
	function handleCancel(e, m) {
		props.handleClose()
	}
	function handleOk(e, m) {
		props.onChange(m)
		props.handleClose()
	}
	function handleEntering(e) {
		console.log(e)
	}

	if (search.length > 0) {
		var re = RegExp(search, "i")
		var options = props.options.filter(item => item.name.match(re))
	} else {
		var options = props.options
	}
	return (
		<Dialog
			disableBackdropClick
			maxWidth="xs"
			onEntering={handleEntering}
			aria-labelledby="confirmation-dialog-title"
			open={props.open}
			onClose={handleCancel}
		>
			<DialogTitle id="confirmation-dialog-title">Template</DialogTitle>
			<DialogContent dividers>
				<TextField
					fullWidth
					id="search"
					label="Search Regular Expression"
					type="search"
					margin="normal"
					variant="outlined"
					onChange={(e) => {setSearch(e.target.value)}}
					value={search}
				/>
				<List>
					{options.map((t, i) => (
						<TemplateSelectorItem
							key={i}
							template={t}
							onChange={props.onChange}
							handleClose={props.handleClose}
						/>
					))}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	)
}

function TemplateSelector(props) {
	console.log("TemplateSelector, props", props)
	if (props.options === undefined) {
		return null
	}
	const classes = useClasses(styles)
	const [open, setOpen] = React.useState(false)

	function handleClickOpen(e) {
		e.stopPropagation()
		setOpen(true)
	}
	function handleClose(e) {
		setOpen(false)
	}
	return (
		<React.Fragment>
                        <div className={classes.selected} onClick={handleClickOpen}>
                                <Typography variant="caption" color="textSecondary">Template</Typography>
                                {props.selected ?
                                <Typography component="div">{props.selected.name}</Typography> 
                                :
                                <Typography component="div" color="textSecondary">Click</Typography>
                                }
                        </div>
			<TemplateSelectorDialog
				onChange={props.onChange}
				selected={props.selected}
				options={props.options}
				handleClose={handleClose}
				open={open}
			/>
		</React.Fragment>
	)
}

function TemplateSelectorItem(props) {
	function handleClick(e) {
		props.onChange(props.template)
		props.handleClose()
	}
	return (
		<ListItem button onClick={handleClick}>
			<ListItemText
				primary={props.template.name}
				secondary={props.template.desc}
			/>
		</ListItem>
	)
}

export {
	TemplateSelector,
}
