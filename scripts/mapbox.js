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
    
    const searchBox = document.querySelector('mapbox-search-box');

if (searchBox) {
    // Event listener for when a search result is selected
    searchBox.addEventListener('result', (event) => {
        const result = event.detail.result; // Get the search result
        if (result) {
            // Fly to the selected result's coordinates
            map.flyTo({
                center: result.geometry.coordinates,
                zoom: 15,
                essential: true // Animation is essential with respect to prefers-reduced-motion
            });
        }
    });
}


 
    