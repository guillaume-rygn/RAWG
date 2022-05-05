import dayjs from 'dayjs';

const PageList = (argument) => {
  const preparePage = () => {
    let platformid;
    let page = 0;
    let a = 0;
    let max;
    let iconName = ["", "PC", "Playstation", "Xbox", "IOS", "Mac", "Linux", "Nintendo", "Android"];
    const cleanedArgument = argument.split("-")[0].trim().replace(/\s+/g, '-');

    const displayResults = (articles) => {
      let icons = ["",`<i class="fab fa-windows icon-platform" id="1"></i>`,`<i class="fab fa-playstation icon-platform" id="2"></i>`,`<i class="fab fa-xbox icon-platform" id="3"></i>`,`<i class="fab fa-app-store-ios icon-platform" id="4"></i>`,`<i class="fab fa-apple icon-platform" id="5"></i>`,`<i class="fab fa-linux icon-platform" id="6"></i>`, `<i class="fab fa-nintendo-switch icon-platform" id="7"></i>`, `<i class="fab fa-android icon-platform" id="8"></i>`];

      const resultsContent = articles.map((article) => (
       `<div class="col-lg-4 col-md-4 col-sm-6 my-3 alist" style="width:400px">
            <article class="cardGame">
            <a href="#game/${article.id}">
              <div class="imgbox">            
                <div class="info" id="info${article.id}">
                  <div id="pop${article.id}">
                    <p style="padding-left:10px; padding-top:10px">${dayjs(article.released).format('MMM DD, YYYY')}</p>
                    <p id="${article.id}" style="padding-left:10px"></p>
                    <p class="card-text" style="padding-left:10px">${article.rating}/5 - ${article.ratings_count} votes</p>
                    <p class="tag" style="padding-left:10px">${article.genres.map(genre => `${genre.name}, `)}</p>
                  </div>
                  <div id="video${article.id}">
                 
                  
                  </div>
                </div>
                <div style="height:200px; background : url(${article.background_image ? `${article.background_image}` : "https://wallpaperaccess.com/full/1588750.jpg"}); background-size:cover; background-position:center; position:relative; z-index:-1"></div>
              </div>
              <h5 class="card-title my-3" style="background-color:black, height">${article.name}</h5>
            </a>
              <p class="mt-1"> ${article.parent_platforms ? article.parent_platforms.map(platform => icons[platform.platform.id]).join('') : ""} </p>
            </article>
          </div>` 

      ));
      const resultsContainer = document.querySelector('.page-list .articles');
      if(page === 1){
        resultsContainer.innerHTML = "";
        resultsContainer.innerHTML = resultsContent.join("\n");
        articles.map(article => {
          fetch(`https://api.rawg.io/api/games/${article.id}?key=${process.env.API_KEY}`)
            .then((res) => res.json())
            .then((resdata) => {
              document.getElementById(`${article.id}`).textContent = `${resdata.publishers.map(publisher => `${publisher.name}, `)}`;
            });

          fetch(`https://api.rawg.io/api/games/${article.id}/movies?key=${process.env.API_KEY}`)
            .then((response) => response.json())
            .then ((responseData) => {
                if(responseData.count > 0){
                  document.getElementById(`video${article.id}`).innerHTML = `
                    <video style="width:400px">
                        <source src="${responseData.results[0].data.max}" type="video/mp4">
                    </video>`;
                    document.getElementById(`pop${article.id}`).classList.add("pop");
                    document.querySelectorAll("video").forEach(video => {
                      video.addEventListener('mouseenter', function () {
                        this.play();
                      });
                      video.addEventListener('mouseleave', function () {
                          this.pause();
                      });
                    }); 
                } else {
                  document.getElementById(`info${article.id}`).classList.add("novideo");
                }
            }).catch((error) => {
                console.error(error)
            });

          });
        
      } else {
        resultsContainer.innerHTML += resultsContent.join("\n");
        articles.map(article => {
          fetch(`https://api.rawg.io/api/games/${article.id}?key=${process.env.API_KEY}`)
            .then((res) => res.json())
            .then((resdata) => {
              document.getElementById(`${article.id}`).textContent = `${resdata.publishers.map(publisher => `${publisher.name}, `)}`;
          });

          fetch(`https://api.rawg.io/api/games/${article.id}/movies?key=${process.env.API_KEY}`)
            .then((response) => response.json())
            .then ((responseData) => {
                if(responseData.count > 0){
                  document.getElementById(`video${article.id}`).innerHTML = `
                    <video style="width:400px">
                        <source src="${responseData.results[0].data.max}" type="video/mp4">
                    </video>`;
                    document.getElementById(`pop${article.id}`).classList.add("pop");
                    document.querySelectorAll("video").forEach(video => {
                      video.addEventListener('mouseenter', function () {
                        this.play();
                      });
                      video.addEventListener('mouseleave', function () {
                          this.pause();
                      });
                    }); 
                } else {
                  document.getElementById(`info${article.id}`).classList.add("novideo")
                }
            }).catch((error) => {
                console.error(error)
            });
        })
      }

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if(entry.isIntersecting){
              entry.target.classList.add("opacity");
              observer.unobserve(entry.target);
            }
          })
        },
        {
          threshold: 0.2,
        }
      );
      document.querySelectorAll(".cardGame").forEach(game => {
        observer.observe(game);
      });           
    
/*SEARCH GAME IN PLATFORM*/
document.querySelectorAll("option").forEach(element =>{
  window.addEventListener("click", (e) =>{
    if(e.target == element){
      a = 0;
      page = 0;
      location.reload();
    }
  })
})      

