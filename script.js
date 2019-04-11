let url = "https://utils.pauliankline.com/stops.json";

let radians = deg => deg * Math.PI / 180;

let app = new Vue({
    el: '#app',
    data: {
        stops: [],
        numStops: 10,
        loc: { lat: 0, lon: 0 }
    },
    methods: {
        distance: function(lat1, long1) {
            // Found formula from this page: https://www.movable-type.co.uk/scripts/latlong.html
            // Radius of Earth in miles according to Google
            let R = 3963;
            console.log(this.loc.lat, this.loc.lon);
            let dLat = radians(this.loc.lat - lat1);
            let dLong = radians(long1 - this.loc.lon);
            let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(radians(lat1)) * Math.cos(radians(this.loc.lat)) *
                    Math.sin(dLong / 2) * Math.sin(dLong / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        },
    },
    mounted: function() {
        fetch(url)
            .then((res) => {
                return res.json();
            })
            .then((stopJson) => {
                this.stops = stopJson;
            });

        let watchId = 0;

        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition(savePosition);
        }

        function savePosition(pos) {
            app.loc = {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            };
        }
    },
    computed: {
        filteredStops: function() {
            for (let stop of this.stops) {
                stop.distance = this.distance(stop.lat, stop.lon).toFixed(2);
            }
            return this.stops.sort((a,b)=>{return a.distance - b.distance}).slice(0, this.numStops);
        }
    }
});
