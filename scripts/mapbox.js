mapboxgl.accessToken = 'pk.eyJ1IjoiamJhbGZvdXI1IiwiYSI6ImNtMnV0MnZxbzA1OTEya29iZG95NDgxaHgifQ.48MC1AtpUWyZww1hh6s7Iw';
const map = new mapboxgl.Map({
    container: 'map',
    center: [-77.04, 38.907],
    zoom: 11.15,
    attributionControl: false
});

map.addControl(new mapboxgl.AttributionControl(), 'top-left');

const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
});
map.addControl(geolocate, 'right');

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
        map.setCenter([-74.5, 40]);
    });
} else {
    console.error('Geolocation is not supported by this browser.');
    map.setCenter([-74.5, 40]);
}

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});
map.addControl(geocoder, 'top-left'); // Position it at the top left (or change as needed)

const createPostButton = document.getElementById('createPostButton');
createPostButton.addEventListener('click', function () {
    console.log('Create Post button clicked!');
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


let marker = new mapboxgl.Marker({ draggable: true })
    .setLngLat([-77.04, 38.907]) 
    .addTo(map);


let isCreatingPost = false;


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