#!/bin/bash -e

cat <<EOF > ./k8sconfig/kustomization.yaml
---
resources:
- app.yaml
- dashboard.yaml
- canary.yaml
- loadtest.yaml
- service-resolver.yaml

images:
- name: nicholasjackson/translate-api
  newTag: ${CIRCLE_SHA1}
EOF
