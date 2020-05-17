// Build init function 
// Read in samples.json file containing data

function init (i) {
    const belly = "samples.json";
    d3.json(belly).then(function(data){   //Read in samples.json file containing data
        var testSubNames = data.names;    //Define variables that will be called later for building charts and for demographic info table
        var sampleValues = data.samples[i].sample_values; //Use i as iterator to retrieve all values within samples array for sample values
        console.log(sampleValues);
        var otuIDs = data.samples[i].otu_ids;
        console.log(otuIDs);
        var otuIDStr = otuIDs.map(d => "OTU" + d); //Convert OTU IDs to OTU string to add to the horizontal bar chart
        console.log(otuIDStr); 
        var otuLabels = data.samples[i].otu_labels;
        console.log(otuLabels);

        // Define Dropdown for demographic panel and add test subject ids as values to the list
        var panelDropdown = d3.select("selDataset")
        for (i in testSubNames) {
            var newPanelDropdown = panelDropdown.append("option")
            newPanelDropdown.text(testSubNames[i]);
        }
    
        // Define variable containing metadata info for table
        // Clear panel prior to selecting new test subject ID
        // Return key:value pair elements from metadata array and append to table

        var panelMetadata = data.metadata[i];
        var mdPanel = d3.select("#sample-metadata");
        mdPanel.html("");  
        Object.entries(panelMetadata).forEach(function ([key, value]) {
            var text = key + ":" + value;
            mdPanel.append("p").text(text);
        
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

        });
      
}

// Define function for changing options in the metadata panel
// Pass parameter element--when option is changed to a new subject id,
// display values for that subject id 

function optionsChange(d) {
    console.log("option changed function");
    const isNumber = (element) => element === d;
    var idx = (testSubNames.findIndex(isNumber));
    d3.selectAll("td").remove();
    d3.selectAll("option").remove();
    var mdPanel = d3.select("selDataset")
    mdPanel.append("option").text(d);
    init(idx);
}

 init(0);



