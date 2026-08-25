#!/usr/bin/env bash
# Vercel "Ignored Build Step" — controls whether a deployment build runs at all.
#
# Goal: only build Preview deployments for branches that already have an open
# PR (so a WIP push with no PR yet doesn't burn a build), while Production
# deployments (merges to the production branch) always proceed regardless.
#
# Exit 0 = skip this deployment. Exit 1+ = proceed.
#
# Requires "Automatically Expose System Environment Variables" checked under
# Project Settings -> Environment Variables, so $VERCEL_ENV and
# $VERCEL_GIT_PULL_REQUEST_ID are actually populated when this runs.

if [ "$VERCEL_ENV" == "production" ]; then
  echo "Production deploy — proceeding."
  exit 1
fi

if [ -z "$VERCEL_GIT_PULL_REQUEST_ID" ]; then
  echo "No open PR for branch '$VERCEL_GIT_COMMIT_REF' yet — skipping preview build."
  exit 0
fi

echo "Open PR #$VERCEL_GIT_PULL_REQUEST_ID on '$VERCEL_GIT_COMMIT_REF' — proceeding with preview build."
exit 1
