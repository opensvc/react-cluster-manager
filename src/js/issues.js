import { state, mergeStates } from "./utils.js";

//
// Issue finders
//
function compatIssue(cstat) {
	if (!("monitor" in cstat)) {
		return state.NOTAPPLICABLE
	}
	if (cstat.monitor.compat == false) {
		return state.DANGER
	}
	return state.OPTIMAL
}

function versionIssue(cstat) {
	var version_aligned = true
	var version
	if (!("monitor" in cstat)) {
		return state.NOTAPPLICABLE
	}
	for (var node in cstat.monitor.nodes) {
		if (version && (version != cstat.monitor.nodes[node].agent)) {
			return state.WARNING
		}
		version = cstat.monitor.nodes[node].agent
	}
	return state.OPTIMAL
}

function threadsIssue(cstat) {
	var threads = ["listener", "dns", "monitor", "scheduler"]
 	for (var section in cstat) {
		if (section.match(/^hb#/)) {
			threads.push(section)
		}
	}
	for (var i=0; i<threads.length; i++) {
		if (!(threads[i] in cstat)) {
			continue
		}
		if (cstat[threads[i]].state != "running") {
			return state.DANGER
		}
	}
	return state.OPTIMAL
}

function arbitratorsIssue(cstat) {
	if (!("monitor" in cstat)) {
		return state.NOTAPPLICABLE
	}
        for (var node in cstat.monitor.nodes) {
		var ndata = cstat.monitor.nodes[node]
		if (!ndata.arbitrators) {
			continue
		}
		for (var arbitrator in ndata.arbitrators) {
			var adata = ndata.arbitrators[arbitrator]
			if (adata.status != "up") {
				return state.WARNING
			}
		}
	}
	return state.OPTIMAL
}

function heartbeatsIssue(cstat) {
	var hbname
	var peer
	var hbCount = 0
	var hbError = 0
        for (hbname in cstat) {
		if (!/^hb#/.test(hbname)) {
			continue
		}
		hbCount += 1
		var hbdata = cstat[hbname]
		if (hbdata.state != "running") {
			hbError += 1
			break
		}
		for (peer in hbdata.peers) {
			var pdata = hbdata.peers[peer]
			if (pdata.beating == false) {
				hbError += 1
				break
			} else if (pdata.beating == true) {
				continue
			} else {
				// self
				continue
			}
		}
	}
	if (hbCount == 0) {
		return state.OPTIMAL
	}
	if (hbError == hbCount) {
		return state.DANGER
	}
	if (hbError == 0) {
		return state.OPTIMAL
	}
	return state.WARNING
}

function objectInstanceIssue(cstat, path, node) {
	var idata = cstat.monitor.nodes[node].services.status[path]
	if (idata === undefined) {
		// no instance of path on node
		return state.NOTAPPLICABLE
	}
	if (idata.monitor === undefined) {
		return state.NOTAPPLICABLE
	}
	if (idata.monitor.status.match(/failed/)) {
		return state.WARNING
	}
	return state.OPTIMAL
}

function objectInstancesIssue(cstat, path) {
	var s = state.OPTIMAL
	for (var node in cstat.monitor.nodes) {
		s = mergeStates(s, objectInstanceIssue(cstat, path, node))
	}
	return s
}

function objectIssue(cstat, path) {
	var odata = cstat.monitor.services[path]
	if (odata.avail === undefined) {
		return state.NOTAPPLICABLE
	}
	if (odata.avail == "down") {
		return state.DANGER
	}
	if (odata.avail == "warn") {
		return state.WARNING
	}
	if (odata.overall == "warn") {
		return state.WARNING
	}
	if (odata.placement == "non-optimal") {
		return state.WARNING
	}
	return state.OPTIMAL
}

function objectsIssue(cstat) {
	if (cstat.monitor === undefined) {
		return state.NOTAPPLICABLE
	}
	var s = state.OPTIMAL
	for (var path in cstat.monitor.services) {
		s = mergeStates(s, objectIssue(cstat, path))
		s = mergeStates(s, objectInstancesIssue(cstat, path))
	}
	return s
}

function nodesIssue(cstat) {
	var s = compatIssue(cstat)
	s = mergeStates(s, versionIssue(cstat))
	return s
}

function clusterIssue(cstat) {
	var s = nodesIssue(cstat)
	s = mergeStates(s, threadsIssue(cstat))
	s = mergeStates(s, versionIssue(cstat))
	s = mergeStates(s, arbitratorsIssue(cstat))
	s = mergeStates(s, heartbeatsIssue(cstat))
	s = mergeStates(s, objectsIssue(cstat))
	return s
}

export {
	compatIssue,
	versionIssue,
	threadsIssue,
	arbitratorsIssue,
	heartbeatsIssue,
	nodesIssue,
	objectsIssue,
	clusterIssue
}
