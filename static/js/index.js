document.getElementById('error-row').style.visibility = 'hidden';

function dateFormat(dateInput) {
    var dateSplit = dateInput.split('/');
    if (dateSplit.length != 3) {
        return false;
    } else if (dateSplit[0].length < 1 || dateSplit[0].length > 2) {
        return false;
    } else if (dateSplit[1].length < 1 || dateSplit[1].length > 2) {
        return false;
    } else if (dateSplit[2].length != 4) {
        return false;
    } else {
        if (dateSplit[0].length == 1) {
            dateSplit[0] = '0' + dateSplit[0];
        };
        if (dateSplit[1].length == 1) {
            dateSplit[1] = '0' + dateSplit[1];
        };
        var finalDate = dateSplit.join('/');
        return finalDate;
    };
}

function generateTable(tableData) {
    var tbodySel = d3.select('tbody');
    tableData.forEach(tableDatum => {
        var tableRow = tbodySel.append('tr');
        Object.entries(tableDatum).forEach(([key, value]) => {
            var tableCell = tableRow.append('td');
            if (key == 'datetime') {
                var dateFormatted = dateFormat(value);
                tableCell.text(dateFormatted);
            } else {
                tableCell.text(value);
            };
        });
    });
}

generateTable(data);

var submitButton = d3.select('#submit-button');
submitButton.on('click', () => {
    var previousTable = document.getElementById('ufoTable');
    for (var i = previousTable.rows.length - 1; i > 0; i--) {
        previousTable.deleteRow(i);
    };
    var userInput = d3.select('#user-form-input');
    var inputValue = userInput.property('value');
    if (!dateFormat(inputValue)) {
        document.getElementById('error-row').style.visibility = 'visible';
    } else {
        var dataFiltered = data.filter(datum => {
            return dateFormat(datum.datetime) == dateFormat(inputValue);
        });
        generateTable(dataFiltered);
    };
});

var resetButton = d3.select('#reset-button');
resetButton.on('click', () => {
    document.getElementById('user-form-input').value = '';
    document.getElementById('error-row').style.visibility = 'hidden';
    var previousTable = document.getElementById('ufoTable');
    for (var i = previousTable.rows.length - 1; i > 0; i--) {
        previousTable.deleteRow(i);
    };
    generateTable(data);
});
