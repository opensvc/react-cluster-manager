#!/bin/bash

set -a

echo "######  OpenSVC deployment script  ######"
echo

SSH="ssh -i ${PRIVATE_RSA} ${DEPLOY_USER}@${DEPLOY_NODE}"
SCP="scp -i ${PRIVATE_RSA}"
REPO_ROOT="/var/www/repo.opensvc.com/cluster-manager"

BUNDLE_VERSION=$1

[[ -z ${BUNDLE_VERSION} ]] && {
	echo "Error: bundle version is expected as argument."
        echo "       $0 1.2.3"
	echo "Exiting"
        exit 1
}

function _ssh()
{
   cmd="$@"
   $SSH "$cmd"
   ret=$?
   if [ $ret -ne 0 ]; then
      echo "error cmd[$cmd] ret[$ret]" >&2
      exit $ret
   fi
}

function timestamp()
{
 date +"%Y-%m-%d %T" --utc
}

function _echo()
{
   msg="$@"
   echo
   echo "[UTC $(timestamp)] $msg"
}

_echo "=> deploying bundle version ${BUNDLE_VERSION}"

_ssh 'test -d $HOME/react-work-area || /bin/mkdir $HOME/react-work-area'
_ssh 'cd $HOME/react-work-area ; git clone $HOME/opensvc'

API_VERSION=$($SSH "grep ^API_VERSION \$HOME/react-work-area/opensvc/lib/osvcd_shared.py | awk '{print \$3}'")
_echo "=> target api version <${API_VERSION}>"
_ssh 'cd $HOME/react-work-area && rm -rf opensvc'

BUNDLE_DIR="$REPO_ROOT/$API_VERSION/$BUNDLE_VERSION"
_echo "=> creating target repo <$BUNDLE_DIR>"
_ssh "test -d $BUNDLE_DIR || mkdir -p $BUNDLE_DIR"

_echo "=> creating tar.gz bundle in <$BUNDLE_DIR>"
(cd dist; tar -czf - .) | $SSH "cat > $BUNDLE_DIR/bundle"

_echo "=> displaying bundle content in <${DEPLOY_NODE}:$BUNDLE_DIR>"
_ssh "tar tzvf $BUNDLE_DIR/bundle"

API_LATEST=$($SSH "cd $BUNDLE_DIR/.. && ls -1 | grep -v latest | tail -1")
_echo "=> latest entry in $REPO_ROOT/$API_VERSION is $API_LATEST"

_echo "=> creating latest symlink in $REPO_ROOT/$API_VERSION"
_ssh "cd $REPO_ROOT/$API_VERSION && ln -sf $API_LATEST/bundle latest && ls -l $REPO_ROOT/$API_VERSION/latest"

ROOT_LATEST=$($SSH "cd $REPO_ROOT && ls -1 | grep -v latest | sort -n | tail -1")
_echo "=> creating latest symlink in $REPO_ROOT"
_ssh "cd $REPO_ROOT && ln -sf $ROOT_LATEST/latest latest && ls -l $REPO_ROOT/latest"
