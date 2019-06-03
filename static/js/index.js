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

function initiateDropdowns(whichBox) {
    var temp = {};
    data.forEach(datum => {
        Object.entries(datum).forEach(([key, value]) => {
            if (key == whichBox) {
                temp[value] = true;
            };
        });
    });
    return temp;
}

function populateDropdowns(whichBox, tempObject) {
    var dropdownSel = d3.select('#user-' + whichBox + '-input');
    var dropdownOptionOne = dropdownSel.append('option');
    dropdownOptionOne.attr('value', '').text('');
    var dropdownList = Object.keys(tempObject);
    dropdownList.sort();
    dropdownList.forEach(item => {
        var dropdownOptions = dropdownSel.append('option');
        dropdownOptions.attr('value', item).text(item);
    });
}

populateDropdowns('shape', initiateDropdowns('shape'));

populateDropdowns('city', initiateDropdowns('city'));

populateDropdowns('state', initiateDropdowns('state'));

populateDropdowns('country', initiateDropdowns('country'));

generateTable(data);

var dropdownCity = d3.select('#user-city-input');
var dropdownState = d3.select('#user-state-input');
var dropdownCountry = d3.select('#user-country-input');

dropdownCity.on('change', () => {

    var cityValue = dropdownCity.property('value');
    var stateValue = dropdownState.property('value');
    var countryValue = dropdownCountry.property('value');

    var stateElement = document.getElementById('user-state-input');
    var statePlaceHolder = stateElement.value;
    for (var i = stateElement.options.length - 1; i >= 0; i--) {
        stateElement.remove(i);
    };

    var countryElement = document.getElementById('user-country-input');
    var countryPlaceHolder = countryElement.value;
    for (var j = countryElement.options.length - 1; j >= 0; j--) {
        countryElement.remove(j);
    };

    var tempState = {};
    var tempCountry = {};

    if (cityValue == '' && countryValue == '') {
        var dataFilteredForState = data;
    } else if (cityValue != '' && countryValue == '') {
        var dataFilteredForState = data.filter(datum => {
            return datum.city == cityValue;
        });
    } else if (cityValue == '' && countryValue != '') {
        var dataFilteredForState = data.filter(datum => {
            return datum.country == countryValue;
        });
    } else {
        var dataFilteredPrelim = data.filter(datum => {
            return datum.city == cityValue;
        });
        var dataFilteredForState = dataFilteredPrelim.filter(datum => {
            return datum.country == countryValue;
        });
    };

    if (cityValue == '' && stateValue == '') {
        var dataFilteredForCountry = data;
    } else if (cityValue != '' && stateValue == '') {
        var dataFilteredForCountry = data.filter(datum => {
            return datum.city == cityValue;
        });
    } else if (cityValue == '' && stateValue != '') {
        var dataFilteredForCountry = data.filter(datum => {
            return datum.state == stateValue;
        });
    } else {
        var dataFilteredPrelim = data.filter(datum => {
            return datum.city == cityValue;
        });
        var dataFilteredForCountry = dataFilteredPrelim.filter(datum => {
            return datum.state == stateValue;
        });
    };

    dataFilteredForState.forEach(datum => {
        Object.entries(datum).forEach(([key, value]) => {
            if (key == 'state') {
                tempState[value] = true;
            };
        });
    });

    dataFilteredForCountry.forEach(datum => {
        Object.entries(datum).forEach(([key, value]) => {
            if (key == 'country') {
                tempCountry[value] = true;
            };
        });
    });

    populateDropdowns('state', tempState);
    stateElement.value = statePlaceHolder;

    populateDropdowns('country', tempCountry);
    countryElement.value = countryPlaceHolder;
});

