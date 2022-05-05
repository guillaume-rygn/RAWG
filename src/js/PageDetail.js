import dayjs from 'dayjs';

const PageDetail = (argument) => {
  window.scrollTo(0, 0);

  const preparePage = () => {
    document.getElementById("platformdiv").style.display = "none";
    document.getElementById("whereyouare").style.display = "none";
    document.getElementById("présentation").style.display = "none";
    const cleanedArgument = argument.trim().replace(/\s+/g, "-");

    const displayGame = (gameData) => {
      let icons = ["",`<i class="fab fa-windows icon-platform" id="1"></i>`,`<i class="fab fa-playstation icon-platform" id="2"></i>`,`<i class="fab fa-xbox icon-platform" id="3"></i>`,`<i class="fab fa-app-store-ios icon-platform" id="4"></i>`,`<i class="fab fa-apple icon-platform" id="5"></i>`,`<i class="fab fa-linux icon-platform" id="6"></i>`, `<i class="fab fa-nintendo-switch icon-platform" id="7"></i>`, `<i class="fab fa-android icon-platform" id="8"></i>`];

      const { name, released, description, rating, ratings_count, developers, parent_platforms, publishers, genres, tags, stores, id, background_image, slug, website } = gameData;
      document.getElementById("transition").classList.add("on");
      setTimeout(function(){
        document.getElementsByClassName("page-detail")[0].style.opacity = 1;
      },500)
      const articleDOM = document.querySelector(".page-detail .article");
      articleDOM.querySelector("div.background").style.background = `url(${background_image})`;
      articleDOM.querySelector("div.background").style.height = `50vh`;
      articleDOM.querySelector("div.background").style.backgroundSize = `cover`;
      articleDOM.querySelector("div.background").style.backgroundPosition = `center`;
      articleDOM.querySelector("div.background").style.backgroundRepeat = `no-repeat`;
      articleDOM.querySelector("a#website").setAttribute("href",website);
      articleDOM.querySelector("h1.title").innerHTML = name;
      articleDOM.querySelector("h2.rating span").innerHTML = rating;
      articleDOM.querySelector("h2.rating .vote").innerHTML = ratings_count;
      articleDOM.querySelector("p.release-date span").innerHTML = `${released? released : "upcoming"}`;
      articleDOM.querySelector("p.description").innerHTML = description;
      articleDOM.querySelector("p.developer span").innerHTML = developers.map(developer => `<a href="#search/${developer.id}-developer" style="color:white">${developer.name}</a>`);
      articleDOM.querySelector("p.platforms span").innerHTML = parent_platforms.map(platform => `<a href="#search/${platform.platform.id}-platform" style="color:white">${platform.platform.name}</a>`);
      articleDOM.querySelector("p.publisher span").innerHTML = publishers.map(publisher => `<a href="#search/${publisher.id}-publisher" style="color:white">${publisher.name}</a>`);
      articleDOM.querySelector("p.genre span").innerHTML = genres.map(genre => `<a href="#search/${genre.id}-genre" style="color:white">${genre.name}</a>`);
      articleDOM.querySelector("p.tags span").innerHTML = tags.map(tag => `<a href="#search/${tag.id}-tag" style="color:white">${tag.name}</a>`);
      articleDOM.querySelector("p.store").innerHTML = stores.map(store => `<a href="https://www.${store.store.domain}" target="_blank" style="margin:0"><span style="color:white"><u style="text-decoration-color: rgb(212, 13, 53)">${store.store.name}</u> ${icons[store.store.id]? icons[store.store.id] : ""}</span></a><br>`);
      
      fetch(`https://api.rawg.io/api/games/${id}/movies?key=${process.env.API_KEY}`)
                .then((response) => response.json())
                .then ((responseData) => {
                    if(responseData.count > 0){
                      document.getElementById("video").innerHTML = `
                      <h2 class="rating mt-3">TRAILER</h2>
                        <video controls style="width:100%">
                            <source src="${responseData.results[0].data.max}" type="video/mp4">
                        </video>`
                    }
                }).catch((error) => {
                    console.error(error)
                });

      fetch(`https://api.rawg.io/api/games/${slug}/screenshots?key=${process.env.API_KEY}`)
                .then((response) => response.json())
                .then ((responseData) => {
                    if(responseData.count > 0){

                      document.getElementById("screenshot").innerHTML = `
                      <h2 class="rating my-4">SCREENSHOTS</h2>
                      <div id="gridscreen" class="row justify-content-around g-4"></div>`;

                      responseData.results.slice(0, 4).forEach(screen => {
                        document.getElementById("gridscreen").innerHTML += `
                          <img src="${screen.image}" class="col-lg-6 col-md-6 col-sm-6">
                        `
                      })
                    }
                    
                }).catch((error) => {
                    console.error(error)
                });
      
      fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&genres=${genres[0].id}&page_size=6&dates=2015-12-01,2022-12-31&ordering=-released`)
                .then((response) => response.json())
                .then ((responseData) => {
                    if(responseData.count > 0){

                      document.getElementById("similar").innerHTML = `
                      <h2 class="rating mt-5">SIMILAR GAMES</h2>
                      <div id="gridsimilar" class="row justify-content-around g-4"></div>`

                      responseData.results.forEach(article => {
                        document.getElementById("gridsimilar").innerHTML += `
                        <div class="col-lg-4 col-md-4 col-sm-6 my-3 alist" style="width:400px">
                        <article class="cardGame opacity">
                        <a href="#game/${article.id}">
                          <div class="imgbox">            
                            <div class="info novideo">
                              <p>${dayjs(article.released).format('MMM DD, YYYY')}</p>
                              <p id="${article.id}"></p>
                              <p class="card-text">${article.rating}/5 - ${article.ratings_count} votes</p>
                              <p class="tag">${article.genres.map(genre => `${genre.name}, `)}</p>
                            </div>
                            <div style="height:200px; background : url(${article.background_image ? `${article.background_image}` : "https://wallpaperaccess.com/full/1588750.jpg"}); background-size:cover; background-position:center; position:relative; z-index:-1"></div>
                          </div>
                          <h5 class="card-title my-3" style="background-color:black, height">${article.name}</h5>
                        </a>
                          <p class="mt-1"> ${article.parent_platforms ? article.parent_platforms.map(platform => icons[platform.platform.id]).join('') : ""} </p>
                        </article>
                      </div>
                        `
                      })

                    }
                    
                }).catch((error) => {
                    console.error(error)
                });

    };

    const fetchGame = (url, argument) => {
      fetch(`${url}/${argument}?key=${process.env.API_KEY}`)
        .then((response) => response.json())
        .then((responseData) => {
          displayGame(responseData);
        });
    };

    fetchGame('https://api.rawg.io/api/games', cleanedArgument);
  };

  const render = () => {
    pageContent.innerHTML = `
    <div style="position:absolute; z-index:1000; height:100%; width:200vw; background-color: rgb(212, 13, 53); transition: 1s ease-in; transform: translateX(-220vw)" id="transition"></div>
      <section class="page-detail">
       <div class="article">
        <div class="background"><a id="website" href="" target="_blank">Check Website ></a></div>
          <div class="row mt-3">
              <div class="col-lg-8 col-md-8 col-sm-12">
                <h1 class="title"></h1>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-12">
                <h2 class="rating"><span></span>/5 - <span class="vote"></span> votes</h2>
              </div>
          </div>
          <p style="margin:0"><strong>Plot</strong></p>
          <p class="description"></p>

          <div class="row mt-3">
              <div class="col-lg-3 col-md-4 col-sm-6">
                <p class="release-date"><strong>Release date</strong><br><span></span></p>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6">
                <p class="developer"><strong>Developer</strong><br><span></span></p>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6">
                <p class="platforms"><strong>Platforms</strong><br><span></span></p>
              </div>
              <div class="col-lg-3 col-md-4 col-sm-6">
                <p class="publisher"><strong>Publisher</strong><br><span></span></p>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <p class="genre"><strong>Genre</strong><br><span></span></p>
              </div>
              <div class="col-lg-6 col-md-12 col-sm-12">
                <p class="tags"><strong>Tags</strong><br><span></span></p>
              </div>
          </div>

          <h2 class="rating mt-3">BUY</h2>
          <p class="store"></p>

          <div id="video">

          </div>
          

          <div id="screenshot">

          </div>

          <div id="similar">

          </div>

        </div>
      </section>
    `;

    preparePage();
  };

  render();
};

export default PageDetail;