// document.addEventListener("DOMContentLoaded", function () {
//     // Initialize the map using the coordinates
//     const map = L.map('map').setView([coordinates[1], coordinates[0]], 13); // Note: Use latitude first

//     // Add OpenStreetMap tiles
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 19,
//     }).addTo(map);

//     // Add a marker at the specified coordinates
//     const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);
//     marker.bindPopup(Location).openPopup(); // Customize the popup text as needed

//     // Initialize the geocoder control
//     const control = L.Control.geocoder({
//         defaultMarkGeocode: true
//     }).addTo(map);

//     // Use the geocoder to allow users to search for locations
//     control.on('markgeocode', function (e) {
//         const latlng = e.geocode.center;
//         L.marker(latlng).addTo(map).bindPopup(e.geocode.name).openPopup();
//         map.setView(latlng, 13); // Move the map to the searched location
//     });
// });
