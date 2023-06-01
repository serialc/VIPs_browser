
// vipsdata loaded

ViPs = {
    "filters":
        {
            "period":[],
            "sector":[],
            "activity":[],
            "environment":[],
            "type":[],
            "action":[],
            "location":[]
        },
    "active": 
        {
            "period":null,
            "sector":null,
            "activity":null,
            "environment":null,
            "type":null,
            "action":null,
            "location":null
        }
};

// calculate types of attributes to populate drop-down lists
ViPs.buildAttributes = function() {
    for (let i = 0; i < vipsdata.length; i=i+1) {

        let rsc = vipsdata[i];

        // goes through all the filters
        for (let fname in ViPs.filters) {
            // fill ViPs.filters.*
            if ( ! ViPs.filters[fname].includes(rsc[fname]) )  {
                ViPs.filters[fname].push(rsc[fname]);
            }
        }
    }

    // then sort alphabetically
    for (let fname in ViPs.filters) {
        ViPs.filters[fname].sort();
    }
};

ViPs.updateSelectionOptions = function() {
    for (let fname in ViPs.filters) {
        
        let target = document.getElementById('sel_' + fname);
        let opt = document.createElement("option");
        opt.value = '';
        opt.innerHTML = "Select...";
        target.append(opt);

        ViPs.filters[fname].map( o => {
            opt = document.createElement("option");
            opt.value = o;
            opt.innerHTML = o;
            target.append(opt);
        });

        // add event listener to each select
        target.addEventListener('change', function() {
            // convert empty '' to null
            ViPs.active[fname] = (this.value === '' ? null : this.value);
            ViPs.displayResources();
        });
    }
};

ViPs.displayResources = function() {
    // select and clear container to fill
    let container = document.getElementById('resources_container');
    container.innerHTML = '';

    // count number of displayed resources to inform user that filtering is working
    let rcount = 0;

    for (let i = 0; i < vipsdata.length; i=i+1) {
        let item = vipsdata[i];

        // filter
        let skip = false;
        for (let fname in ViPs.active) {
            if (ViPs.active[fname] !== null && ViPs.active[fname] !== item[fname]) {
                skip = true;
            }
        }

        if (skip) {
            continue;
        }

        // display
        let rsc_div = document.createElement('div');
        rsc_div.classList.add('col-lg-6');
        rsc_div.classList.add('col-xl-4');
        let rsc = document.createElement('div');
        rsc.classList.add('rsc');
        let rtitle = document.createElement('h3');

        // remove trailing period
        rtitle.innerHTML = '<a href="' + item.URL + '" target="_blank">' + item.Desc.replace(/^[.\s]+|[.\s]+$/g, ""); + '</a>';
        let rbody = document.createElement('div');
        rbody.innerHTML =
            '<a href="' + item.URL + '" target="_blank">' + item.URL + '</a>'  +
            'Creator(s)/IP: <b>' + (item.IP === null ? 'Unknown':item.IP) + '</b><hr>' +
            '<p>Location: <b>' + item.locaion + '</b> Period: <b>' + item.period + '</b><br>' +
            'Sector: <b>' + item.sector + '</b> Environment: <b>' + item.environment + '</b><br>' +
            'Action: <b>' + item.action + '</b> Activity: <b>' + item.activity + '</b> Type: <b>' + item.type + '</b></p>' +
            '<p><b>Review:</b> ' + item.Rev + '<br>Reviewer: <b>' + item.Reviewer + '</b></p>' +
            (item.Tags === null ? '': 'Tags: ' + item.Tags + '<br>') + 
            'Key values: ' +
            (item.KV1 === null ? '': item.KV1) +
            (item.KV2 === null ? '': ', ' + item.KV2) +
            (item.KV3 === null ? '': ', ' + item.KV3) + '<br>' +
            (item.AddInf === null ? '': 'Additional info: ' + item.AddInf + '<br>') +
            'Resource last checked: <b>' + item.UDate + '</b>';

        rsc.append(rtitle);
        rsc.append(rbody);
        rsc_div.append(rsc);
        container.append(rsc_div);

        // count the displayed resources
        rcount += 1;
    }

    document.getElementById('rsc_count').innerHTML = '(' + rcount + ')';
};

// initialize
ViPs.initializeForm = function() {

    // update the list of attributes
    ViPs.buildAttributes();

    // populate the select inputs
    ViPs.updateSelectionOptions();

    // display the resources based on filters
    ViPs.displayResources();
}();
