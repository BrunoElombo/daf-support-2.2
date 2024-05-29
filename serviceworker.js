const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;


// Install SW
self.addEventListener("install",(event)=>{
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(caches=>{
            console.log("Openned cache");
            return caches.addAll(urlsToCache);
        })
        .catch(err=>{
            console.error("Something went wrong while openning cache")
        })
    )
});

// Listen for requests
self.addEventListener("fetch",(event)=>{
    caches.match(event.request)
    .then(()=>{
        return fetch(event.request)
            .catch(()=>caches.match("offline.html"));
    })
});

// Activate the SW
self.addEventListener("activate",(event)=>{
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);
    event.waitUntil(
        caches.keys()
        .then((cacheNames)=>{
            Promise.all(
                cacheNames.map(cacheName=>{
                    if(!cacheWhiteList.includes(cacheName)){
                        return caches.delete(cacheName);
                    }
                })
            )
        })
    );
});



// service-worker.js
self.addEventListener('periodicsync', (event, data) => {
    if (event.tag === 'push-notification') {
      event.waitUntil(triggerPushNotification());
    }
});
  
const triggerPushNotification = async () => {
    const registration = await self.registration;
    const options = {
        body: 'Check out the latest updates!',
        icon: 'path/to/icon.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
    };
    registration.showNotification('New Update Available', options);
};
  