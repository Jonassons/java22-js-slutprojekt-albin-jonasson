const API_KEY = "92298d8189564a0baaba7419aeff59e6";
const API_ENDPOINT = "https://www.flickr.com/services/rest/";
const form = document.querySelector("#flickr-form");
const gallery = document.querySelector("#image-gallery");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Kollar om det finns aktiv internetanslutning
    if (!navigator.onLine) {
        alert("Sorry, there seems to be something wrong with your internet connection.");
        return;
    }

    // Data från formet
    const searchTerm = document.querySelector("#search-term").value;
    const imageSize = document.querySelector("#image-size").value;
    const numImages = document.querySelector("#num-images").value;
    const sortOrder = document.querySelector("#sort-order").value;

// Loading animation när man klickar på search
    const loading = document.createElement("div");
    loading.innerHTML = "Searching for images....";
    loading.style.fontSize = "25px";
    loading.style.textAlign = "center";
    gallery.appendChild(loading);
  




    //Om inte searchTerm eller numImages är angett return fel meddelande
    if (!searchTerm || !numImages) {
        return alert("Please enter a search term and number of images");
    }

    // query string för APIet
    const params = new URLSearchParams({
        api_key: API_KEY,
        method: "flickr.photos.search",
        format: "json",
        nojsoncallback: 1,
        text: searchTerm,
        per_page: numImages,
        sort: sortOrder,
    });

    try {
        const response = await fetch(API_ENDPOINT + "?" + params);
        const data = await response.json();

        //tar bort loading animationen
        gallery.removeChild(loading);

        // Tar bort tidigare bilder vid ny sökning
        gallery.innerHTML = "";



        // kollar om bilder har returnats och get fel meddelande om inga hittas
        if (data.photos.photo.length === 0) {
            throw new Error("No images found, please try a different search term.");
        }





        // Displayar bilderna
        data.photos.photo.forEach((photo) => {
            const img = document.createElement("img");
            img.src = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${imageSize}.jpg`;
            img.addEventListener("click", (event) => {
                window.open(event.target.src, "blank");
            });
            gallery.appendChild(img);
        });
    } catch (error) {
        console.log(error);
        alert(error);
    }
});