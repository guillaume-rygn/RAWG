import 'bootstrap';
import '../style/bootstrap.scss';
import '../style/index.scss';
import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";

import routes from './routes';

let search = document.getElementById("searchinput");


/*-------------------------------------*/

/*ONE PAGE PROJECT */

const callRoute = () => {
  const { hash } = window.location;
  const pathParts = hash.substring(1).split('/');

  const pageName = pathParts[0];
  const pageArgument = pathParts[1] || '';
  const pageFunction = routes[pageName];

  if (pageFunction !== undefined) {
    pageFunction(pageArgument);
  }
};

window.addEventListener('hashchange', () => callRoute());
window.addEventListener('DOMContentLoaded', () => callRoute());

["click", "keypress"].forEach(ev =>{
  window.addEventListener(ev, function(e){
    if(e.target.id === "searchbtn" || e.key === "Enter" && search.value !== " " && search.value !== ""){
      document.getElementById("présentation").style.display = "none";
      document.getElementById("platformselect").value = 0;
      const a = document.createElement("a");
        a.href = `#search/${search.value}`;
        a.click();
    }
  });
});

document.getElementById("title").addEventListener("click", () => {
  document.getElementById("whereyouare").style.display = "none";
  document.getElementById("présentation").style.display = "block";
  document.getElementById("platformdiv").removeAttribute('style');
  document.getElementById("platformselect").value = 0;
  document.getElementById("searchinput").value = "";
  const a = document.createElement("a");
    a.href = `#search/${search.value}`;
    a.click();
})