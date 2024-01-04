import { makeStyles } from '@mui/styles';

const useBgColorStyles = makeStyles(theme => ({
        "optimal": {
                backgroundColor: theme.status.up,
        },
        "danger": {
                backgroundColor: theme.status.danger,
        },
        "warning": {
                backgroundColor: theme.status.warning,
        },
        "n/a": {
                backgroundColor: theme.status.notapplicable,
        },
}))

const useColorStyles = makeStyles(theme => ({
        "running": {
                color: theme.status.up,
        },
        "up": {
                color: theme.status.up,
        },
        "stdby up": {
                color: theme.status.up,
        },
        "danger": {
                color: theme.status.danger,
        },
        "down": {
                color: theme.status.danger,
        },
        "stopped": {
                color: theme.status.danger,
        },
        "stdby down": {
                color: theme.status.danger,
        },
        "warning": {
                color: theme.status.warning,
        },
        "warn": {
                color: theme.status.warning,
        },
        "n/a": {
                color: theme.status.notapplicable,
        },
        "undef": {
                color: theme.status.notapplicable,
        },
}))


export {
	useColorStyles,
	useBgColorStyles
}
