const showButton = document.getElementById(`show`);
const calculateButton = document.getElementById(`calculate`);
const cleanButton = document.getElementById(`clean`);
const osnInput = document.getElementById(`osn`);
const angleInput = document.getElementById(`ang`);
const selectInput = document.getElementsByTagName(`select`)[0];

function Show(e) {
    e.preventDefault();
    if (document.getElementById(`question`).checked == true)
        document.getElementsByTagName(`img`)[0].src = `adjacent.png`;
    else document.getElementsByTagName(`img`)[0].src = `opposite.png`;
}

function Calculate(e) {
    e.preventDefault();
    const parent = document.getElementsByClassName(`Results`)[0];
    if (parent.children.length > 0) parent.children[0].remove();
    let component = document.createElement(`div`);
    parent.appendChild(component);
    let angle = document.getElementById(`question`).checked
        ? document.getElementById(`ang`).value
        : (180 - document.getElementById(`ang`).value) / 2;
    angle = (angle * Math.PI) / 180;
    const osn = Number(document.getElementById(`osn`).value);
    let H = Math.tan(angle) * (osn / 2);
    if ((osn > 0) & (angle > 0) & (2 * angle < Math.PI)) {
        if (document.getElementsByTagName(`select`)[0].options[0].selected) {
            let h = Math.sin(angle) * osn;
            let Htext = document.createElement(`p`);
            let htext = document.createElement(`p`);
            Htext.innerHTML = `Длинна высоты к основанию равна ${H}`;
            htext.innerHTML = `Длинна высоты к боковой стороне равна ${h}`;
            component.appendChild(Htext);
            component.appendChild(htext);
        }
        if (document.getElementsByTagName(`select`)[0].options[1].selected) {
            let a = osn / 2 / Math.cos(angle);
            let S = (osn * H) / 2;
            let P = a + osn + a;
            let Rad = S / (P / 2);
            let Radtext = document.createElement(`p`);
            Radtext.innerHTML = `Радиус вписанной окружности равен ${Rad}`;
            component.appendChild(Radtext);
        }
        if (document.getElementsByTagName(`select`)[0].options[2].selected) {
            let a = Math.atan(H / 3 / (osn / 2));
            let m = osn / 2 / Math.cos(a);
            m = (m / 2) * 3;
            let Mtext = document.createElement(`p`);
            let mtext = document.createElement(`p`);
            Mtext.innerHTML = `Длинна медианы к основанию равна ${H}`;
            mtext.innerHTML = `Длинна медианы к боковой стороне равна ${m}`;
            component.appendChild(Mtext);
            component.appendChild(mtext);
        }
        if (
            !document.getElementsByTagName(`select`)[0].options[0].selected &&
            !document.getElementsByTagName(`select`)[0].options[1].selected &&
            !document.getElementsByTagName(`select`)[0].options[2].selected
        ) {
            document.getElementsByTagName(
                `select`
            )[0].style.backgroundColor = `red`;
        }
    } else {
        if (osn <= 0)
            document.getElementById(`osn`).style.backgroundColor = `red`;
        if (angle <= 0 || 2 * angle >= Math.PI)
            document.getElementById(`ang`).style.backgroundColor = `red`;
    }
}

function Clean(e) {
    e.preventDefault();
    document.getElementsByTagName(`select`)[0].value = null;
    document.getElementById(`osn`).value = null;
    document.getElementById(`ang`).value = null;
}

showButton.addEventListener("click", Show);
calculateButton.addEventListener("click", Calculate);
cleanButton.addEventListener("click", Clean);
osnInput.addEventListener("click", () => {
    osnInput.style.backgroundColor = `white`;
});
angleInput.addEventListener("click", () => {
    angleInput.style.backgroundColor = `white`;
});
selectInput.addEventListener("click", () => {
    selectInput.style.backgroundColor = `white`;
});
