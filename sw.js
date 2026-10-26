// Lets phones install the site as an app. It caches nothing, so every visit gets the
// newest version and your to-dos always come straight from the database.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
