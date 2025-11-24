const res = await fetch('./business.json');
const data = await res.json();
console.log(data);

import { createElement } from '../utils/utils.js';
export default class cardTemplate extends HTMLElement {
  businesses = data;
  constructor() {
    super();
  }
  // Private methods
  #createCard(obj) {
    const parent = createElement('div');
    let image;
    parent.className = 'card';
    const title = createElement('h2');
    title.className = 'name';
    title.textContent = obj.name;
    const address = createElement('p');
    address.className = 'addresss';
    address.textContent = obj.address;
    const website = createElement('a');
    website.href = obj.website;
    // website.textContent = obj.name
    title.append(website);
    parent.append(title, address);
    if (obj.image) {
      image = createElement('img');
      image.alt = obj.name;
      image.src = obj.image;
      website.append(image);
      parent.append(website);
    }
    return parent;
  }
  #generateCards(arr) {
    console.log(arr);
    console.log(this.businesses);

    return arr.map((data) => this.#createCard(data));
  }

  connectedCallback() {
    const template = document.getElementById('card-template');
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    const cardContainer = this.querySelector('#card-container');
    const categoryContainer = this.querySelector('#category-container');
    const businessContainer = this.querySelector('#businesses-container');
    const directoryLinks = this.querySelectorAll('.directory-link');
    // Prevent page from loading
    // render corresponding data
    // Query the template rather than the whole document
    const urlLocation = window.location.pathname;
    const currentData = this.businesses[`${window.location.pathname}`];
    
    if (urlLocation === '/directory/business.html') {
      let currentCategory = '';
      categoryContainer.classList.add('business-categories');
      console.log('Making Cards');
      const categories = Object.entries(currentData.categories);
      const titles = categories.map((category) => {
        const div = document.createElement('div');
        const cardImg = document.createElement('img');
        cardImg.src = category[1].img;
        div.className = 'card';
        const title = document.createElement('h3');
        title.textContent = category[0];
        div.style.backgroundImage = `url('${category[1].img}')`;
        div.append(title);
        div.addEventListener('click', (e) => {
          currentCategory = e.target.textContent;
          const currentData =
            data[window.location.pathname].categories[currentCategory]
              .businesses;
          categoryContainer.style.display = 'none';
          const clickedCategory = currentData.map((business) => {
            const newCard = this.#createCard(business)
            // const newCard = document.createElement('div');
            // newCard.className = 'card';
            // const title = document.createElement('h2');
            // const address = document.createElement('p');
            // const number = document.createElement('p');
            // const website = document.createElement('a');
            // const img = document.createElement('img');
            // title.textContent = business.name;
            // address.textContent = business.address;
            // number.textContent = business.number;
            // website.textContent = business.name;
            // website.href = business.website
            // img.src = business.image;
            // newCard.append(title, img, address, number, website);
            return newCard;
          });
          console.log(clickedCategory);
          businessContainer.append(...clickedCategory);
        });
        return div;
      });
      categoryContainer.append(...titles);
      console.log(categories);
      return;
    }

    const cards = this.#generateCards(currentData);
    console.log(currentData);
    cardContainer.append(...cards);
  }
}

customElements.define('card-template', cardTemplate);
