const res = await fetch('./business.json');
const data = await res.json();

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
    address.className = 'address';    
    address.textContent = obj.address;
    const website = createElement('a');
    const websiteLink = createElement('a');
    website.href = obj.website;
    websiteLink.textContent = `Click here to go to ${obj.name} website`
    websiteLink.href = obj.website
    title.append(website);
    parent.append(title, websiteLink, address, website);
    if (obj.image) {
      console.log("image");
      
      image = createElement('img');
      image.alt = obj.name;
      image.src = obj.image;
      website.append(image);
      parent.append(website);
    }else {
      
    }
    return parent;
  }
  #generateCards(arr) {

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
      const cardTitle = document.querySelector('#card-title')
      let currentCategory = '';
      categoryContainer.classList.add('business-categories');
      const categories = Object.entries(currentData.categories);
      const titles = categories.map((category) => {
        const cardParent = document.createElement('div')
        const div = document.createElement('div');
        const cardImg = document.createElement('img');
        cardImg.src = category[1].img;
        div.className = 'card';
        const title = document.createElement('h3');
        title.className = 'business-category'
        title.textContent = category[0];
        div.style.backgroundImage = `url('${category[1].img}')`;
        
        div.addEventListener('click', (e) => {
          currentCategory = e.target.textContent;
          cardTitle.textContent = e.target.textContent
          const currentData =
            data[window.location.pathname].categories[currentCategory]
              .businesses;

          categoryContainer.style.display = 'none';
          const clickedCategory = currentData.map((business) => {
            const newCard = this.#createCard(business);
            
            return newCard;
          });
          businessContainer.append(...clickedCategory);
        });
        cardParent.append(title,div);
        return cardParent;
      });
      categoryContainer.append(...titles);
      return;
    }

    const cards = this.#generateCards(currentData);
    cardContainer.append(...cards);
  }
}
customElements.define('card-template', cardTemplate);
