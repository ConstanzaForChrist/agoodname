const res = await fetch('./business.json');
const data = await res.json();
console.log(data);

import { createElement } from '../utils/utils.js';
export default class cardTemplate extends HTMLElement {
  constructor() {
    super();
    this.businesses = data;
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
    return arr.map((data) => this.#createCard(data));
  }

  connectedCallback() {
    const template = document.getElementById('card-template');
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    const cardContainer = this.querySelector('#card-container');
    const directoryLinks = this.querySelectorAll('.directory-link');
    // Prevent page from loading
    // render corresponding data
    // Query the template rather than the whole document
    const cards = this.#generateCards(data[`${window.location.pathname}`]);
    cardContainer.append(...cards);
    window.addEventListener('click', (e) => {
      const currentItem = e.target;
      const currentData = currentItem.name;
      if (currentItem.className === 'directory-link') {
        const cards = this.#generateCards(this.businesses[currentData]);
        cardContainer.replaceChildren(...cards);
      }
    });
  }
}

customElements.define('card-template', cardTemplate);
