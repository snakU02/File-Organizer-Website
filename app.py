from flask import Flask, render_template, request, send_file, jsonify
import os
import shutil
import tempfile
import zipfile

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join(tempfile.gettempdir(), "uploaded_files")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Folder categories
FOLDERS = {
    "Documents": [".pdf", ".docx", ".doc", ".txt", ".pptx", ".ppt", ".xlsx", ".xls", ".csv"],
    "Pictures": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".svg", ".webp"],
    "Music": [".mp3", ".wav", ".flac", ".m4a", ".aac", ".ogg"],
    "Videos": [".mp4", ".mov", ".avi", ".mkv", ".flv", ".wmv", ".webm"],
    "Archives": [".zip", ".rar", ".7z", ".tar", ".gz"],
    "Programs": [".exe", ".msi", ".bat", ".cmd"],
    "Code": [".py", ".js", ".html", ".css", ".cpp", ".c", ".java", ".php", ".json", ".xml", ".sql", ".sh"],
}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload_and_organize():
    files = request.files.getlist("files")
    if not files:
        return jsonify({"error": "No files uploaded."}), 400

    # Save uploaded files temporarily
    for f in files:
        if f.filename:
            f.save(os.path.join(UPLOAD_FOLDER, f.filename))

    # Create folders for sorting
    organized_folder = tempfile.mkdtemp()
    for folder in FOLDERS:
        os.makedirs(os.path.join(organized_folder, folder), exist_ok=True)
    os.makedirs(os.path.join(organized_folder, "Others"), exist_ok=True)

    # Sort files
    for filename in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.isdir(file_path):
            continue
        _, ext = os.path.splitext(filename)
        ext = ext.lower()
        moved = False
        for folder, extensions in FOLDERS.items():
            if ext in extensions:
                shutil.move(file_path, os.path.join(
                    organized_folder, folder, filename))
                moved = True
                break
        if not moved:
            shutil.move(file_path, os.path.join(
                organized_folder, "Others", filename))

    # Zip everything
    zip_path = os.path.join(tempfile.gettempdir(), "organized_files.zip")
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(organized_folder):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, organized_folder)
                zipf.write(abs_path, rel_path)

    # Clean up temp folder
    shutil.rmtree(organized_folder, ignore_errors=True)

    # Send the zip file back
    return send_file(zip_path, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=True)
