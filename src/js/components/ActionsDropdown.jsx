import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { Progress, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const MenuContext = React.createContext({section: {}})

function ActionsDropdownDivider(props) {
	return (
		<DropdownItem divider />
	)
}

function ActionsDropdown(props) {
	const [isOpen, setIsOpen] = useState(false)

	return (
                <MenuContext.Provider value={{menu: props, toggle: () => {setIsOpen(isOpen ? false : true)}}}>
			<div onClick={(e) => {e.stopPropagation()}}>
				<Dropdown size="sm" isOpen={isOpen} toggle={() => {setIsOpen(isOpen ? false : true)}}>
					<DropdownToggle caret color="outline-secondary">{props.title}</DropdownToggle>
					<DropdownMenu>
						{props.children}
					</DropdownMenu>
				</Dropdown>
			</div>
		</MenuContext.Provider>
	)
}

function ActionsDropdownSection(props) {
        return (
		<MenuContext.Consumer>
			{({ menu, toggle }) => (
				<MenuContext.Provider value={{section: props, menu: menu, toggle: toggle}}>
					<div className={"border-left-4 border-"+props.color}>
						{props.children}
					</div>
				</MenuContext.Provider>
			)}
		</MenuContext.Consumer>
        )
}

function ActionsDropdownItemWrapped(props) {
	const [confirms, setConfirms] = useState(props.section.confirms)
	const [{user}, dispatch] = useStateValue()
	function handleClick(e) {
		if (confirms>1) {
			setConfirms(confirms-1)
			return
		}
		setConfirms(props.section.confirms)
		props.toggleIsOpen()
		props.menu.submit(props)
	}
	function disabled() {
		if (props.disabled) {
			return true
		}
		if (props.requires === undefined) {
			return false
		}
		if (user.grant === undefined) {
			// not initialized yet
			return true
		}
		if (props.requires.role && !(props.requires.role in user.grant)) {
			//console.log("item", props.value, "disabled: user must have the", props.requires.role, "role")
			return true
		}
		if (props.requires.namespace && !user.grant[props.requires.role].includes(props.requires.namespace)) {
			//console.log("item", props.value, "disabled: user is not", props.requires.role, "on namespace", props.requires.namespace)
			return true
		}
		return false
	}
	if (confirms < props.section.confirms) {
		return (
			<DropdownItem toggle={false} disabled={disabled()} onClick={handleClick}>
				{props.text}
				<div className="pl-1 text-small text-secondary">This action is <b>{props.section.name}</b>.</div>
				<div className="pl-1 text-small text-secondary">{confirms} more confirmation clicks required.</div>
				<Progress color={props.section.color} value={100*(props.section.confirms-confirms)/props.section.confirms} />
			</DropdownItem>
		)
	}
	return (
		<DropdownItem toggle={false} disabled={disabled()} onClick={handleClick}>{props.text}</DropdownItem>
	)
}

function ActionsDropdownItem(props) {
	return (
		<MenuContext.Consumer>
			{({ menu, section, toggle }) => (
				<ActionsDropdownItemWrapped
					value={props.value}
					text={props.text}
					disabled={props.disabled}
					requires={props.requires}
					toggle={false}
					toggleIsOpen={toggle}
					menu={menu}
					section={section}
				/>
			)}
		</MenuContext.Consumer>
	)
}

export {
	ActionsDropdown,
	ActionsDropdownSection,
	ActionsDropdownItem,
	ActionsDropdownDivider
}
