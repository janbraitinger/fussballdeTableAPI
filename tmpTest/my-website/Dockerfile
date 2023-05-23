
6
Jump to Comments


8
Save

Cindy Le
Cindy Le
Posted on 8. März 2022
  8   4  
How to Dockerize a Docusaurus v2 application
#
docker
#
docs
#
opensource
Let's get started with the most basic Docusaurus application.

Getting started with Docusaurus
Create a new Docusaurus site
npx create-docusaurus@latest my-website classic
Your directory structure should look like this:

Directory structure

Start the site:
cd my-website
npx docusaurus start
Open http://localhost:3000. Once you see that your website is running locally you can close the server then proceed to the next section.
Adding the Dockerfile
Add the host flag to the start and serve scripts in the package.json file
  "scripts": {
    "docusaurus": "docusaurus",
--  "start": "docusaurus start",
++  "start": "docusaurus start --host 0.0.0.0",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "clear": "docusaurus clear",
--  "serve": "docusaurus serve",
++  "serve": "docusaurus serve --host 0.0.0.0",
    "write-translations": "docusaurus write-translations",
    "write-heading-ids": "docusaurus write-heading-ids"
  },
Create a new file called Dockerfile in the root of the project
## Base ########################################################################
# Use a larger node image to do the build for native deps (e.g., gcc, python)
FROM node:lts as base

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /home/node/app
# Copy the source code over
COPY --chown=node:node . /home/node/app/

## Development #################################################################
# Define a development target that installs devDeps and runs in dev mode
FROM base as development
WORKDIR /home/node/app
# Install (not ci) with dependencies, and for Linux vs. Linux Musl (which we use for -alpine)
RUN npm install
# Switch to the node user vs. root
USER node
# Expose port 3000
EXPOSE 3000
# Start the app in debug mode so we can attach the debugger
CMD ["npm", "start"]

## Production ##################################################################
# Also define a production target which doesn't use devDeps
FROM base as production
WORKDIR /home/node/app
COPY --chown=node:node --from=development /home/node/app/node_modules /home/node/app/node_modules
# Build the Docusaurus app
RUN npm run build

## Deploy ######################################################################
# Use a stable nginx image
FROM nginx:stable-alpine as deploy
WORKDIR /home/node/app
# Copy what we've installed/built from production
COPY --chown=node:node --from=production /home/node/app/build /usr/share/nginx/html/
Working with Docker container in development
To build the Docker container for development, run
docker build --target development -t docs:dev .
To run the Docker container in development, run
docker run -p 3000:3000 docs:dev
Note: Remember to stop the container before proceeding to the next step

Working with Docker container in production
To build the Docker container for production, run
docker build -t docusaurus:latest .
To run the Docker container in production, run
docker run --rm -p 3000:80 docusaurus:latest
Top comments (6)

Subscribe
pic

 
 
grodrigo profile image
grodrigo
•
21. März • Edited on 21. März

I was getting this error in the development mode
ERROR [development 2/5] RUN mkdir -p /home/node/app/.docusaurus

If anyone is getting the same error, just put the line USER node before the WORKDIR /home/node/app in the base stage, so the folder will be owned by node.
In addition, you can remove both lines of the development stage.

And to run the container maybe for development is better to use it with a volume and with a container name like docker run --rm --name docusaurus -p 3000:3000 -v ./:/home/node/app/ docs:dev
Thanks for this post!

1
 like
Like

Reply
 
 
danroscigno profile image
Dan Roscigno
•
2. Mai 22

Hi Cindy,
Thanks for this. I made one change as I saw that the node_modules/.cache dir could not be created (I think docusaurus writes there) at runtime. Here is the change I made to the Dockerfile (add a chown on the homedir for node):

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /home/node/app
# Do the chown so that the node_modules/.cache can be updated
RUN chown -R node:node /home/node

# Copy the source code over
COPY --chown=node:node . /home/node/app/

2
 likes
Like

Reply
 
 
schatzopoulos profile image
Serafeim Chatzopoulos
•
13. Okt. 22

I get the following error in the last step:

unable to convert uid/gid chown string to host mapping: can't find uid for user node: no such user: node
Any ideas? thanks


1
 like
Like

