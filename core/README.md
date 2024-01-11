# home-iac

Infrastructure as Code to be used in my "homelab"

## To Run / Install First Time

```shell
GITHUB_SECRET="GITHUB_SECRET" && echo "$GITHUB_SECRET" > github_secret.txt && echo "cat $(pwd)/github_secret.txt" > askpass.sh && chmod +x ./askpass.sh && git clone https://msg138@github.com/msg138/home-iac.git --config core.askpass="$(pwd)/askpass.sh"
```

Replace GITHUB_SECRET with secret token.

Any further git fetches triggered by the webhook assume the creation of this secret file.

Then run 
```shell
cd home-iac
./scripts/setup/setup_centos7.sh
```


## Notes

/
.cache/
- Should be included in the git ignore.
- Should be used for temporary files used on the host.
- For example: Last updated file timestamps, in order to determine only the changed configurations / custom images.
custom-image/
configurations/
services/
build-webhook/
setup-webhook.js
webhook.js
scripts/
build.js
- Behaviour goals
- build all directories from custom-image directory into custom docker images.
- Whenever a custom-image is built. IF there are any json files that use the image in the image string,
OR grepped from the composure files, we should restart the composure or individual docker service to use the new.
run.js
- On each run:
- compile array of both directories and files inside configurations folder.
- Each file is considered to be in json format of the following schema:
{
"identifier": "unique string to identify this container",
"image": "docker image string",
"expose": {
"internal-port as string": "external port as string"
},
"disabled": boolean
"volume": {
"volume name that will be prefixed with './storage/{json-file-without-extension}/' of parent directory": "location on docker container"
}
}
- On first run:
- Start all files and directories according to the above mentioned.
- Write to running.json in the .cache directory with schema:
{
"containers": {
"json file name": timestamp as number,
},
"composures": {
// TODO When working on this, will need to find a reliable way to determine changes within a compose directory.
"directory name": timestamp as number,
},
}
- On subsequent runs:
- For any containers whose json file has updated since the timestamp in running.json, kill and restart.
- For any composures whose timestamp has been updated, kill all and restart.
- Rewrite to running.json with new cache of timestamps.
- If a json has disabled to true, we should kill and not restart.
setup-debian8.sh
storage/
.empty - This directory will be included in the .gitignore but should be used by images / volumes of docker containers.
utility/
ANY CLASSES OR UTILITIES GO HERE
package.json
- build:all - Build all custom images
- run:all - Run all docker configurations
- Allowed Dependencies:
- dotenv
- node:test <- Just putting here so we dont install jest or mocha.
- node:http
- typescript



// TODO Tasks
- Create Setup script to do the following:
    - Install docker
    - Install docker-compose
    - Install nodejs
    - Setup SSH to private port as defined.
        - Create an SSH key (prompt for passkey if necessary)
        - Enable ssh key access only over ssh port
    - Install ufw
        - Need to configure ufw to ONLY allow to ssh
    - Setup firewall
    - npm install
    - Assist with initializing github webhook so that it reruns on each push to master / main branch.
        - Generate the secret token, and print to the console and save into .env file to be read by webhook.js
    - Setup webhook.js as a systemctl service
        - Webhook will:
            - Receive GET param of action and identifier
                - action = restart
                    - Will restart the configuration as identified with identifier
                - action = rebuild
                    - Will rebuild the custom-image as identified with identifier (identifier is the folder)
                    - Will restart any configuration that is using the rebuilt image.
            - If both are null / undefined:
                - git pull
                - npm install
                - Re run build.js for any changes.
                - Re run run.js for any changes.

- Create run all script that will do the following:
    - Go through the files / directories inside the configurations directory.
    - For each file, will create single docker container
    - For each directory, will cd into the directory and run docker compose to bring up the set of services.
