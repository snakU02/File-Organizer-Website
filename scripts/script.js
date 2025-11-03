import { imageFileTypes, documentFileTypes, videoFileTypes, programFileTypes, archiveFileTypes } from "./fileTypes.js";

const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const outputContainer = document.querySelector('.js-output-container');

let storedFiles = [];
let filteredFiles = [];
let currentType = '';
fileInput.addEventListener('change', () => {
    const files = fileInput.files;
    storedFiles = Array.from(fileInput.files);
    console.log(storedFiles);
    if (files.length === 0) {
        fileList.textContent = 'No files selected';
    }
});

function checkFileType(type) {
    if (type === 'photos') {
        filteredFiles = storedFiles.filter(file =>
            imageFileTypes.some(filetype => file.name.endsWith(filetype)));
    } else if (type === 'videos') {
        filteredFiles = storedFiles.filter(file =>
            videoFileTypes.some(filetype => file.name.endsWith(filetype)));
    } else if (type === 'documents') {
        filteredFiles = storedFiles.filter(file =>
            documentFileTypes.some(filetype => file.name.endsWith(filetype)));
    } else if (type === 'programs') {
        filteredFiles = storedFiles.filter(file =>
            programFileTypes.some(filetype => file.name.endsWith(filetype)));
    } else if (type === 'archives') {
        filteredFiles = storedFiles.filter(file =>
            archiveFileTypes.some(filetype => file.name.endsWith(filetype)));
    }


    if (filteredFiles.length === 0) {
        outputContainer.innerHTML = `<p>No ${type} found</p>`;
    }

    let html = '';
    filteredFiles.forEach((file, index) => {
        html += `<p>${file.name} <button class="removeBtn" data-id="${index}">Remove</button></p>`;
    });

    outputContainer.innerHTML = html;
    deleteBtn();
    console.log(html);
}

function deleteBtn() {
    const removeBtn = document.querySelectorAll('.removeBtn');

    removeBtn.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-id');
            const filestoDelete = filteredFiles[index];

            storedFiles = storedFiles.filter(file => file.name !== filestoDelete.name)
            checkFileType(currentType);
            console.log(storedFiles);
        });
    });
}


document.querySelector('.js-photo-click').addEventListener('click', () => {
    currentType = 'photos';
    checkFileType('photos')
});
document.querySelector('.js-video-click').addEventListener('click', () => { checkFileType('videos') });
document.querySelector('.js-document-click').addEventListener('click', () => { checkFileType('documents') });
document.querySelector('.js-program-click').addEventListener('click', () => { checkFileType('programs') });
document.querySelector('.js-archive-click').addEventListener('click', () => { checkFileType('archives') });



