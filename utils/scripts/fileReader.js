
var content;
var vertices = [];
var normals = [];
var quads = [];
var triangles = [];
var textures = [];
var texture2D = true;


document.getElementById("fileInput").addEventListener("change", function () {
    if (this.files.length == 0) {
        console.log("No files selected.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function () {

        const lines = reader.result.split(/\n/);

        lines.forEach(element => {
            lineProcess(element);
        });

        content = format();
        saveFile(content, "content.txt", "text/plain");
    };

    reader.readAsText(this.files[0]);

});

document.getElementById("colorInput").addEventListener("change", function () {
    if (this.files.length == 0) {
        console.log("No files selected.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        var inArr = reader.result.split(/,/);
        console.log(inArr);

        for(var i = 0; i < inArr.length; i += 4) {
            var temp = inArr[i + 2];
            inArr[i + 2] = inArr[i];
            inArr[i] = temp;
        }
        console.log(inArr);
        saveFile(inArr, "RGBA.txt", "text/plain");

    };
     
    reader.readAsText(this.files[0]);
});

var saveFile = function (fContent, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([fContent], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = fileName;

    a.click();
    URL.revokeObjectURL(a.href);
};

function lineProcess(line) {
    const chars = line.split(/\s+/);
    if (chars[0] == "v") {

        vertices.push(chars[1]);
        vertices.push(chars[2]);
        vertices.push(chars[3]);
    }
    else if (chars[0] == "vt") {

        textures.push(chars[1]);
        textures.push(chars[2]);
        if (typeof chars[3] !== "undefined") {
            textures.push(chars[3]);
            texture2D = false;
        }
    }
    else if (chars[0] == "vn") {

        normals.push(chars[1]);
        normals.push(chars[2]);
        normals.push(chars[3]);
    }
    else if (chars[0] == "f") {
        if (chars[chars.length - 1] == "") {
            chars.length--;
        }
        var faces = [];
        chars.forEach(element => {
            if (element != "f") {
                const side = element.split("/");
                side.forEach(element => {
                    faces.push(element);
                });
            }
        });
        if (chars.length == 5) {
            faces.forEach(element => {
                quads.push(element);
            });
        }
        else if (chars.length == 4) {
            faces.forEach(element => {
                triangles.push(element);
            });
        }
    }
}

function format() {
    var text = "";
    text += "==========================================Vertices==========================================\n";
    for (var i = 1; i <= vertices.length; i++) {
        text += vertices[i - 1];
        if (i != vertices.length) {
            text += ", ";
        }
        if (i % 3 == 0) {
            text += "\n";
        }
    }
    text += "\n==========================================Normals==========================================\n";
    for (var i = 1; i <= normals.length; i++) {
        text += normals[i - 1];
        if (i != normals.length) {
            text += ", ";
        }
        if (i % 3 == 0) {
            text += "\n";
        }
    }
    text += "\n==========================================Textures==========================================\n";
    for (var i = 1; i <= textures.length; i++) {
        text += textures[i - 1];
        if (i != textures.length) {
            text += ", ";
        }
        if (i % 2 == 0 && texture2D) {
            text += "\n";
        }
        if (i % 3 == 0 && !texture2D) {
            text += "\n";
        }
    }
    text += "\n==========================================Quads==========================================\n";
    for (var i = 1; i <= quads.length; i++) {
        text += quads[i - 1];
        if (i != quads.length) {
            if (i % 3 == 0) {
                text += ", ";
            }
            else {
                text += ",";
            }
        }
        if (i % 12 == 0) {
            text += "\n";
        }
    }
    text += "\n==========================================Triangles==========================================\n";
    for (var i = 1; i <= triangles.length; i++) {
        text += triangles[i - 1];
        if (i != triangles.length) {
            if (i % 3 == 0) {
                text += ", ";
            }
            else {
                text += ",";
            }
        }
        if (i % 9 == 0) {
            text += "\n";
        }
    }
    return text;
}