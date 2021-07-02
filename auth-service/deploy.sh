docker build -t beepchat/beep-auth-service:dep-less -f Dockerfile.depless .

docker push beepchat/beep-auth-service:dep-less

kubectl delete -f ~/proj/beep/k8s/auth

kubectl apply -f ~/proj/beep/k8s/auth
