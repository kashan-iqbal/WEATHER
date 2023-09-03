// www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
// www.themealdb.com/api/json/v1/1/lookup.php?i=52772

const search = document.getElementById("search");
const meallist = document.getElementById("meal");
const modalBox = document.getElementById("staticBackdrop");

search.addEventListener("click", getMealList);
meallist.addEventListener("click", getModalData);

async function getMealList(e) {
  e.preventDefault();
  let SearchTxt = document.getElementById("input").value.trim();
  // https://www.themealdb.com/api/json/v1/1/filter.php?i=${SearchTxt}
  // https://www.themealdb.com/api/json/v1/1/search.php?s=cake
  // https://www.themealdb.com/api/json/v1/1/categories.php
  try {
    const responser = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${SearchTxt} `
    );
    const data = await responser.json();
    let html = "";
    if (data.meals) {
      data.meals.forEach((element) => {
        html += `
            <div  class="card "  style="width: 18rem" data-id=${element.idMeal}>
            <div class="image">
              <img src="${element.strMealThumb}" class="card-img-top" alt="" />
      
            </div>
            <div class="card-body">
              <h5 class="card-title text-center" >${element.strMeal}</h5>
            
              <!-- Button trigger modal -->
              <button
              type="button"
              class="btn btn-primary mt-2 recipe-btn"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              id="modalBtn"
            >
              Check Recipe Detail
            </button>
            
            </div>
          </div>
      
      
            </div>
          </div>
        `;
      });
      meallist.innerHTML = html;
    }
  } catch (err) {
    console.log(err, "error");
  }

  input.value = "";
}

async function getModalData(e) {
  if (e.target.classList.contains("recipe-btn")) {
    const modal = e.target.parentElement.parentElement;
    const _id = modal.dataset.id;
    try {
      const reponse = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${_id}`
      );
      const data = await reponse.json();
      getModalData(data.meals);
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
  function getModalData(meal) {
    meal = meal[0];
    html = "";
    console.log(meal);

    const tabelItem = [];
    for (let i = 1; i <= 20; i++) {
      const item = meal[`strIngredient${i}`];
      if (item !== "") {
        tabelItem.push(`${item} `);
      }
    }
    const tabelQuantity = [];
    for (let i = 1; i <= 20; i++) {
      const Quantity = meal[`strMeasure${i}`];
      if (Quantity !== "") {
        tabelQuantity.push(`${Quantity}`);
      }
    }

    console.log(tabelItem);
    console.log(tabelQuantity);

    tabelBodyHtml = ""

    if (tabelItem.length === tabelQuantity.length) {
      for (let i = 0; i < tabelItem.length; i++) {
        tabelBodyHtml += `
  <tr>
  <td scope="col">${i + 1}</td>
  <td scope="col">${tabelItem[i]}</td>
  <td scope="col">${tabelQuantity[i]}</td>
  </tr>
  `;
      }
    }

    html += `
    <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">${meal.strMeal}</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
      <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Ingredient</th>
      <th scope="col">Quantity</th>
    </tr>
  </thead>  
  <tbody >

${tabelBodyHtml}

  </tbody>
</table>

</br>
        <p>
        ${meal.strInstructions}

        </p>
  
      </div>
      <div class="modal-footer align-item-center">
        <button
          type="button"
          class="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Close
        </button>
        <a href="${meal.strYoutube}" target="_blank" type="button" class="btn btn-primary"><i class="fa-brands fa-youtube"></i></a>
      </div>
    </div>
  </div>
    `;
    modalBox.innerHTML = html;
  }
}