dropdownState.on('change', () => {

    var cityValue = dropdownCity.property('value');
    var stateValue = dropdownState.property('value');
    var countryValue = dropdownCountry.property('value');

    var cityElement = document.getElementById('user-city-input');
    var cityPlaceHolder = cityElement.value;
    for (var i = cityElement.options.length - 1; i >= 0; i--) {
        cityElement.remove(i);
    };

    var countryElement = document.getElementById('user-country-input');
    var countryPlaceHolder = countryElement.value;
    for (var j = countryElement.options.length - 1; j >= 0; j--) {
        countryElement.remove(j);
    };

    var tempCity = {};
    var tempCountry = {};

    if (stateValue == '' && countryValue == '') {
        var dataFilteredForCity = data;
    } else if (stateValue != '' && countryValue == '') {
        var dataFilteredForCity = data.filter(datum => {
            return datum.state == stateValue;
        });
    } else if (stateValue == '' && countryValue != '') {
        var dataFilteredForCity = data.filter(datum => {
            return datum.country == countryValue;
        });
    } else {
        var dataFilteredPrelim = data.filter(datum => {
            return datum.state == stateValue;
        });
        var dataFilteredForCity = dataFilteredPrelim.filter(datum => {
            return datum.country == countryValue;
        });
    };

    if (cityValue == '' && stateValue == '') {
        var dataFilteredForCountry = data;
    } else if (cityValue != '' && stateValue == '') {
        var dataFilteredForCountry = data.filter(datum => {
            return datum.city == cityValue;
        });
    } else if (cityValue == '' && stateValue != '') {
        var dataFilteredForCountry = data.filter(datum => {
            return datum.state == stateValue;
        });
    } else {
        var dataFilteredPrelim = data.filter(datum => {
            return datum.city == cityValue;
        });
        var dataFilteredForCountry = dataFilteredPrelim.filter(datum => {
            return datum.state == stateValue;
        });
    };

    dataFilteredForCity.forEach(datum => {
        Object.entries(datum).forEach(([key, value]) => {
            if (key == 'city') {
                tempCity[value] = true;
            };
        });
    });

    dataFilteredForCountry.forEach(datum => {
        Object.entries(datum).forEach(([key, value]) => {
            if (key == 'country') {
                tempCountry[value] = true;
            };
        });
    });

    populateDropdowns('city', tempCity);
    cityElement.value = cityPlaceHolder;

    populateDropdowns('country', tempCountry);
    countryElement.value = countryPlaceHolder;
});

dropdownCountry.on('change', () => {

    var cityValue = dropdownCity.property('value');
    var stateValue = dropdownState.property('value');
    var countryValue = dropdownCountry.property('value');

    var cityElement = document.getElementById('user-city-input');
    var cityPlaceHolder = cityElement.value;
    for (var i = cityElement.options.length - 1; i >= 0; i--) {
        cityElement.remove(i);
    };

    var stateElement = document.getElementById('user-state-input');
    var statePlaceHolder = stateElement.value;
    for (var j = stateElement.options.length - 1; j >= 0; j--) {
        stateElement.remove(j);
    };

    var tempCity = {};
    var tempState = {};

    if (stateValue == '' && countryValue == '') {
        var dataFilteredForCity = data;
    } else if (stateValue != '' && countryValue == '') {
        var dataFilteredForCity = data.filter(datum => {
            return datum.state == stateValue;
        });
    } else if (stateValue == '' && countryValue != '') {
        var dataFilteredForCity = data.filter(datum => {
            return datum.country == countryValue;
        });
    } else {
        var dataFilteredPrelim = data.filter(datum => {
            return datum.state == stateValue;
        });
        var dataFilteredForCity = dataFilteredPrelim.filter(datum => {
            return datum.country == countryValue;
        });
    };

    if (cityValue == '' && countryValue == '') {
        var dataFilteredForState = data;
    } else if (cityValue != '' && countryValue == '') {
        var dataFilteredForState = data.filter(datum => {
            return datum.city == cityValue;
        });
    } else if (cityValue == '' && countryValue != '') {
        var dataFilteredForState = data.filter(datum => {
            return datum.country == countryValue;
        });
    } else {
        var dataFilteredPrelim = data.filter(datum => {
            return datum.city == cityValue;
        });
        var dataFilteredForState = dataFilteredPrelim.filter(datum => {
            return datum.country == countryValue;
        });
    };

    dataFilteredForCity.forEach(datum => {
        Object.entries(datum).forEach(([key, value]) => {
            if (key == 'city') {
                tempCity[value] = true;
            };
        });
    });

    dataFilteredForState.forEach(datum => {
        Object.entries(datum).forEach(([key, value]) => {
            if (key == 'state') {
                tempState[value] = true;
            };
        });
    });

    populateDropdowns('city', tempCity);
    cityElement.value = cityPlaceHolder;

    populateDropdowns('state', tempState);
    stateElement.value = statePlaceHolder;
});

