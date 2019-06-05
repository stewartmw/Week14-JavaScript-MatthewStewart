// Error message element to capture format errors with data inputs
// Initially hidden
document.getElementById('error-row').style.visibility = 'hidden';

///////////////////////////////////////////////////////////////////////////
// FUNCTIONS
///////////////////////////////////////////////////////////////////////////

// dateFormat will take a date input and re-format as mm/dd/yyyy
// or return false if it does not understand the input format
function dateFormat(dateInput) {
    
    // split date string input on '/' character;
    // if length of resulting array is less than three, it means the input
    // was not formatted with the expected slashes (and will return false)
    var dateSplit = dateInput.split('/');
    if (dateSplit.length != 3) {
        return false;
    
    } else if (dateSplit[0].length < 1 || dateSplit[0].length > 2) {
        return false; //month field needs to be 'm' or 'mm'
    
    } else if (dateSplit[1].length < 1 || dateSplit[1].length > 2) {
        return false; // day field needs to be 'd' or 'dd'

    } else if (dateSplit[2].length != 4) {
        return false; //year field needs to be 'yyyy'

    } else {

        // if month field is 'm', add a leading '0'
        if (dateSplit[0].length == 1) {
            dateSplit[0] = '0' + dateSplit[0];
        };

        // if day field is 'd', add a leading '0'
        if (dateSplit[1].length == 1) {
            dateSplit[1] = '0' + dateSplit[1];
        };

        // re-join everything from an array back into a string
        // formatted as mm/dd/yyyy
        var finalDate = dateSplit.join('/');
        return finalDate;
    };
}

// generateTable takes a javascript object as an input and
// generates a table on the html page
function generateTable(tableData) {

    // select the html element 'tbody', iterate through the inputted
    // dataset, and append a row to the table
    var tbodySel = d3.select('tbody');
    tableData.forEach(tableDatum => {
        var tableRow = tbodySel.append('tr');
        Object.entries(tableDatum).forEach(([key, value]) => {
            var tableCell = tableRow.append('td');

            // for the date input, run the dateFormat function
            // to re-format at mm/dd/yyyy
            if (key == 'datetime') {
                var dateFormatted = dateFormat(value);
                tableCell.text(dateFormatted);
            } else {
                tableCell.text(value);
            };
        });
    });
}

// initiateDropdowns returns a javascript object which will be input
// into the populateDropdowns function below
// in the main code (below the functions section), this function will be called
// passing in 'shape', 'city', 'state', and 'country' as the whichBox argument
function initiateDropdowns(whichBox) {
    
    // initialize empty object
    var temp = {};

    // iterate through the original dataset
    data.forEach(datum => {
        Object.entries(datum).forEach(([key, value]) => {
            if (key == whichBox) {
                temp[value] = true;
            };
            // this will result in an object with a unique set of keys
            // these keys will be extracted below in order to
            // actually populate the respective dropdowns
        });
    });
    return temp;
}

// populateDropdowns takes a whichBox argument (string) and a tempObject (javascript object) argument
// and will populate the shape, city, state, and country dropdowns
function populateDropdowns(whichBox, tempObject) {
    // select appropriate html element (e.g., #user-shape-input)
    var dropdownSel = d3.select('#user-' + whichBox + '-input');

    // populate the first item in each dropdown to be an empty string
    var dropdownOptionOne = dropdownSel.append('option');
    dropdownOptionOne.attr('value', '').text('');

    // iterate through the keys of the javascript object that gets passed into the function
    // sort and append to each respective dropdown
    var dropdownList = Object.keys(tempObject);
    dropdownList.sort();
    dropdownList.forEach(item => {
        var dropdownOptions = dropdownSel.append('option');
        dropdownOptions.attr('value', item).text(item);
    });
}

///////////////////////////////////////////////////////////////////////////
// END OF FUNCTIONS
///////////////////////////////////////////////////////////////////////////

// populate the four dropdowns by calling the populate and initiate functions
populateDropdowns('shape', initiateDropdowns('shape'));

populateDropdowns('city', initiateDropdowns('city'));

populateDropdowns('state', initiateDropdowns('state'));

populateDropdowns('country', initiateDropdowns('country'));

// generate entire (unfiltered) table with original dataset
generateTable(data);

///////////////////////////////////////////////////////////////////////////
// CITY, STATE, AND COUNTRY DROPDOWN BEHAVIOR
///////////////////////////////////////////////////////////////////////////

// for city, state, and country dropdowns, when a city, state, or country is chosen,
// the remaining dropdown(s) should re-populate using a filter.
// for example, if "new mexico" is chosen from the state, the city dropdown
// should automtaically re-populate with just new mexico cities.

// select each of the city, state, and country dropdown elements using d3
var dropdownCity = d3.select('#user-city-input');
var dropdownState = d3.select('#user-state-input');
var dropdownCountry = d3.select('#user-country-input');

