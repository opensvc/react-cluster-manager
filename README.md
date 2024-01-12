The OpenSVC Cluster Management React Application.

The bundle produced by 'npm run build' can be served by the agent daemon
when installed in:

* Agent installation from package:
  /usr/share/opensvc/html/

* Agent installation from source:
  /opt/opensvc/usr/share/html/

# How to contribute ?

  Create pull request from latest branch (example v7)

# How to release new patch on minor version ?

  * checkout v7 branch HEAD commit
    * Execute `npm version minor|patch`
      - The version in `packages*.json` is bumped and the change is committed
      - The new version is git tagged
    * Push to github
      - The github workflow release is triggered
        It will create new github release with bundle and debug bundle assets

# How to release new major version ?

  * checkout the new branch from current latest branch (example from branch v7 create v8 branch)
  * commit changes
  * create PR for the new v8 (a new github branch)
  * merge PR if tests pass
  * `git pull --ff-only upstream v8`
  * Execute `npm version major`
    - The version in `packages*.json` is bumped and the change is committed
    - The new version is git tagged
  * Push the new tag to github upstream v8 
    - The github workflow release is triggered
      It will create new github release with bundle and debug bundle assets