/*SEARCH LAST GAME IN PLATFORM*/
      window.addEventListener("click", (e) =>{
        if(e.target.tagName === "path"){
            a = 0;
            document.getElementById("platformdiv").style.display = "none";
            page = 1;
            resultsContainer.innerHTML = "";
            platformid = e.target.ownerSVGElement.attributes.id.value;
            const link = document.createElement("a");
            link.href = `#search/${platformid}-platform`;
            link.click();
          }

        if(e.target.tagName === "svg"){
          a = 0;
          document.getElementById("platformdiv").style.display = "none";
          page = 1;
          resultsContainer.innerHTML = "";
          platformid = e.target.attributes.id.value;
          const link = document.createElement("a");
            link.href = `#search/${platformid}-platform`;
            link.click();
        }
      })

/*DISPLAY BTN*/
      if (page < 3 && max > 9){
        resultsContainer.insertAdjacentHTML("beforeend", `<div id="btncontent" class="col-12" style="position:relative; height:70px"><button id="buttonShow">Show More</button></div>`) ;
        document.querySelector("button#buttonShow").addEventListener("click", () =>{
          a = 0;
          document.querySelector("div#btncontent").remove();
          fetchList(`https://api.rawg.io/api/games?key=${process.env.API_KEY}`, cleanedArgument, argument);          
        })
      }
    };  

/*SEARCH WITH SEARCHBAR*/
    const fetchList = (url, argument, all) => {
      page++;
      if(argument === '' && a === 0 && all.split("-")[1] == undefined){
        a = 1; 
        document.getElementById("searchinput").value = "";
        document.getElementById("whereyouare").style.display = "block";
        document.getElementById("présentation").style.display = "block";
        document.getElementById("contenttitle").textContent = `Les jeux les plus attendus pour 2022 :`;
        fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&page_size=9&page=${page}&dates=2022-05-06,2022-12-31&ordering=-added`)
            .then((response) => response.json())
            .then((responseData) => {
              max = responseData.count;
              displayResults(responseData.results);
          });
      }
      else if(isNaN(argument) === false && a === 0){
        a = 1; 
        document.getElementById("searchinput").value = "";
        document.getElementById("whereyouare").style.display = "block";
        document.getElementById("présentation").style.display = "none";

        if(argument.length == 1 && all.split("-")[1] === "platform"){
          document.getElementById("contenttitle").textContent = `PLatform : ${iconName[argument]}`
          fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&parent_platforms=${argument}&page_size=9&page=${page}&dates=2021-01-01,2022-05-06&ordering=-released`)
            .then((response) => response.json())
            .then((responseData) => {
              max = responseData.count;
              displayResults(responseData.results);
          });
        } else if (all.split("-")[1] === "developer"){
          fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&developers=${argument}&page_size=9&page=${page}&dates=2015-12-01,2022-12-31&ordering=-released`)
            .then((response) => response.json())
            .then((responseData) => {
              document.getElementById("contenttitle").textContent = `Jeux du même studio :`;
              max = responseData.count;
              displayResults(responseData.results);
          });
        } else if (all.split("-")[1] === "publisher"){
          fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&publishers=${argument}&page_size=9&page=${page}&dates=2015-12-01,2022-12-31&ordering=-released`)
            .then((response) => response.json())
            .then((responseData) => {
              document.getElementById("contenttitle").textContent = `Jeux du même éditeur :`;
              max = responseData.count;
              displayResults(responseData.results);
          });
        } else if (all.split("-")[1] === "tag"){
          fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&tags=${argument}&page_size=9&page=${page}&dates=2015-12-01,2022-12-31&ordering=-released`)
            .then((response) => response.json())
            .then((responseData) => {
              document.getElementById("contenttitle").textContent = `Jeux de la même typologie :`;
              max = responseData.count;
              displayResults(responseData.results);
          });
        } else if (all.split("-")[1] === "genre"){
          fetch(`https://api.rawg.io/api/games?key=${process.env.API_KEY}&genres=${argument}&page_size=9&page=${page}&dates=2015-12-01,2022-12-31&ordering=-released`)
            .then((response) => response.json())
            .then((responseData) => {
              document.getElementById("contenttitle").textContent = `Jeux du même genre :`;
              max = responseData.count;
              displayResults(responseData.results);
          });
        }
      } else if(a === 0) {
        a = 1; 
        document.getElementById("whereyouare").style.display = "none";
        document.getElementById("présentation").style.display = "none";
        document.getElementById("platformdiv").style.display = "flex";
        let platformchoice = document.getElementById("platformselect").value;
        const firstURL = argument ? `${url}&search=${argument}` : url;
        const finalURL = platformchoice !== "0" ? `${firstURL}&parent_platforms=${platformchoice}&page_size=9&page=${page}` : `${firstURL}&page_size=9&page=${page}`;
        fetch(finalURL)
          .then((response) => response.json())
          .then((responseData) => {
            max = responseData.count;
            displayResults(responseData.results);
          });
      }
        
    };
    
    fetchList(`https://api.rawg.io/api/games?key=${process.env.API_KEY}`, cleanedArgument, argument);
      
  };

  const render = () => {
    pageContent.innerHTML = `
      <section class="page-list">
        <div class="articles row g-4 justify-content-around"><span class="center">Loading...</span></div>
      </section>
    `;

    preparePage();
  };

  render();
};


export default PageList;