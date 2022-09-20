const recipes = document.querySelector('.recipes');
const form = document.querySelector('form');
const recipeList = document.getElementById("recipe-list");


let db;
const dbName = 'recipes';
const storeName ='tb_recipes' ;

const createDb = ()=>{
  if(window.indexedDB){
    //da nome e versão do banco
    const request = window.indexedDB.open(dbName,2);

    request.onsuccess = (event) =>{
      db = request.result;
      console.log("Sucesso",event,db);
      getData();
  };

    request.onupgradeneeded = (event) =>{

      db = event.target.result;

      const objectStore = db.createObjectStore(storeName,
      {
        keyPath:'id',
        autoIncrement:true
      }  
    );
    objectStore.createIndex('title','title',{unique: false});

    }

    

    request.onerror = (event) =>{
      console.log(event)
    }

  }else{
    console.log("Não tem suporte para indexedDB ")
  }
}

document.addEventListener('DOMContentLoaded', function() {
    // js relacionado  nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
    // abre  form de receitas
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {edge: 'left'});
    createDb();
  });





  form.addEventListener('submit',event =>{
    event.preventDefault();



    const recipe = {
      title:form.title.value,
      ingredients:form.ingredients.value,
      time:form.time.value,
    }

    let transaction = db.transaction([storeName], 'readwrite');
    let objectStore = transaction.objectStore(storeName);
    let request = objectStore.add(recipe);

    request.onsuccess = () => {
      form.time.value ="";
      form.ingredients.value = ""
      form.title.value ="";
    };

    transaction.oncomplete = (event)=>{
      console.log('sucesso',event);
      getData();
    }
    
    transaction.onerror = (event)=>{
      console.log('erro',event)
    }


  });



const getData = () =>{
  cleanList();
  let objectStore = db.transaction(storeName).objectStore(storeName);

  objectStore.openCursor().onsuccess = (event) =>{
    const cursor = event.target.result;

    if(cursor){
      renderRecipe(cursor.value.title,cursor.value.ingredients,cursor.value.time,cursor.value.id);

      const deleteButton = document.querySelectorAll('.delete-button');
      //deleteButton.setAttribute('recipe-id', cursor.value.id);
      for(let i = 0 ; i < deleteButton.length; i++){
        deleteButton[i].addEventListener('click',onRemoveItem );
      }

      cursor.continue();
    }
  }
}





const onRemoveItem = (eventClick)=>{

    const recipeId =  parseInt(eventClick.target.getAttribute('recipe-id'), 10);
    console.log(recipeId)
  
    const deleteTransaction = db.transaction([storeName],'readwrite');
    const objectStore = deleteTransaction.objectStore(storeName);
    const request = objectStore.delete(recipeId);
  
    request.onsuccess = (event) => {
      console.log('request success ', event);
    }
  
    deleteTransaction.oncomplete = (event)=>{
      console.log(`deletado com sucesso id ${recipeId}`,event);
      getData();
    }

    deleteTransaction.onerror = (event) => {
      console.log('delete transaction error', event);
    }



}
const cleanList = () => {
  recipeList.innerHTML = '';
}



  const renderRecipe = (title,ingredients,time,id) => {
      const html = `
      <div class="card-panel recipe white row" >
        <img src="/assets/icon.png" class="thumb" alt="thumb">
        <div class="recipe-details">
          <div class="recipe-title">${title}</div>
          <div class="recipe-ingredients">${ingredients}</div>
          <div class="recipe-time">Tempo de Preparo: ${time}</div>
        </div>
        <div class="recipe-delete">
          <i class="material-icons delete-button" recipe-id=${id}>delete_outline</i>
        </div>
        </div>`;

        recipes.innerHTML += html;
  }
