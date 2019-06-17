// JavaScript source code
// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

mapboxgl.accessToken = 'pk.eyJ1Ijoic2QxMjcyIiwiYSI6ImNqZDBsZHUydjI0aTMycXFzZGR1cHAzMHAifQ.romjxMEx05TZlfhOkCq94A';
// This adds the map to the page
var map = new mapboxgl.Map({
    // container id specified in the HTML
    container: 'map',
    // style URL
    style: 'mapbox://styles/sd1272/cjwzovmt7ey8g1cp6nbg39sms',
    // initial position in [lon, lat] format
    center: [-121.986646, 37.221217],
    // initial zoom
    zoom: 7.5                                     
});

var sites =
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -122.217017,
                    37.185102
                ]
            },
            "properties": {
                "name": "Big Basin Redwoods State Park",
                "website":"https://www.parks.ca.gov/?page_id=540",
                "address": "21600 Big Basin Way",
                "city": "San Francisco",
                "country": "United States",
                "postalCode": "95006",
                "state": "CA"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -121.778991,
                    36.247651
                ]
            },
            "properties": {
                "name": "Los Padres National Forest",
                "website": "https://www.fs.usda.gov/recarea/lpnf/recarea/?recid=10913",
                "address": "69345 CA-1",
                "city": "Big Sur",
                "country": "United States",
                "postalCode": "93920",
                "state": "CA"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -121.8061472,
                    36.2653102
                ]
            },
            "properties": {
                "name": "Riverside Camp Grounds",
                "website": "https://www.fs.usda.gov/recarea/lpnf/recarea/?recid=10913",
                "address": "47020 CA-1",
                "city": "Big Sur",
                "country": "United States",
                "postalCode": "93920",
                "state": "CA"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -121.425157,
                    37.135359
                ]
            },
            "properties": {
                "name": "Henry W. Coe State Park",
                "website": "https://www.parks.ca.gov/?page_id=561",
                "address": "3333M E Dunne Ave",
                "city": "Morgan Hill",
                "country": "United States",
                "postalCode": "95037",
                "state": "CA"
            }
        },

        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -122.740114,
                    37.994799
                ]
            },
            "properties": {
                "name": "Point Reyes National Seashore",
                "website": "https://www.fs.usda.gov/recarea/lpnf/recarea/?recid=10913",
                "address": "1 Pt. Reyes Petaluma Rd",
                "city": "Inverness",
                "country": "United States",
                "postalCode": "94937",
                "state": "CA"
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -122.1751953,
                    36.9842314
                ]
            },
            "properties": {
                "name": "Coast Dairies State Park",
                "website": "http://www.calparks.org/",
                "address": "6098 Laguna Rd",
                "cc": "US",
                "city": "Santa Cruz",
                "country": "United States",
                "postalCode": "95060",
                "state": "CA"
            }
        }
    ]
};

map.on('load', function (e) {
    // Add the data to your map as a layer
    map.addSource('places', {
        type: 'geojson',
        data: sites
    });

    buildLocationList(sites);
});

function buildLocationList(data) {
    // Iterate through the list of site
    for (i = 0; i < data.features.length; i++) {
        var currentFeature = data.features[i];

        // Shorten data.feature.properties to just `prop` so we're not
        // writing this long form over and over again.
        var prop = currentFeature.properties;

        // Select the listing container in the HTML and append a div
        // with the class 'item' for each site
        var listings = document.getElementById('listings');
        var listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';
        listing.id = 'listing' + i;

        // Create a new link with the class 'title' for each site
        // and fill it with the site address
        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.dataPosition = i;
        link.innerHTML = prop.name;
        // Add an event listener for the links in the sidebar listing
        link.addEventListener('click', function (e) {
            // Update the currentFeature to the site associated with the clicked link
            var clickedListing = data.features[this.dataPosition];
            // 1. Fly to the point associated with the clicked link
            flyToSite(clickedListing);
            // 2. Close all other popups and display popup for clicked site
            createPopUp(clickedListing);
            // 3. Highlight listing in sidebar (and remove highlight for all other listings)
            var activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
        });

        // Create a new div with the class 'details' for each site
        // and fill it with the name and address         
        var details = listing.appendChild(document.createElement('div'));
        details.innerHTML = prop.address + ' &middot; ' + prop.city + ", " + prop.state;
    }
}

//Function to fly to the correct site
function flyToSite(currentFeature) {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 13
    });
}

//Function to display popup features
function createPopUp(currentFeature) {
    var popUps = document.getElementsByClassName('mapboxgl-popup');

    if (popUps[0]) popUps[0].remove();
    var prop = currentFeature.properties;
    var popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML('<h3>' + prop.name + '</h3>' + '<a href=' + currentFeature.properties.website + ' target="_blank">' + "Park Website" + '</a>')
        .addTo(map);
}

//// Add an event listener for when a user clicks on the map

sites.features.forEach(function (marker) {
    // Create a div element for the marker
    var el = document.createElement('div');
    // Add a class called 'marker' to each div' 
    el.className = 'marker';
    // By default the image for your custom marker will be anchored
    // by its center. Adjust the position accordingly
    // Create the custom markers, set their position, and add to map
    new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    el.addEventListener('click', function (e) {
        var activeItem = document.getElementsByClassName('active');
        // 1. Fly to the point
        flyToSite(marker);
        // 2. Close all other popups and display popup for clicked sit
        createPopUp(marker);
        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        e.stopPropagation();
        if (activeItem[0]) {
            activeItem[0].classList.remove('active');
        }
        var listing = document.getElementById('listing-' + i);
        console.log(listing);
        listing.classList.add('active');
    });
});