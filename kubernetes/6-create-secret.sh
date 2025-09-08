kubectl delete secret -n production account-secret
kubectl create -n production secret tls account-secret --key web.balsen.loc.key --cert=web.balsen.loc.crt