var submitButton = d3.select('#submit-button');
submitButton.on('click', () => {
    var previousTable = document.getElementById('ufoTable');
    for (var i = previousTable.rows.length - 1; i > 0; i--) {
        previousTable.deleteRow(i);
    };

    var dateInput = d3.select('#user-date-input');
    var dateValue = dateInput.property('value');

    var shapeInput = d3.select('#user-shape-input');
    var shapeValue = shapeInput.property('value');

    var cityInput = d3.select('#user-city-input');
    var cityValue = cityInput.property('value');

    var stateInput = d3.select('#user-state-input');
    var stateValue = stateInput.property('value');

    var countryInput = d3.select('#user-country-input');
    var countryValue = countryInput.property('value');

    if (dateValue == '') {
        var dateData = data;
    } else {
        if (!dateFormat(dateValue)) {
            document.getElementById('error-row').style.visibility = 'visible';
        } else {
            var dateData = data.filter(datum => {
                return dateFormat(datum.datetime) == dateFormat(dateValue);
            });
        };
    };

    if (shapeValue == '') {
        var shapeData = dateData;
    } else {
        var shapeData = dateData.filter(datum => {
            return datum.shape == shapeValue;
        });
    };

    if (cityValue == '') {
        var cityData = shapeData;
    } else {
        var cityData = shapeData.filter(datum => {
            return datum.city == cityValue;
        });
    };

    if (stateValue == '') {
        var stateData = cityData;
    } else {
        var stateData = cityData.filter(datum => {
            return datum.state == stateValue;
        });
    };

    if (countryValue == '') {
        var finalFilteredData = stateData;
    } else {
        var finalFilteredData = stateData.filter(datum => {
            return datum.country == countryValue;
        });
    };

    if (dateValue == '' &&
        shapeValue == '' &&
        cityValue == '' &&
        stateValue == '' &&
        countryValue == '') {
        generateTable(data);
    }
    else {
        generateTable(finalFilteredData);
    };
});

var resetButton = d3.select('#reset-button');
resetButton.on('click', () => {
    document.getElementById('user-date-input').value = '';
    document.getElementById('error-row').style.visibility = 'hidden';
    
    var shapeElement = document.getElementById('user-shape-input');
    for (var i = shapeElement.options.length - 1; i >= 0; i--) {
        shapeElement.remove(i);
    };

    var cityElement = document.getElementById('user-city-input');
    for (var i = cityElement.options.length - 1; i >= 0; i--) {
        cityElement.remove(i);
    };

    var stateElement = document.getElementById('user-state-input');
    for (var i = stateElement.options.length - 1; i >= 0; i--) {
        stateElement.remove(i);
    };
    
    var countryElement = document.getElementById('user-country-input');
    for (var i = countryElement.options.length - 1; i >= 0; i--) {
        countryElement.remove(i);
    };    
    
    var previousTable = document.getElementById('ufoTable');
    for (var i = previousTable.rows.length - 1; i > 0; i--) {
        previousTable.deleteRow(i);
    };
    
    generateTable(data);
    populateDropdowns('shape', initiateDropdowns('shape'));
    populateDropdowns('city', initiateDropdowns('city'));
    populateDropdowns('state', initiateDropdowns('state'));
    populateDropdowns('country', initiateDropdowns('country'));
    
    document.getElementById('user-shape-input').selectedIndex = 0;
    document.getElementById('user-city-input').selectedIndex = 0;
    document.getElementById('user-state-input').selectedIndex = 0;
    document.getElementById('user-country-input').selectedIndex = 0;
});
