const options = {
    width: 500,
    height: 300,
    strokeWidth: 5,
    strokeColor: "#df4b26"
};

window.onload = function () {
    const canvas = document.querySelector("#draw");
    canvas.classList.add('canvas')
    canvas.setAttribute('width', `${options.width || 400}px`)
    canvas.setAttribute('height', `${options.height || 300}px`)


    // отримання контексту для малювання
    const context = canvas.getContext('2d')
    // отримуємо координати canvas відносно viewport
    const rect = canvas.getBoundingClientRect();

    let isPaint = false // чи активно малювання
    let points = [] //масив з точками

    // об’являємо функцію додавання точок в масив
    const addPoint = (x, y, dragging) => {
        // преобразуємо координати події кліка миші відносно canvas
        points.push({
            x: (x - rect.left),
            y: (y - rect.top),
            dragging: dragging
        })
    }

    // головна функція для малювання
    const redraw = () => {
        //очищуємо  canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        context.strokeStyle = options.strokeColor;
        context.lineJoin = "round";
        context.lineWidth = options.strokeWidth;
        let prevPoint = null;
        for (let point of points){
            context.beginPath();
            if (point.dragging && prevPoint){
                context.moveTo(prevPoint.x, prevPoint.y)
            } else {
                context.moveTo(point.x - 1, point.y);
            }
            context.lineTo(point.x, point.y)
            context.closePath()
            context.stroke();
            prevPoint = point;
        }
    }

    // функції обробники подій миші
    const mouseDown = event => {
        isPaint = true
        addPoint(event.pageX, event.pageY);
        redraw();
    }

    const mouseMove = event => {
        if(isPaint){
            addPoint(event.pageX, event.pageY, true);
            redraw();
        }
    }

    // додаємо обробку подій
    canvas.addEventListener('mousemove', mouseMove)
    canvas.addEventListener('mousedown', mouseDown)
    canvas.addEventListener('mouseup',() => {
        isPaint = false;
    });
    canvas.addEventListener('mouseleave',() => {
        isPaint = false;
    });


    // clear button
    const clearBtn = document.getElementById("clear-button")
    clearBtn.addEventListener('click', () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        points = [];
    })

    //download button
    const downloadBtn = document.getElementById("download-button")
    downloadBtn.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        const newTab = window.open('about:blank','image from canvas');
        newTab.document.write("<img src='" + dataUrl + "' alt='from canvas'/>");
    })

    //save
    const saveBtn = document.getElementById("save-button")
    saveBtn.addEventListener('click', () => {
        localStorage.setItem('points', JSON.stringify(points));
    })

    //restore
    const restoreBtn = document.getElementById('restore-button')
    restoreBtn.addEventListener('click', () => {
        points = JSON.parse(localStorage.getItem('points'));
        redraw();
    })

    //date
    const dateBtn = document.getElementById('date-button')
    dateBtn.addEventListener('click', () => {
        const date = new Date();
        context.fillText(JSON.stringify(date), 100, 100);
    })

    //color
    const colorPicker = document.getElementById("color-picker")
    colorPicker.addEventListener('change', (event) => {
        options.strokeColor = event.target.value;
    });
    colorPicker.value = options.strokeColor;


    //background
    const backBtn = document.getElementById('img-button')
    backBtn.addEventListener('click', () => {
        const img = new Image;
        img.src =`https://www.fillmurray.com/200/300)`;
        img.onload = () => {
            context.drawImage(img, 0, 0);
        }
    })
}
