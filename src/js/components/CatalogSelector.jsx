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

function CatalogSelectorDialog(props) {
	const classes = useStyles()
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

	return (
		<Dialog
			disableBackdropClick
			maxWidth="xs"
			onEntering={handleEntering}
			aria-labelledby="confirmation-dialog-title"
			open={props.open}
		>
			<DialogTitle id="confirmation-dialog-title">Catalog</DialogTitle>
			<DialogContent dividers>
				<List>
					{props.options.map((c, i) => (
						<CatalogSelectorItem
							key={i}
							catalog={c}
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

function CatalogSelector(props) {
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
				<Typography variant="caption" color="textSecondary">Catalog</Typography>
				{props.selected ?
				<Typography component="div">{props.selected.name}</Typography>
				:
				<Typography component="div" color="textSecondary">Click</Typography>
				}
			</div>
			<CatalogSelectorDialog
				onChange={props.onChange}
				selected={props.selected}
				options={props.options}
				handleClose={handleClose}
				open={open}
			/>
		</React.Fragment>
	)
}

function CatalogSelectorItem(props) {
	function handleClick(e) {
		props.onChange(props.catalog)
		props.handleClose()
	}
	return (
		<ListItem button onClick={handleClick}>
			<ListItemText
				primary={props.catalog.name}
				secondary={props.catalog.desc}
			/>
		</ListItem>
	)
}

export {
	CatalogSelector,
}
