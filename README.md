# On the Hunt!

On the Hunt is a website for creating and sharing scavenger hunts.  
A live version is deployed [here](https://on-the-hunt-yev5h.ondigitalocean.app)!  
See a live demostration [here](https://www.linkedin.com/posts/davidclark1043_github-onthehunt-activity-6911792680662368256-K0wB?utm_source=linkedin_share&utm_medium=member_desktop_web)!

In this document:
- [Motivation](#motivation-for-this-project)
- [How it works](#how-on-the-hunt-works)
- [How it was developed](#how-on-the-hunt-was-developed)
- [How to install and run it yourself](#how-to-install-and-run-this-project)
- [Lessons Learned](#difficultieslessons-learned)

# Motivation For This Project

On the Hunt was created for my Capstone Project for Nashville Software School. The Capstone Project is the conclusion of the front-end (Javascript/HTML/CSS) portion of the course. I wanted to make a website that was fun and useful. I have made scavenger hunts for friends on this site (and you can too!).

Minimum Viable Product was defined using a [Sketchboard wireframe](https://sketchboard.me/fC7BlEZ9PPK#/) and an [ERD on diagram.io](https://dbdiagram.io/d/6222383754f9ad109a5f43f5). MVP was met on commit [917c2ec2ee](https://github.com/david-clark-1043/on-the-hunt/tree/917c2ec2ee3ece602fa67389599bb534cba5112c).

Since MVP, I added a Google Maps integration for location clues. The hunt creator can set a location as the solution, and the hunter can automatically check their current location against the stored clue answer.

[Back to Top](#on-the-hunt)

# How On The Hunt Works

Users can create a profile using just a name and email (the email is not used by the site other than log in so feel free to use a fake!). 

Once logged in, users can see what hunts they have created and ones for which they are hunters. 

The New Hunt link takes the user to a creation page where they can add a hunt title, reward text that is displayed upon completion, and clues for the steps of the hunt. Clues include a hint, answer, and if it is a location clue, coordinates for the location.

<p align="center">
  <img src="/CreateHunt.gif" width="372" height="310" />
 </p>

When viewing a hunt the user created, options are displayed for editing and deleting clues, inviting additional people to try the scavenger hunt, and deleting the hunt itself.

<p align="center">
  <img src="/HuntOwner.gif" width="372" height="310" />
</p>

When viewing a hunt the user is participating in, the user can see the current clue hint, a list of completed clues, and how many clues are in the hunt.

[Back to Top](#on-the-hunt)

# How On The Hunt Was Developed

I developed this project over the course of a couple weeks. MVP was met in a few days, but further tinkering with different views and integrating Google Maps took several more days. 

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

[Back to Top](#on-the-hunt)

# How to install and run this project

If you would like to play around with this project you can use the [live site](https://on-the-hunt-yev5h.ondigitalocean.app) (may or may not be still active at the time of reading). You can also follow these instructions to download it and test it out on your local machine.

**Note** The api key will not work for any referrer other than my live site on digitalocean. If you would like to use the google maps functionality, you will need to generate a google maps api key for yourself and replace it in `/src/repositories/Setting.js`. [Google Maps Javascript API Docs.](https://developers.google.com/maps/documentation/javascript/overview)

- Clone this repo
- Make a second directory for the database, such as the database for this repo found [here](https://github.com/david-clark-1043/on-the-hunt-api)
- This repo is for the live site, so change `remoteURL` in `/src/repositories/Setting.js` to `"localhost:8088"`
- In the database directory run `json-server database.json -p 8088 -w`
- Open a different terminal window or tab and navigate to the project directory
- In the project directory run `npm start`
- In a browser, open `localhost:3000` and you should see the app running.



[Back to Top](#on-the-hunt)

# Difficulties/Lessons Learned  

Probably the most difficult thing for this project was making it work on mobile. I found Safari iOS did not support dialog boxes in the same way as Google Chrome which I had been using for development on my laptop. This was the first time, I tried making a site work on most browsers, so learning how to overcome different browsers supporting different features, so that the user experience is as consistent as possible, was a valuable process.

I also had to decipher the Google Maps API documentation above which I found to be lackluster compared to other docs I have learned from. For one, the documentation is for Javascript, but many of the examples are actually in Typescript, so I had to learn the slightly different syntax while also trying to understand what the code was intended to produce. It was not explicit in the basic functionality guide that `@types/google.maps` was actually needed for the `@googlemaps/react-wrapper` even though my code is in React/Vanilla Javscript not Typescript.

[Back to Top](#on-the-hunt)
