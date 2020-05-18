// Build init function 
// Read in samples.json file containing data

function init (i) {
    const belly = "samples.json";
    d3.json(belly).then(function(data){   //Read in samples.json file containing data
        var testSubNames = data.names;    //Define variables that will be called later for building charts and for demographic info table
        console.log(testSubNames);
        var sampleValues = data.samples[i].sample_values; //Use i as iterator to retrieve all values within samples array for sample values
        console.log(sampleValues);
        var otuIDs = data.samples[i].otu_ids;
        console.log(otuIDs);
        var otuIDStr = otuIDs.map(d => "OTU" + d); //Add OTU identifier and convert to string so that we can add to bar chart later
        console.log(otuIDStr); 
        var otuLabels = data.samples[i].otu_labels;
        console.log(otuLabels);
        var panelMetadata = data.metadata[i];
        console.log(panelMetadata);

        // Define Dropdown for demographic panel and add test subject ids as values to the list
        var panelDropdown = d3.select("#selDataset")
        for (i in testSubNames) {
            var newPanelDropdownOption = panelDropdown.append("option")
            newPanelDropdownOption.text(testSubNames[i]);
        }
        
    
        // Select id associated with metadata from html
        // Clear panel prior to selecting new test subject ID
        // Return key:value pair elements from metadata array and append to table

        var mdPanel = d3.select("#sample-metadata");
        mdPanel.html("");  
        Object.entries(panelMetadata).forEach(function ([key, value]) {
            var row = mdPanel.append("p");
            row.text(`${key.toUpperCase()} :${value}`)
        
        })

        // Define variables for bar chart and use .slice to return top 10 for each individual
    
        var barData = [{
        x: sampleValues.slice(0, 10).reverse(),
        y: otuIDStr,
        text: otuLabels.slice(0, 10).reverse(),
        orientation: "h",
        marker: {
            color: "purple"
        },
        type: "bar"
        }]

        // Define layout for bar chart with x, y, and title parameters

        var barLayout = {
        xaxis: { title: "Test Subject Sample Values"},
        yaxis: { title: "Test Subject OTU IDs"},
        title: "Top 10 OTU IDs"
        }

        // Plot bar char

        Plotly.newPlot("bar", barData, barLayout);
    
        // Define variable for bubble chart along with parameters for chart

        var bubble = {

        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: `markers`,
        marker: {
          size: sampleValues, 
          color: otuIDs
        }
        };

        var bubbleData = [bubble];
        var layout = {
        title: "Belly Button Bacteria",
        xaxis: { title: "OTU ID"}
        };

        // Plot bubble chart

        Plotly.newPlot('bubble', bubbleData, layout);

    })
      
}

// Define function for updating data on page
// Pass parameter element--when option is changed to a new subject id,
// display values for that subject id
// partnered with classmate to code (Kaylee)

function optionChanged(d) {
    const belly = "samples.json";
    d3.json(belly).then(function(data){ 
    var testSubNames = data.names;
    const isNumber = (element) => element === d;
    var indx = (testSubNames.findIndex(isNumber));
    d3.selectAll("td").remove();
    d3.selectAll("option").remove();
    var panelDropdown = d3.select("#selDataset")
    panelDropdown.append("option").text(d);
    init(indx);

});
}
 init(0);



