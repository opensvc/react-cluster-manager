import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';

const useStyles = makeStyles(theme => ({
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

}))

function TemplateSelectorDialog(props) {
	const classes = useStyles()
	const [search, setSearch] = useState()
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

	if (search) {
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
	if (props.options === undefined) {
		return null
	}
	const classes = useStyles()
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