// when the city option changes, re-populate state and country
dropdownCity.on('change', () => {

    // get the value in each of the three dropdowns (even if blank)
    var cityValue = dropdownCity.property('value');
    var stateValue = dropdownState.property('value');
    var countryValue = dropdownCountry.property('value');

    // delete everything from the "state" dropdown so that we can turn around and re-populate
    var stateElement = document.getElementById('user-state-input');
    var statePlaceHolder = stateElement.value;
    for (var i = stateElement.options.length - 1; i >= 0; i--) {
        stateElement.remove(i);
    };

    // do the same for country
    var countryElement = document.getElementById('user-country-input');
    var countryPlaceHolder = countryElement.value;
    for (var j = countryElement.options.length - 1; j >= 0; j--) {
        countryElement.remove(j);
    };

    // initialize temporary state and country objects
    var tempState = {};
    var tempCountry = {};

    // generate a new javascript object for purposes of re-populating the state dropdown
    // the if statement below will check for every combination of "city" and "country"
    // (blank vs. not blank) and will filter the original dataset based on these values
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

    // do the same for re-populating "country"
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

    // iterate through the new, filtered "state" object and generate a new, final object
    // called tempState whose keys are the unique list of filtered states
    dataFilteredForState.forEach(datum => {
        Object.entries(datum).forEach(([key, value]) => {
            if (key == 'state') {
                tempState[value] = true;
            };
        });
    });

    // do the same with the new, filtered "country" object (resulting in a final object called tempCountry)
    dataFilteredForCountry.forEach(datum => {
        Object.entries(datum).forEach(([key, value]) => {
            if (key == 'country') {
                tempCountry[value] = true;
            };
        });
    });

    // use tempState to re-populate the state dropdown
    // example: if the city was changed to "albuquerque," then the state dropdown should re-populate
    // with (1) an empty string (''), and (2) "nm" (for new mexico)
    populateDropdowns('state', tempState);
    stateElement.value = statePlaceHolder;

    // do the same for country
    populateDropdowns('country', tempCountry);
    countryElement.value = countryPlaceHolder;
});

// follow the same methodology in the case that the state dropdown is changed;
// if the state dropdown is changed, we need to re-populate "city" and "country"
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

// follow the same methodology in the case that the country dropdown is changed;
// if the country dropdown is changed, we need to re-populate "city" and "state"
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

///////////////////////////////////////////////////////////////////////////
// SUBMIT BUTTON CLICK BEHAVIOR
///////////////////////////////////////////////////////////////////////////

// select "submit" button html element
var submitButton = d3.select('#submit-button');

submitButton.on('click', () => {

    // delete the current table being displayed on the html page
    // so that we can re-generate with the filters applied;
    // DO NOT delete the header row
    var previousTable = document.getElementById('ufoTable');
    for (var i = previousTable.rows.length - 1; i > 0; i--) {
        previousTable.deleteRow(i);
    };

    // select and obtain the values from each of the five form objects
    // (date, shape, city, state, and country)
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

    // create a new table data javascript object by moving through each of the five form field
    // one at a time.  if the respective form field has not been used (i.e., is blank ('')),
    // simply copy the current dataset into a new variable.
    // otherwise, filter the dataset and store the results in a new variable.

    // moving from one form field to the next, the variables that store the filtered data will
    // flow from one to the next as follows:

    // data --> dateData --> shapeData --> cityData --> stateData --> finalFilteredData

    if (dateValue == '') {
        var dateData = data;
    } else {
        
        // if the date is entered in an incorrect format, the "error" element should become visible
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

    // if all five form field left blank, then no filter should be applied.
    // in this case, simply re-generate the table with the original dataset.
    // otherwise, re-generate the table with "finalFilteredData"
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

///////////////////////////////////////////////////////////////////////////
// "RESET" BUTTON CLICK BEHAVIOR
///////////////////////////////////////////////////////////////////////////

// select "reset" button html element
var resetButton = d3.select('#reset-button');
resetButton.on('click', () => {

    // when "reset" is clicked, re-hide the error element, reset the
    // date form fields to blank, empty the four dropdowns, and delete the table
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
    
    // start over by generating the original table and populating the
    // four dropdowns with the complete list for each dropdown
    generateTable(data);
    populateDropdowns('shape', initiateDropdowns('shape'));
    populateDropdowns('city', initiateDropdowns('city'));
    populateDropdowns('state', initiateDropdowns('state'));
    populateDropdowns('country', initiateDropdowns('country'));
    
    // reset the value of each dropdown to the first item in the list (which is '')
    document.getElementById('user-shape-input').selectedIndex = 0;
    document.getElementById('user-city-input').selectedIndex = 0;
    document.getElementById('user-state-input').selectedIndex = 0;
    document.getElementById('user-country-input').selectedIndex = 0;
});