Reply
 
 
schatzopoulos profile image
Serafeim Chatzopoulos
•
13. Okt. 22

I found that removing the "--chown=node:node" part of the last COPY command solves the issue. 
But I wonder if it is going to cause other issues.

1
 like
Like
Thread
 
cauldyclark15 profile image
Joselie Castaneda
•
24. Okt. 22

FROM node:lts as base
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false
WORKDIR /app
COPY . ./
RUN yarn install
RUN yarn build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template
ENV PORT 3000
ENV HOST 0.0.0.0
WORKDIR /home/node/app
RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"
COPY --from=base /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
I simplified mine to just do production version and it worked.

1
 like
Like

Reply
 
 
jackcrane profile image
jackcrane
•
10. Nov. 22

Here is my docusaurus v2 dockerfile which is based on this one but I found to run more reliably. Worth a shot!

# Dockerfile built by Jack Crane. - https://jackcrane.rocks
# Build step

FROM node:16 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Deployment step

FROM busybox:1.35 as deploy

RUN adduser -D static
USER static
WORKDIR /home/static

COPY --from=build /usr/src/app/build/ ./

EXPOSE 3000

CMD ["busybox", "httpd", "-f", "-v", "-p", "3000"]

1
 like
Like

Reply
Code of Conduct • Report abuse
DEV Community

Timeless DEV post...

Git Concepts I Wish I Knew Years Ago
The most used technology by developers is not Javascript.

It's not Python or HTML.

It hardly even gets mentioned in interviews or listed as a pre-requisite for jobs.

I'm talking about Git and version control of course.

One does not simply learn git

Read next
zoltanszogyenyi profile image
How to build a phone mockup using only Tailwind CSS
Zoltán Szőgyényi - May 19
sachinmdev profile image
Revolutionize Your Development Skills: Top GitHub Repositories You Can't Afford to Miss
sachinM - May 9
lakshitsomani profile image
[Part 2] 🚀: I bet you have never used this VS Code theme. Ever. ⚡(Maybe ?)
Lakshit Somani - May 18
ingosteinke profile image
Audio and Video Recording+Editing Software
Ingo Steinke - May 17

Cindy Le
Follow
Full Stack Developer | Next.js, TailwindCSS, Docker | Ethereum Enthusiast | 2x #AWSCertified 😎
LOCATION
Toronto, ON
EDUCATION
Seneca College
WORK
Cloud Support Engineer at ExamPro
JOINED
3. Dez. 2020
More from Cindy Le
Remote Development with Visual Studio Code on AWS EC2
#aws #devops #docker #cloud
My '20% time' spent on Telescope
#docusaurus #docker #opensource #documentation
Remote Development using SSH with Visual Studio Code on an AWS EC2 instance
#aws #cloud #docker #devops
DEV Community

Install Rancher Desktop on Arch Linux cover image

Install Rancher Desktop on Arch Linux
I use Rancher Desktop at my day job on a Macbook Pro and have been impressed with how easy it makes working with Kubernetes locally. So, I thought I'd try it on my Linux box as well.

Read full post
## Base ########################################################################
# Use a larger node image to do the build for native deps (e.g., gcc, python)
FROM node:lts as base

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /home/node/app
# Copy the source code over
COPY --chown=node:node . /home/node/app/

## Development #################################################################
# Define a development target that installs devDeps and runs in dev mode
FROM base as development
WORKDIR /home/node/app
# Install (not ci) with dependencies, and for Linux vs. Linux Musl (which we use for -alpine)
RUN npm install
# Switch to the node user vs. root
USER node
# Expose port 3000
EXPOSE 3000
# Start the app in debug mode so we can attach the debugger
CMD ["npm", "start"]

## Production ##################################################################
# Also define a production target which doesn't use devDeps
FROM base as production
WORKDIR /home/node/app
COPY --chown=node:node --from=development /home/node/app/node_modules /home/node/app/node_modules
# Build the Docusaurus app
RUN npm run build

## Deploy ######################################################################
# Use a stable nginx image
FROM nginx:stable-alpine as deploy
WORKDIR /home/node/app
# Copy what we've installed/built from production
COPY --chown=node:node --from=production /home/node/app/build /usr/share/nginx/html/