
//Mapbox API Token
mapboxgl.accessToken = 'pk.eyJ1IjoiamJhbGZvdXI1IiwiYSI6ImNtMnV0MnZxbzA1OTEya29iZG95NDgxaHgifQ.48MC1AtpUWyZww1hh6s7Iw';

//Instantiating the map
const map = new mapboxgl.Map({
    container: 'map',
    center: [-77.04, 38.907],
    zoom: 11.15,
    attributionControl: false
});

map.on('load', () => {
    console.log('Map load complete');
    addPostMarkersToMap();
});

map.addControl(new mapboxgl.AttributionControl(), 'top-left');

//Geolocating user and adding the button
const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
});
map.addControl(geolocate, 'right');

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

//When creating post, new mapbox with ability to place map pins
const createPostButton = document.getElementById('createPostButton');
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

// Call the function after initializing the map


//Default marker placement
let marker = new mapboxgl.Marker({ draggable: true })
    .setLngLat([-77.04, 38.907]) 
    .addTo(map);
let isCreatingPost = false;

//Adding the map pin on click and saving its longitude and latitude
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

//Convert longitude and latitude to address for database / printing
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

            console.log('Fetched post data:', post); // Log the data to check
            
            if (latitude && longitude) {
                const marker = new mapboxgl.Marker()
                    .setLngLat([longitude, latitude]) // Use the numeric values
                    .addTo(map);
        
                const popup = new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`<h5>${title}</h5><p>${description}</p>`);
                marker.setPopup(popup);
            } else {
                console.error('Invalid coordinates:', latitude, longitude);
            }
        });
    }).catch((error) => {
        console.error("Error fetching posts:", error);
    });
}
