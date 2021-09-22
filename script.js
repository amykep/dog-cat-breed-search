//object for breed search
let newanimals = {
  dogs: [],
  cats: []
}

//cat breed search function
document.querySelector("#cat-form").addEventListener("submit", (e) =>
{
  e.preventDefault();

  const catName = document.querySelector("#cat-name").value;
  if (catName == "" || catName == null)
  {
    document.getElementById('id01').style.display = 'block';

  } else
  {
    let animals = JSON.parse(localStorage.getItem("animals"));
    if (animals === null)
    {
      animals = newanimals;
    }
    // amy----added function to prevent duplicate in localStorage and clear inputfield
    if (animals.cats !== "" && animals.cats !== null && animals.cats.includes(catName))
    {
      document.getElementById('cat-name').value = null;
      show();
      getCatBreed(catName);
      return
    }
    else
    {
      animals.cats.push(catName);
      animals = JSON.stringify(animals);
      localStorage.setItem("animals", animals);
      document.getElementById('cat-name').value = null;
      show();
      getCatBreed(catName);


    }
  }
});

//dog breed search function
document.querySelector("#dog-form").addEventListener("submit", (e) =>
{
  e.preventDefault();

  const dogName = document.querySelector("#dog-name").value;
  if (dogName == "" || dogName == null)
  {
    document.getElementById('id01').style.display = 'block'

  } else
  {
    let animals = JSON.parse(localStorage.getItem("animals"));
    if (animals === null)
    {
      animals = newanimals;
    }
    // amy----added function to prevent duplicate in localStorage
    if (animals.dogs !== "" && animals.dogs !== null && animals.dogs.includes(dogName))
    {
      document.getElementById('dog-name').value = null;
      show();
      getDogBreed(dogName);

      return
    }
    else
    {
      animals.dogs.push(dogName);
      animals = JSON.stringify(animals);
      localStorage.setItem("animals", animals);
      document.getElementById('dog-name').value = null;
      show();
      getDogBreed(dogName);


    }
  }
});

//fetch for cat breed facts
const getCatBreed = (catName) =>
{
  fetch(`https://api.thecatapi.com/v1/breeds/search?q=${catName}`)
    .then((res) =>
    {
      console.log(res);
      return res.json();
    })

    .then(async (data) =>
    {
      console.log(data);

      if (data.length === 0)
      {
        document.querySelector("#facts-container").textContent =
          "   ";
        document.getElementById('id02').style.display = 'block'
        // Amy remove item with no data from previous search
        var info = JSON.parse(localStorage.getItem("animals"));
        info.cats.pop();
        info = JSON.stringify(info)
        localStorage.setItem("animals", info)
        console.log("info", info)
        show()
      } else
      {
        //fetch for cat picture
        for await (item of data)
        {
          const imgId = await item.reference_image_id;
          await fetch(`https://api.thecatapi.com/v1/images/${imgId}`)
            .then((res) =>
            {
              return res.json();
            })
            .then((dataImage) =>
            {
              template = `
                <div>
                <h3> Search result for: </h3>
                <ul>
                  
                  <li>Name: ${data[0].name}</li>
                  <li>Country:  ${data[0].origin}</li>
                  <li>Weight:  ${data[0].weight.metric}</li>
                  <li>Temperament: ${data[0].temperament}</li>
                  <li>Description: ${data[0].description}</li>
                </ul>
                </div>
                <div>
                    <img src="${dataImage.url}"/>
                    
                </div>
            `;
            });
          document.querySelector("#facts-container").innerHTML = template;
        }
      }
    });
};

//fetch for dog breed facts
const getDogBreed = (dogName) =>
{
  fetch(`https://api.thedogapi.com/v1/breeds/search?q=${dogName}`)
    .then((res) =>
    {
      console.log(res);
      return res.json();
    })

    .then(async (data) =>
    {
      console.log(data);

      if (data.length === 0)
      {
        document.querySelector("#facts-container").textContent =
          "   ";
        document.getElementById('id02').style.display = 'block';

        // Amy remove item with no data from previous search
        var info = JSON.parse(localStorage.getItem("animals"));
        info.dogs.pop();
        info = JSON.stringify(info)
        localStorage.setItem("animals", info)
        console.log("info", info)
        show()
      } else
      {
        //fetch for dog picture
        for await (item of data)
        {
          const imgId = await item.reference_image_id;
          await fetch(`https://api.thedogapi.com/v1/images/${imgId}`)
            .then((res) =>
            {
              return res.json();
            })
            .then((dataImage) =>
            {
              template = `
                <div>
                <h3> Search result for: </h3>
                <ul>
                  
                  <li>Name: ${data[0].name}</li>
                  <li>Life:  ${data[0].life_span}</li>
                  <li>Weight:  ${data[0].weight.metric}</li>
                  <li>Temperament: ${data[0].temperament}</li>
                  
                </ul>
                </div>
                <div>
                    <img src="${dataImage.url}"/>
                    
                </div>
            `;
            });
          document.querySelector("#facts-container").innerHTML = template;
        }
      }
    });
};

//previous breed search function
const show = () =>
{
  let animals = JSON.parse(localStorage.getItem("animals"));
  if (animals === null)
  {
    animals = newanimals;
  }
  console.log("animals", animals);

  //previous cat breed searches
  let catEl = "";
  for (var i = 0; i < animals.cats.length; i++)
  {
    catEl += `<il id="${i}"> ${animals.cats[i]} <br/></il> `;
  }
  document.querySelector("#catsearches").innerHTML = catEl;

  //previous dog breed searches
  let dogEl = "";
  for (var i = 0; i < animals.dogs.length; i++)
  {
    dogEl += `<il id="${i}"> ${animals.dogs[i]} <br/></il>`;
  }
  document.querySelector("#dogsearches").innerHTML = dogEl;

};

//show previous search
show();

// retrieve previous cat breed search 
document.querySelector("#catsearches").addEventListener("click", function (event)
{
  event.preventDefault();

  let animals = JSON.parse(localStorage.getItem("animals"));
  if (animals === null)
  {
    animals = newanimals;
  }

  let k = event.target.id;


  let catName = animals.cats[k];
  getCatBreed(catName);
});

//retrieve previous dog breed search
document.querySelector("#dogsearches").addEventListener("click", function (event)
{
  event.preventDefault();
  let k = event.target.id;

  let animals = JSON.parse(localStorage.getItem("animals"));
  if (animals === null)
  {
    animals = newanimals;
  }

  let dogName = animals.dogs[k];
  getDogBreed(dogName);
});

//clear previous search button function
document.querySelector('#clearbutton').addEventListener('click', function () { clear() });

const clear = () =>
{
  animals = newanimals;
  animals = JSON.stringify(animals);
  localStorage.setItem("animals", animals);
  targetDivCat = document.querySelector("#catsearches");
  targetDivCat.innerHTML = "  ";
  targetDivDog = document.querySelector("#dogsearches");
  targetDivDog.innerHTML = "   ";

}

