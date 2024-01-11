import React from "react";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
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
});

function CatalogSelectorDialog(props) {
	const classes = useClasses(styles)
	if (!props.options) {
		return null
	}
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
			onClose={handleCancel}
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
