let cart = [];
let modalQt = 1;
let modalKey = 0;

const qs = (el) =>  document.querySelector(el);
const qsa = (el) =>  document.querySelectorAll(el);


//Listagem das pizzas
pizzaJson.map((item, index) => {
    //console.log(item);
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);
    
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        qs('.pizzaInfo--qt').innerHTML = modalQt;

        //console.log('Pizza clicada é a '+ key);
        qs('.pizzaWindowArea').style.opacity = 0.5;
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() =>{
            qs('.pizzaWindowArea').style.opacity = 1;
        }, 100);
    });

    

    qs('.pizza-area').append(pizzaItem);
});

//Eventos do Modal
function closeModal(){
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() =>{
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if(modalQt > 1){
        modalQt -= 1;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

qs('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt += 1;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
});

qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

qs('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }
    else{
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    
    updateCart();
    closeModal();
});


qs('.menu-openner').addEventListener('click',() => {
    if(cart.length > 0){
        qs('aside').style.left = '0';
    } 
});

qs('.menu-closer').addEventListener('click',() => {
    qs('aside').style.left = '100vw';
});

function updateCart(){

    qs('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';

        let deduction = 0;
        let subTotal = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

            subTotal += pizzaItem.price * cart[i].qt;

            let cartItem = qs('.models .cart--item').cloneNode(true);

            let pizzaSize;

            switch(cart[i].size){
                case 0:
                    pizzaSize = 'P';
                    break;

                case 1:
                    pizzaSize = 'M';
                    break;

                case 2:
                    pizzaSize = 'G';
                    break;
            }
            let cartDescription = `${pizzaItem.name} (${pizzaSize})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = cartDescription;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1){
                    cart[i].qt -= 1;
                }
                else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt += 1;
                updateCart();
            });
            
            
            qs('.cart').append(cartItem);
        }
        deduction = subTotal * 0.1;
        total = subTotal - deduction;

        qs('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${deduction.toFixed(2)}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }
    else{
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }
}