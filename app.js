const COLUMNS = 3;

//when the user open/ refresh the page, create a pie chart and fill the table
function loading() {
    pieChart();
    fillTable();
}

//def array with data of customers
let customers = [
    ({id: 0, fName: "אבי", lName: "ראובן", gender: "זכר"}),
    ({id: 1, fName: "בנימין", lName: "שמעון", gender: "זכר"}),
    ({id: 2, fName: "גד", lName: "לוי", gender: "זכר"}),
    ({id: 3, fName: "דניאל", lName: "יהודה", gender: "זכר"}),
    ({id: 4, fName: "הדר", lName: "יששכר", gender: "נקבה"}),
    ({id: 5, fName: "ויקטוריה", lName: "זבולון", gender: "נקבה"}),
    ({id: 6, fName: "זיו", lName: "דן", gender: "זכר"}),
    ({id: 7, fName: "חיים", lName: "נפתלי", gender: "זכר"}),
    ({id: 8, fName: "טלי", lName: "גד", gender: "נקבה"}),
    ({id: 9, fName: "יעקב", lName: "אשר", gender: "זכר"})
];

//check the local storage and rand nums for total field
if (localStorage.length === 0) {
    //insert a random integer from 0 to 20000 (the debt)
    for (let i = 0; i < customers.length; i++) {
        localStorage.setItem("u" + i, Math.floor(Math.random() * 20000).toString());
    }
}

//fill the table from the array
function fillTable() {
    let table = document.getElementById('customersTable');
    for (let i = 0; i < customers.length; i++) {
        let row = table.insertRow(i);
        row.id = i.toString();
        row.onclick = function () {
            handleModal(i);
        }
        for (let j = 0; j < COLUMNS; j++) {
            let element = document.createElement('text');
            let cell = row.insertCell(j);
            if (j === 0) {
                element.textContent = localStorage.getItem("u" + i).toString();
            } else if (j === 1) {
                element.textContent = customers[i].lName;
            } else {
                element.textContent = customers[i].fName;
            }
            cell.appendChild(element);
        }
    }
}

/*
view a modal when user click on row
insert all details of the customer into the modal
*/
function handleModal(index) {
    let modal = document.getElementById('myModal');
    let span = document.getElementsByClassName('close')[0];
    let btnClose = document.getElementById('btnClose');

    let firstName = document.getElementById('fName');
    firstName.textContent = customers[index].fName;

    let lastName = document.getElementById('lName');
    lastName.textContent = customers[index].lName;

    let gender = document.getElementById('gender');
    gender.textContent = customers[index].gender;

    let id = document.getElementById('userID');
    id.textContent = (customers[index].id + 1).toString();

    let total = document.getElementById('total');
    total.value = localStorage.getItem("u" + index);

    //when the user clicks on specific row, open the modal
    modal.style.display = "block";

    //when the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    //when the user clicks on (close) button, close the modal
    btnClose.onclick = function () {
        modal.style.display = "none";
    }

    //when the user clicks anywhere outside of the modal, close modal
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

//update the total field by user input
function update() {
    let customerTotal = document.getElementById('total');
    let id = document.getElementById('userID').textContent;
    if (confirm("האם אתה בטוח?")) {
        localStorage.setItem("u" + (id - 1).toString(), customerTotal.value.toString());
        let total = document.getElementById("customersTable").rows[id - 1].cells[0].querySelector('text');
        total.textContent = customerTotal.value.toString();
        pieChart();
        //close the modal
        let modal = document.getElementById('myModal');
        modal.style.display = "none";
    }
}

//create pie chart by percentage (from CanvasJS)
function pieChart() {
    let sum = 0;
    for (let i = 0; i < customers.length; i++)
        sum += Number(localStorage.getItem("u" + i));

    let dataPoint = [];
    for (let i = 0; i < customers.length; i++)
        dataPoint.push({y: localStorage.getItem("u" + i) / sum * 100, label: customers[i].fName});
    let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##0.00\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: dataPoint
        }]
    });
    chart.render();
}