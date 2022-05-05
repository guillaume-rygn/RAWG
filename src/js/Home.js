const Home = (argument = '') => {
  document.getElementById("whereyouare").style.display = "none";
  document.getElementById("présentation").style.display = "block";
  document.getElementById("platformdiv").removeAttribute('style');
  document.getElementById("platformselect").value = 0;
  document.getElementById("searchinput").value = "";
  const a = document.createElement("a");
    a.href = `#search/${argument}`;
    a.click();
};
export default Home;