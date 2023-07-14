const form = document.querySelector('.top-banner form');   //para lo relacionado con el formulario 
//devuelve el primer elemento que coincide con el selector especificado, si no encuentra devuelve null
//en este caso seleccionamos el primer formulario que se encuentre dentro de top-banner

///IMPORTANTE
//# -> para los id, con punto (.) las clases y sin punto las etiquetas.

const input = document.querySelector('.top-banner input');  //la ciudad a buscar
const msg = document.querySelector('.top-banner .msg');  //mostrar resultados
const list = document.querySelector('.ajax-section .cities');  //la lista de las ciudades desordenadas

const apiKey = "28f89c294e6c9207e50123b9fbfba30f";

form.addEventListener("submit", e => { 
    e.preventDefault();  //e es un parámetro que representa el evento en si
    //preventDefault lo que hace es que no se recarge la pagina cada vez que se le da a submit
    const inputVal = input.value;  //input esta dentro del form y en inputVal guardamos el nombre de lo que ponemos en el buscador

    //para comprobar si tenemos alguna ciudad en la lista...
    //de la lista de ciudades list, selecciono todas las que sean de clase ciudad
    const componentesLista = list.querySelectorAll('.ajax-section .city');
    const componentesListaArray = Array.from(componentesLista); //creamos un array con los componentesLista

    if (componentesListaArray.length > 0){   //si el tamaño es mayor que 0
        const arrayFiltrado = componentesListaArray.filter(el => {  
            let contenido = '';
            //madrid,es
            if(inputVal.includes(',')){
                if(inputVal.split(",")[1].length > 2){  // en vez de madrid,es seria madrid,ess y esta mal
                    inputVal = inputVal.split(",")[0];   //el inputVal pasara a ser solo la ciudad
                    contenido = el.querySelector('.city-name span').textContent.toLowerCase(); //nombre de la ciudad
                    //se accede al nombre con textContent
                } else{
                    contenido = el.querySelector('.city-name').dataset.name.toLowerCase();  //aqui el nombre y su abreviatura
                    // pillo el nombre de la ciudad a minusculas 
                }
            } else{
                //madrid
                contenido = el.querySelector('.city-name span').textContent.toLocaleLowerCase();
            }
            return contenido == inputVal.toLowerCase();  //comprobamos a ver si el contenido es igual que el inputVal
        });

        if (arrayFiltrado.length > 0){   //si la ciudad consultada esta en el array
            msg.textContent = `Ya has preguntado por el tiempo de ${
                arrayFiltrado[0].querySelector(".city-name span").textContent
            } ...se mas especifico`;
        form.reset();   //reseteo el formulario
        input.focus(); //para centrarnos en el texto
        return;
        }
    }


    //ajax
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
    
    fetch(url)     //enviamos solicitud GET a la api, y fetch devuelve una promesa
        .then(response => response.json())   //convertimos la respuesta en formato JSON y devuelve otra promesa
        .then(data => {    //desestructuramos el objeto data para obtener los datos que queremos
            const { main, name, sys, weather } = data;
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;  //para el icono del tiempo
        
        const li = document.createElement("li");   //creamos una caja, en bloque, em vez de poner un html con dos li ponemos eso
        li.classList.add("city");  //a li le aplicamos la clase city para luego el css aplicarle lo de city
        //creamos una cadena de texto llamada markup, donde representa el contenido HTML que insertaremos en li
        const markup = ` 
        <h2 class="city-name" data-name="${name},${sys.country}"> 
        <span>${name}</span>
        <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup>
        </div>
        <figure>
        <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
        <figcaption>${weather[0]["description"]}</figcaption>
        </figure>`;       /*span sirve para agrupar dentro de una linea*/ 
        li.innerHTML = markup;   //para asociar markup al contenido li
        list.appendChild(li);   //añadimos li a la lista general
    })
    .catch(() => {
        msg.textContent = "Por favor, pon el nombre de una ciudad valida 😩";
    }); 
  msg.textContent = "";
  form.reset();
  input.focus();
}); 