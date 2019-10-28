import React from "react"
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	biasContainer: {
		textAlign: "center",
	},
	biasContent: {
		width: "4em",
		display: "inline",
	},
	hline: {
		height: "0.6em",
		lineHeight: "0.6em",
	},
	hlabel: {
		display: "inline-block",
		width: "1.3em",
		lineHeight: "0.6em",
		color: theme.palette.text.secondary,
		fontSize: "0.6em",
		verticalAlign: "middle",
	},
	hbarContainer: {
		display: "inline-block",
		width: "2.7em",
		verticalAlign: "middle",
	},
	hbar: {
		height: "0.3em",
		background: theme.palette.primary.main,
		borderLeftWidth: "1px",
		borderLeftStyle: "solid",
		borderLeftColor: theme.palette.primary.main,
		transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
	},
}))

function HorizontalBars(props) {
	const { values } = props
	const classes = useStyles()
	var sum = 0
	for (var value of values) {
		sum += value.value
	}
	function pct(v) {
		if (!sum) {
			return "1px"
		}
		return (100 * v / sum) + "%"
	}
	return (
		<div className={classes.biasContainer}>
			<div className={classes.biasContent}>
				{values.map((value, i) => (
					<div className={classes.hline}>
						<div className={classes.hlabel}>
							{value.label}
						</div>
						<div className={classes.hbarContainer}>
							<div className={classes.hbar} style={{width: pct(value.value)}}>
								&nbsp;
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default HorizontalBars
