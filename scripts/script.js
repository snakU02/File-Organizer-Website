import {
    imageFileTypes,
    documentFileTypes,
    videoFileTypes,
    programFileTypes,
    archiveFileTypes,
} from "./fileTypes.js";

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

    filteredFiles = storedFiles.filter(file => {
        const lowCaseFileName = file.name.toLowerCase();

        if (type === 'photos') {
            return imageFileTypes.some(filetype => lowCaseFileName.endsWith(filetype));
        } else if (type === 'videos') {
            return videoFileTypes.some(filetype => lowCaseFileName.endsWith(filetype));
        } else if (type === 'documents') {
            return documentFileTypes.some(filetype => lowCaseFileName.endsWith(filetype));
        } else if (type === 'programs') {
            return programFileTypes.some(filetype => lowCaseFileName.endsWith(filetype));
        } else if (type === 'archives') {
            return archiveFileTypes.some(filetype => lowCaseFileName.endsWith(filetype));
        } else if (type === 'others') {

            // This part checks if the file is a photo, video, document, program, or archive.
            // The `.some()` function checks if the file name ends with any of the extensions in the list.
            // For example, if file.name = "cat.jpg", and imageFileTypes = ['.jpg', '.png'],
            // then `imageFileTypes.some(filetype => file.name.endsWith(filetype))` will return TRUE.
            if (
                imageFileTypes.some(filetype => lowCaseFileName.endsWith(filetype)) || // Is it a photo file?
                videoFileTypes.some(filetype => lowCaseFileName.endsWith(filetype)) || // Is it a video file?
                documentFileTypes.some(filetype => lowCaseFileName.endsWith(filetype)) || // Is it a document file?
                programFileTypes.some(filetype => lowCaseFileName.endsWith(filetype)) || // Is it a program file?
                archiveFileTypes.some(filetype => lowCaseFileName.endsWith(filetype)) // Is it an archive file?
            ) {
                // If the file matches ANY of these types (photo, video, etc.),
                // we do NOT want to include it in the "Others" list.
                // So we return false → meaning "don't keep this file".
                return false;
            } else {
                // If the file did NOT match any of the types above,
                // then it belongs in the "Others" category.
                // So we return true → meaning "keep this file in the filtered list".
                return true;
            }
        }
    });

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
//make the function async to use the 'await'
document.getElementById('organizeBtn').addEventListener('click', async () => {
    //create a new “zip folder” in memory using the JSZip library
    const zip = new JSZip();
    //Create subfolders inside the zip
    const photoFolder = zip.folder("Photos");
    const videoFolder = zip.folder("Videos");
    const docFolder = zip.folder("Documents");
    const progFolder = zip.folder("Programs");
    const archiveFolder = zip.folder("Archives");
    const otherFolder = zip.folder("Others");

    //loop through every file the user uploaded
    storedFiles.forEach((file) => {
        //make it lowercase
        const lowCaseFileName = file.name.toLowerCase();

        if (imageFileTypes.some(fileType => lowCaseFileName.endsWith(fileType))) {
            photoFolder.file(file.name, file);
        } else if (videoFileTypes.some(fileType => lowCaseFileName.endsWith(fileType))) {
            videoFolder.file(file.name, file);
        } else if (documentFileTypes.some(fileType => lowCaseFileName.endsWith(fileType))) {
            docFolder.file(file.name, file);
        } else if (programFileTypes.some(fileType => lowCaseFileName.endsWith(fileType))) {
            progFolder.file(file.name, file);
        } else if (archiveFileTypes.some(fileType => lowCaseFileName.endsWith(fileType))) {
            archiveFolder.file(file.name, file);
        } else {
            otherFolder.file(file.name, file);
        }
    });

    /*
    zip.generateAsync() compresses everything into one file.
    { type: "blob" } means “make it as a binary file” that the browser can download.
    Use await because this process can take some time.
    */
    const content = await zip.generateAsync({ type: "blob" });

    /*
    This line comes from the FileSaver.js library.
    It triggers a “save as…” download of the zip we just made.
    content → the zip data we built
    "Organized_Files.zip" → the name of the downloaded file
    */
    saveAs(content, "Organize-File.zip");

    //clear 
    storedFiles = [];
    filteredFiles = [];

});

document.querySelector('.js-photo-click').addEventListener('click', () => {
    currentType = 'photos';
    checkFileType('photos')
});
document.querySelector('.js-video-click').addEventListener('click', () => {
    currentType = 'videos';
    checkFileType('videos')
});
document.querySelector('.js-document-click').addEventListener('click', () => {
    currentType = 'documents';
    checkFileType('documents')
});
document.querySelector('.js-program-click').addEventListener('click', () => {
    currentType = 'programs';
    checkFileType('programs')
});
document.querySelector('.js-archive-click').addEventListener('click', () => {
    currentType = 'archives';
    checkFileType('archives')
});
document.querySelector('.js-other-click').addEventListener('click', () => {
    currentType = 'others';
    checkFileType('others');
});



