import {
    imageFileTypes,
    documentFileTypes,
    videoFileTypes,
    programFileTypes,
    archiveFileTypes,
    musicFileTypes
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
    if (files.length > 0) {
        fileList.innerHTML = `<p>(${files.length})  file(s) ready to organize</p>`;
    } else {
        fileList.innerHTML = `<p>${files.length} file(s) found</p>`;

    }
});

function checkFileType(type) {

    filteredFiles = storedFiles.filter(file => {
        const lowCaseFileName = file.name.toLowerCase();

        if (type === 'photos') {
            return imageFileTypes.some(filetype => lowCaseFileName.endsWith(filetype));
        } else if (type === 'videos') {
            return videoFileTypes.some(filetype => lowCaseFileName.endsWith(filetype));
        } else if (type === 'musics') {
            return musicFileTypes.some(filetype => lowCaseFileName.endsWith(filetype));
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
                musicFileTypes.some(filetype => lowCaseFileName.endsWith(filetype)) ||
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
        // 'return' immediately stops this function here.
        // That means the code below this line will NOT run.
        // This prevents the program from trying to display a list
        // when there are no files to show.
        return;
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
    const musicFolder = zip.folder("Musics");
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
        } else if (musicFileTypes.some(fileType => lowCaseFileName.endsWith(fileType))) {
            musicFolder.file(file.name, file);
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

// ==ACTIVE SECTION HIGHLIGHT==

//Select all file sections
const allSections = document.querySelectorAll('.file-section');
//Loop through each section and add listener each
allSections.forEach(section => {
    //Add a click event listener to each section
    section.addEventListener('click', () => {

        // Remove the "active" class from ALL sections first
        // This ensures that only ONE section looks selected at a time.
        allSections.forEach(sec => sec.classList.remove('active'));

        // Add the "active" class to the section that was just clicked
        // This visually highlights the selected section (using CSS styles).
        section.classList.add('active');

        // Get the custom "data-type" value from the clicked section
        // Example: if <div data-type="photos"> → type = "photos"
        const type = section.dataset.type;

        currentType = type;
        checkFileType(type);
        console.log(type);
    });
});
