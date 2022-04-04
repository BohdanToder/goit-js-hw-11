import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import cardsMarkup from './templates/cardsMarkup.hbs';
import FetchDataApi from './js/fetchData';
import './css/styles.css';

const fetchData = new FetchDataApi();
const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
let galleryLightBox;
const observerTarget = document.querySelector('.intersection-observer');
const observerOptions = {
    rootMargin: '100px',
};
const observer = new IntersectionObserver(onScroll, observerOptions);
observer.observe(observerTarget);

formRef.addEventListener('submit', onFormSubmit);

async function onFormSubmit(event) {

    try {
        event.preventDefault();

        fetchData.searchQuery = event.currentTarget.elements.searchQuery.value.trim().toLowerCase();
        fetchData.resetPage();
        if (fetchData.searchQuery === '') { 
            Notify.failure('Please enter a search query.');
            return;
        } 

        const imagesData = await fetchData.getImages();
        const { hits, totalHits } = imagesData        
        if (hits.length !== 0) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
        observerTarget.style.display = 'block';
        }

        renderMarkup(hits);
    } catch (error) {
        console.log(error.message);
    }

}

async function onScroll(newImagesData) {

    newImagesData.forEach(async imageData => {

        try {
            if (imageData.isIntersecting && fetchData.searchQuery !== '') {
                const images = await fetchData.getImages();
                const { hits, totalHits } = images;
                const lastPage = Math.ceil(totalHits / 40);

                galleryRef.insertAdjacentHTML('beforeend', cardsMarkup(hits));
                galleryLightBox.refresh();
                smoothScroll();

                if (fetchData.page > lastPage) {
                Notify.info("We're sorry, but you've reached the end of search results.");
                observerTarget.style.display = 'none';
                }
            }
            
        } catch (error) {
            console.log(error.message);
            }
    });

}

function renderMarkup(imagesData) {

    if (imagesData.length === 0) {
        galleryRef.innerHTML = '';
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
    }

    galleryRef.innerHTML = cardsMarkup(imagesData);

    galleryLightBox = new SimpleLightbox('.gallery a', {
        captionDelay: 250,
    });

}

function smoothScroll() {

    const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });

}