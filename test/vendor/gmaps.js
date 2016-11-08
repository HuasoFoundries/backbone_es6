(function (window, undefined) {
    if (typeof window.google === "object" && typeof window.google.maps !== "undefined") {
        console.log('gmaps already present');
        window.gmaps = window.google.maps;
    } else {
        window.gmaps = window.gmaps || new Promise(function (resolve, reject) {
            if (typeof window.google === "object" && typeof window.google.maps !== "undefined") {
                return resolve(window.google.maps);
            }
            window.__google_maps_callback__ = function () {

                if (window.google.maps) {
                    var gmaps = window.google.maps;
                    console.log('RESOLVED');
                    resolve(gmaps);
                    return gmaps;

                }
                return reject(new Error('no gmaps object!'));

            };
            return window.__google_maps_callback__;

        });
    }

    return window.gmaps;

})(window);
