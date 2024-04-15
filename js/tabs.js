export const tabs = function () {

    const links = document.querySelectorAll('.tabs__link');
    const content = document.querySelectorAll('.tabs__content');

    const showContent = (event, index) => {
        event.preventDefault();
        let link =  event.target;
        links.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
        content.forEach(item => item.classList.remove('active'));
        content[index].classList.add('active');
    }

    links.forEach((link, index) => {
        link.addEventListener('click', (event) => showContent(event, index));
    });
}

tabs();
