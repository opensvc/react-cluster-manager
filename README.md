The OpenSVC Cluster Management React Application.

The bundle produced by 'npm run build' can be served by the agent daemon
when installed in:

* Agent installation from package:
  /usr/share/opensvc/html/

* Agent installation from source:
  /opt/opensvc/usr/share/html/


# Releasing

* Patch and commit
* Execute `npm version major|minor|patch`
  - The version in `packages*.json` is bumped and the change is commited
  - The new version is git tagged
* Push to github
  - The github workflow is triggered
  - A release is created
  - The bundle and debug bundle assets are created
