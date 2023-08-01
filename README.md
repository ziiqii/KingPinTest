# KingPin

This is the repository that holds the source code for the Orbital project KingPin, done by [@ZackTheManiac](https://github.com/ZackTheManiac) and [@ziiqii](https://github.com/ziiqii).

## Motivation

Ten-pin bowling is a popular indoor sport where players roll a ball down a wooden lane with the aim of knocking over the ten pins at the end of the lane. The game consists of ten frames, and the player with the highest total score at the end of the game is the winner. Each frame allows the player two chances to knock down as many pins as possible, with a strike achieved by knocking down all ten pins on the first roll. If the bowler fails to knock down all the pins in the first roll, they have a chance to spare on the second. Strategies such as targeting specific pins and adjusting the speed and angle of the ball can be used to improve one's score.

Many novice bowlers have found memorising the spots to stand and aim unintuitive and laborious to commit to memory. Furthermore, it is inconvenient and time-consuming to input the layout of the pins when trying to clear a spare shot, which can disrupt the flow of a game.

Moreover, it can be difficult to determine areas for improvement as players cannot track their stats during the game.

Additionally, with the presence of hundreds of different types of bowling balls on the market, bowlers often cannot remember the stats of each ball, and are unsure of which balls to use in their inventory.

We wish to create an all-in-one bowling companion designed with both beginners and seasoned professionals in mind to provide users with everything they need to do well in bowling.

## Currently implemented features:

### 1. Account Creation and Login System
To use KingPin, users will have to create a new account with a valid email and a password longer than 6 characters. They will then be able to log into our app and access more features. Our authentication includes login persistence, so once you have logged into the app once, the app will automatically bring users to the home page for subsequent app launches.

### 2. Score Tracker
The Score Tracker will allow users to input and store their bowling scores in real-time as the game unfolds. This feature provides users with the ability to indicate the status of each bowling pin (standing or downed) with the help of interactive pin selectors.

Additionally, it offers convenient buttons such as “strike”, “spare” and “reset” to enhance the overall user experience while tracking their game progress.

Furthermore, this feature includes a dynamic scoreboard that automatically updates as the game advances. All game information is stored in a real-time firebase database tied to a user account, allowing for personalised data storage and display in the next feature, Performance Tracker.

### 3. Performance Analytics
Our proposed Performance Tracker will allow users to input and store their bowling scores, providing them with a historical record of their performance. We aim to track the user’s progress over time, storing each game as a part of their “history” of games.

Currently, we have 3 different categories of data with a variety of summary statistics:
- Today's Games
- Past 30 Games
- All Time Games

### 4. Spare Guide
The Spare Guide is a standalone feature that allows users to view the recommended spare line without having to be inside a game.

Upon inputting the pins remaining using the interactive graphical interface, the “Pins:” text will dynamically change to display and confirm the numbers of the selected pins. If there is such a pin combination stored in the system, there will be an option to “View Spare”, similar to the feature inside the “Bowl” tab.

If no Guide is available for a selected pin combination, a text that reads “No spare found” will be displayed instead. 

### 5. Ball Collection

The Ball Collection is an arsenal of the user’s bowling balls. After drilling a new ball, the user is able to enter the specs of the bowling ball into the ball advisor.

The user can sort the bowling balls based on the various factors, in order to select the bowling balls to be used on different oiling patterns.

## Complete README:
The complete README can be found here: [link](https://docs.google.com/document/d/1lq75rN7ueXBFoLAV1hNBr3ezUTd9_J5RBttwtSPcSkU)

## Download instructions:
Requirements:
1. Install [Node.js LTS release](https://nodejs.org/en/) (npm packet manager) (step 1).
2. Install Yarn via npm (step 5).
3. Download Expo Go app on your mobile device.

Steps:
1. Install Node.js LTS [here](https://nodejs.org/en).
2. Download the repo [here](https://github.com/ziiqii/KingPin/archive/refs/heads/main.zip).
3. Extract the file to any destination, and within your IDE, open the 'KingPin-main' folder.
4. Bring up your terminal in your IDE to check that you are in the correct directory, e.g. C:\Users\YourName\Folder\KingPin-main\King-main.
5. Install yarn by typing `npm install --global yarn` into the console. Installation docs can be found [here](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable).
6. Type `yarn` into the console to install dependencies. This might take a while.
7. Type `npx expo start` in the terminal to start the server.
8. A QR Code will appear in the terminal.
9. Open your camera and scan the QR Code to run the app.

If you have any issues, you can dm us on telegram:
- @zhuyicheng
- @ziiqii
