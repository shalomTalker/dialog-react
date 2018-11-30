export const drawImageScaled = (img, ctx) => {
    var canvas = ctx.canvas;
    var hRatio = canvas.width / img.width;
    var vRatio = canvas.height / img.height;
    var ratio = Math.min(hRatio, vRatio);
    var centerShift_x = (canvas.width - img.width * ratio) / 2;
    var centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}


export const handleFile = (e) => {
    const reader = new FileReader();
    const input = e.target;
    console.log(input.files)
    reader.onload = (upload) => {
        var img = new Image();
        img.onload = (e) => {
            let imgNode = input.parentNode.querySelector('img')
            let canvasNode = document.querySelector('canvas')
            let context = canvasNode.getContext('2d');
            if (input.parentNode.contains(imgNode)) {
                input.parentNode.removeChild(imgNode)
            }
            drawImageScaled(img, context)
        }
        console.log(reader.result)
        localStorage.setItem('IMAGE', JSON.stringify(reader.result))
        img.src = reader.result
    };
    (input.files[0]) &&
        reader.readAsDataURL(input.files[0]);
    return input.files[0]
}