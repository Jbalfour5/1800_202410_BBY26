
//Mapbox API Token
mapboxgl.accessToken = 'pk.eyJ1IjoiamJhbGZvdXI1IiwiYSI6ImNtMnV0MnZxbzA1OTEya29iZG95NDgxaHgifQ.48MC1AtpUWyZww1hh6s7Iw';

//Instantiating the map
const map = new mapboxgl.Map({
    container: 'map',
    center: [-77.04, 38.907],
    zoom: 11.15,
    attributionControl: false
});

//Adds post markers once map is loaded in
map.on('load', () => {
    console.log('Map load complete');

    addPostMarkersToMap();
});
map.addControl(new mapboxgl.AttributionControl(), 'top-left');

//Check for location, fly to user on load up
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userCoordinates = [position.coords.longitude, position.coords.latitude];
        map.flyTo({
            center: userCoordinates,
            zoom: 20,
            essential: true
        });
        geolocate.trigger();
        map.setCenter(userCoordinates);
    }, () => {
        console.error('Error getting user location');
        map.setCenter([-74.5, 40]); //Default geolocation
    });
} else {
    console.error('Geolocation is not supported by this browser.');
    map.setCenter([-74.5, 40]); //Default geolocation
}

//Searching function
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});
map.addControl(geocoder, 'top-left');

//Geolocating user and adding the button
const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
});
map.addControl(geolocate, 'top-left');

//Searching function
const zoomRotate = new mapboxgl.NavigationControl({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});
map.addControl(zoomRotate, 'top-left');


const createPostButton = document.getElementById('createPostButton');

/**
 * Event listener for creating a new post on the map.
 * 
 * This function listens for a click event on the createPostButton. 
 * It then checks the users geolocation and moves the map to the users location
 * to facilitate the creation of a new post.
 */
createPostButton.addEventListener('click', function () {
    isCreatingPost = true;
    map.getCanvas().style.cursor = 'pointer';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userCoordinates = [position.coords.longitude, position.coords.latitude];
            map.flyTo({
                center: userCoordinates,
                zoom: 15,
                essential: true
            });
        }, () => {
            console.error('Error getting user location');
        });
    }
});

//Default marker placement
let marker = new mapboxgl.Marker({ draggable: true, color: "#0d6efd" })
    .setLngLat([-77.04, 38.907])
    .addTo(map);
let isCreatingPost = false;

/**
 * Handles the click event on the map to select a location for the new post.
 * 
 * This function allows the user to click anywhere on the map to place a marker
 * at that location. It also updates the hidden input field with the latitude and longitude 
 * and moves the map to the users selected location.
 * 
 * @param {object} e - The click event on the map
 */
map.on('click', function (e) {
    if (isCreatingPost) {
        const lat = e.lngLat.lat;
        const lng = e.lngLat.lng;
        marker.setLngLat([lng, lat]);
        marker.getElement().style.display = 'block';
        map.flyTo({
            center: [lng, lat],
            zoom: 15,
            essential: true
        });
        document.getElementById('postLatitude').value = lat;
        document.getElementById('postLongitude').value = lng;

        console.log('Selected location:', lat, lng);
    }
});

/**
 * 
 * Retreives and address from geographic coordinates using the mapbox Geocoding API.
 * 
 * This function takes a latitude and longitude as input and returns an associated address using the 
 * mapbox geocoding API.
 * 
 * @param {number} latitude - The latitude of the post
 * @param {number} longitude - The longitude of the post
 * @returns {Promise<string>} - A promise that resolves to the address or an error message
 */
function getAddressFromCoordinates(latitude, longitude) {
    const accessToken = 'pk.eyJ1IjoiamJhbGZvdXI1IiwiYSI6ImNtMnV0MnZxbzA1OTEya29iZG95NDgxaHgifQ.48MC1AtpUWyZww1hh6s7Iw';
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                return data.features[0].place_name;
            } else {
                return 'Address not found';
            }
        })
        .catch(error => {
            console.error('Error fetching address:', error);
            return 'Error fetching address';
        });
}

/**
 * Adds markers for posts stored in Firestore onto the map.
 * 
 * This function retreives post data from Friestore and places markers on the map for each post.
 * The markers are color-coded based on priority level of the post and each marker has a popup
 * that displays the posts title, description, address and priority as well as a view post button. 
 */
function addPostMarkersToMap() {
    const db = firebase.firestore();
    console.log('Attempting to fetch posts from Firestore');

    db.collection('posts').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const latitude = parseFloat(post.latitude);
            const longitude = parseFloat(post.longitude);
            const title = post.title;
            const description = post.description;
            const address = post.address;
            const priority = post.priorityLevel;

            console.log('Fetched post data:', post);

            if (latitude && longitude) {

                const priorityColors = {
                    "Not Applicable": "#6c757d",
                    "Low Priority": "#198754",
                    "Moderate Priority": "#dea702",
                    "Top Priority": "#dc3545",
                };

                const markerColor = priorityColors[priority] || "#0d6efd"; //Default color 

                const marker = new mapboxgl.Marker({ color: markerColor })
                    .setLngLat([longitude, latitude])
                    .addTo(map);

                const popup = new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`
                        <h5>${title}</h5>
                        <p>${description}</p>
                        <p><strong>Location:</strong> ${address}</p>
                        <p><strong>Priority:</strong> ${priority}</p>
                        <div style="text-align: center;">
                            <a href="postDetails.html?id=${doc.id}" class="btn btn-success">View Post</a>
                        </div>
                    `);
                marker.setPopup(popup);

                marker.setPopup(popup);
            } else {
                console.error('Invalid coordinates:', latitude, longitude);
            }
        });
    }).catch((error) => {
        console.error("Error fetching posts:", error);
    });
}

/**
 * Toggles the legend drawer.
 * 
 * This function toggles the open class on the legendDrawer HTML element 
 * allowing the user to open and close the legend.
 */
function toggleLegend() {
    const legend = document.getElementById('legendDrawer');
    legend.classList.toggle('open');
}

