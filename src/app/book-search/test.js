const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
  fetch("https://openlibrary.org/search.json?q=alchemist", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));