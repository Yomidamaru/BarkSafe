maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: park.geometry.coordinates, // starting position [lng, lat]
    zoom: 15 // starting zoom
});

new maptilersdk.Marker()
    .setLngLat(park.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${park.title}</h3><p>${park.location}</p>`
            )
    )
    .addTo(map)
