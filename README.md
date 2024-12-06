# Project Title
UrbanEx!

## 1. Project Description
State your app in a nutshell, or one-sentence pitch. Give some elaboration on what the core features are.  
This browser-based web app empowers urban explorers to prioritize safety by enabling community-sourced posts that inform locals about recent incidents throught posts and accessibility options by reports.

## 2. Names of Contributors
List team members and/or short bio's here... 
* Hi, my name is Valley, I am excited to create a website and see what other people create.
* Hi, my name is Irene! So happy!
* Hi my name is Haider Al-Sudani
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.3.3 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* JQuery 3.5.1 
* Material Icons (Icon package)
* Mapbox API (Mapping API)
* Mapbox GL JS 3.7.0 

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* 1. Click login or sign up from the landing page
* 2. Enter the details prompted
* 3. Enjoy!

## 5. Known Bugs and Limitations
Here are some known bugs:
* User reaction to a post will reset on page refresh
* Text between liking and dislike doesnt update until page refresh
* Resizing the page will not move the slider until filter is changed
* If you search a location when making a post, it will not auto fill the location. Clicking on the map is still required.

## 6. Features for Future
What we'd like to build in the future:
* Allow users to delete their own posts
* Allow users to comment on posts
* Allow users to attach images to their posts
* Further depth to filtering like filtering by closest post
* Reports displayed on the map
	
## 7. Contents of Folder
Content of the project folder:

```
.
├── .firebase                        # Firebase configuration files
├── .git                              # Git version control files
├── images/                           # Folder containing the images used
│   ├── featuresMap.png              # Map feature image
│   ├── logo.png                     # UrbanEx! logo image
│   ├── mapFeature.png               # Map feature screenshot
│   ├── noImage.png                  # Placeholder image
│   ├── passwordhidden.png           # Hidden password icon
│   ├── passwordVisible.png          # Visible password icon
│   ├── postFeature.png              # Post creation feature image
│   ├── profileFeature.png           # Profile page feature image
│   └── urbanExLandingImage.png      # UrbanEx! landing page image
├── scripts/                          # Folder containing JavaScript files
│   ├── activeNav.js                 # Script for navbar activation
│   ├── eachReport.js                # Script for displaying individual reports
│   ├── firebaseAPI_TEAM26.js        # Firebase API initialization and config
│   ├── loginUser.js                 # Script for user login functionality
│   ├── logout.js                    # Script for user logout functionality
│   ├── main.js                      # Main script for general functionality
│   ├── mapbox.js                    # Mapbox integration and functions
│   ├── postDetails.js               # Script for displaying post details
│   ├── postToDatabase.js            # Script for submitting posts to Firebase
│   ├── profile.js                   # Script for user profile page functionality
│   ├── report.js                    # Script for handling reports
│   ├── reportToDatabase.js          # Script for submitting reports to Firebase
│   ├── signupUser.js                # Script for user signup functionality
│   └── skeleton.js                  # Skeleton for dynamically loading navbar
├── styles/                           # Folder containing CSS stylesheets
│   ├── bottomNav.css                # Styles for the bottom navigation bar
│   ├── landingStyle.css             # Styles for the landing page
│   ├── main.css                     # General main page styles
│   ├── mapStyle.css                 # Styles for the map page
│   └── style.css                    # General styles for the app
├── .firebaserc                      # Firebase project configuration
├── .gitignore                       # Specifies files to ignore in Git
├── 404.html                         # 404 error page
├── bottomNavbar.html                # HTML for the bottom navbar (after login)
├── firebase.json                    # Firebase project settings and configuration
├── firestore.indexes.html           # Firestore indexes configuration
├── firestore.rules                  # Firestore security rules
├── footer.html                      # Footer HTML snippet
├── index.html                       # Main landing page
├── login.html                       # Login page HTML
├── main.html                        # Main content page HTML
├── map.html                         # Map page HTML
├── navbarAfterLogin.html            # Navbar HTML (after login)
├── navbarBeforeLogin.html           # Navbar HTML (before login)
├── postDetails.html                 # Post details page HTML
├── profile.html                     # User profile page HTML
├── README.md                        # Project README file
├── report.html                      # Report page HTML
├── reportDetails.html               # Report details page HTML
├── signup.html                      # Signup page HTML
└── thanks.html                      # Thank you page HTML

```


