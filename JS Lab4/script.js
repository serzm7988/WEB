const width = 600;
const height = 600;

let svg = d3.select("svg").attr("width", width).attr("height", height);
let picture = drawSmile();
let path = CreatePath();
let printButton = document.querySelector('input[value="Start"]');
let deleteButton = document.querySelector('input[value="Delete"]');
printButton.addEventListener("click", () => {
    CreatePath();
    Moving(
        document.querySelector(`input[id="rotate"]`).value,
        document.querySelector(`input[id="speed"]`).value
    );
});
deleteButton.addEventListener("click", () => {
    picture.remove();
    path.remove();
});

function drawSmile() {
    let smile = svg
        .append("g")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("fill", "black");
    //лицо
    smile
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 50)
        .style("fill", "red");
    //левый глаз
    smile.append("circle").attr("cx", -20).attr("cy", -10).attr("r", 5);
    //правый глаз
    smile.append("circle").attr("cx", 20).attr("cy", -10).attr("r", 5);
    smile
        .append("polygon")
        .attr("points", "-15,-35 -30,-30 -40,-45 -35,-70 -30,-45")
        .style("fill", "red")
        .style("stroke", "black")
        .style("stroke-width", "2");

    smile
        .append("polygon")
        .attr("points", "15,-35 30,-30 40,-45 35,-70 30,-45")
        .style("fill", "red")
        .style("stroke", "black")
        .style("stroke-width", "2");
    //улыбка
    let arc = d3.arc().innerRadius(35).outerRadius(35);

    smile
        .append("path")
        .attr(
            "d",
            arc({ startAngle: (Math.PI / 3) * 2, endAngle: (Math.PI / 3) * 4 })
        )
        .style("stroke", "black")
        .attr(
            "transform",
            `translate(0, 45)
            rotate(180)`
        );
    smile.attr(
        "transform",
        `translate(300,
        500)`
    );
    return smile;
}

function createPathCircle() {
    let data = [];
    for (let t = Math.PI * 1.5; t >= Math.PI; t -= 0.1) {
        data.push({
            x: width / 2 + 200 + (width / 3) * Math.sin(t),
            y: height / 2 + 200 + (height / 3) * Math.cos(t),
        });
    }
    for (let t = Math.PI * 2; t >= Math.PI * 1.5; t -= 0.1) {
        data.push({
            x: width / 2 + 200 + (width / 3) * Math.sin(t),
            y: height / 2 - 200 + (height / 3) * Math.cos(t),
        });
    }
    for (let t = Math.PI / 2; t >= 0; t -= 0.1) {
        data.push({
            x: width / 2 - 200 + (width / 3) * Math.sin(t),
            y: height / 2 - 200 + (height / 3) * Math.cos(t),
        });
    }
    for (let t = Math.PI; t >= Math.PI / 2; t -= 0.1) {
        data.push({
            x: width / 2 - 200 + (width / 3) * Math.sin(t),
            y: height / 2 + 200 + (height / 3) * Math.cos(t),
        });
    }
    return data;
}

function CreatePath() {
    const dataPoints = createPathCircle();
    let line = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y);

    const path = svg
        .append("path")
        .attr("d", line(dataPoints))
        .attr("none", "black")
        .attr("fill", "none");

    return path;
}

function Moving(rotation, k) {
    picture
        .transition()
        .ease(d3.easeLinear) // установить в зависимости от настроек
        .duration(6000 / k)
        //.attrTween("rotate", `${rotation}`)
        .attrTween("transform", translateAlong(path.node(), rotation));
}

function translateAlong(path, rotation) {
    const length = path.getTotalLength();
    return function () {
        return function (t) {
            const { x, y } = path.getPointAtLength(t * length);
            return `translate(${x},${y}) rotate(${rotation * t})`;
        };
    };
}
