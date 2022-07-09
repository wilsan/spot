mapboxgl.accessToken = mapToken;
const campground = JSON.parse(camp);

const map = new mapboxgl.Map({
   container: 'map', // container ID
   style: 'mapbox://styles/mapbox/streets-v11', // style URL
   center: campground.geometry.coordinates, // starting position [lng, lat]
   zoom: 11, // starting zoom
   projection: 'globe' // display the map as a 3D globe
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// Creating a custom marker using Bootstrap's icon
// The 'fill' attribute sets the color
const svg = document.createElement('div');
svg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16"><path fill="#f5454a" d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>'

new mapboxgl.Marker({
   element: svg
})
   .setLngLat(campground.geometry.coordinates)
   .setPopup(
      new mapboxgl.Popup({ offset: 25, focusAfterOpen: false })
         .setHTML(
            `<h6>${campground.title}</h6><p>${campground.location}</p>`
         )
   )
   .addTo(map);
