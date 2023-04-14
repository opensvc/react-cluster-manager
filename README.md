The OpenSVC Cluster Management React Application.

The bundle produced by 'npm run build' can be served by the agent daemon
when installed in:

* Agent installation from package:
  /usr/share/opensvc/html/

* Agent installation from source:
  /opt/opensvc/usr/share/html/


# Releasing

* patch and commit
* execute `npm version major|minor|patch`
  => bumps the version in `packages*.json` and commits
  => create a new tag for the new version
* push to github
  => the github workflow is triggered
  => a release is created
  => bundle and debug bundle assets are created
