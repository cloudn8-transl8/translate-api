#!/bin/bash -e

cat <<EOF > ./k8sconfig/kustomization.yaml
---
resources:
- app.yaml

images:
- name: nicholasjackson/translate-api
  newTag: ${CIRCLE_SHA1}
EOF
