const zoom_config = require('./configs/config')
const jwt = require('jsonwebtoken');
const rp = require('request-promise');
const moment = require('moment');
const {
    response
} = require('express');


// Generate token
const payload = {
    iss: zoom_config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const payload2 = {
    iss: zoom_config.APIKey2,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, zoom_config.APISecret);
const token2 = jwt.sign(payload2, zoom_config.APISecret2);

function patch_meeting_first_acc() {
    var options = {
        //You can use a different uri if you're making an API call to a different Zoom endpoint.
        uri: "https://api.zoom.us/v2/users/" + zoom_config.first_acc + "/meetings?page_size=30&type=upcoming",
        qs: {
            status: 'active'
        },
        auth: {
            'bearer': token
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true //Parse the JSON string in the response
    };
    
    rp(options)
        .then(function (response) {
            var now = moment(new Date()); //todays date
            resp = response.meetings.filter(x => moment.duration(moment(x.start_time).diff(now)).asMinutes() <= 30 && moment.duration(moment(x.start_time).diff(now)).asMinutes() >= 0)
            if(resp.length !== 0){
                console.log(resp)
                var patch_meeting = {
                    method: "PATCH",
                    uri: "https://api.zoom.us/v2/meetings/" + resp[0].id,
                    qs: {
                        status: 'active'
                    },
                    auth: {
                        'bearer': token
                    },
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: {
                        'settings': {
                            'jbh_time': 0,
                            'join_before_host': false
                        }
                    },
                    json: true //Parse the JSON string in the response
                }
        
                rp(patch_meeting)
                    .then(function (response) {
                        console.log("Patch Meeting First Acc Success")
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            } else {
                console.log("No upcoming meeting (first_acc) in 30 minutes");
            }
        })
        .catch(function (err) {
            console.log(err)
        });
}


function patch_meeting_sec_acc() {
    var options = {
        //You can use a different uri if you're making an API call to a different Zoom endpoint.
        uri: "https://api.zoom.us/v2/users/" + zoom_config.sec_acc + "/meetings?page_size=30&type=upcoming",
        qs: {
            status: 'active'
        },
        auth: {
            'bearer': token2
        },
        headers: {
            'content-type': 'application/json'
        },
        json: true //Parse the JSON string in the response
    };
    
    rp(options)
        .then(function (response) {
            var now = moment(new Date()); //todays date
            resp = response.meetings.filter(x => moment.duration(moment(x.start_time).diff(now)).asMinutes() <= 30 && moment.duration(moment(x.start_time).diff(now)).asMinutes() >= 0)
            if(resp.length !== 0){
                console.log(resp)
                var patch_meeting = {
                    method: "PATCH",
                    uri: "https://api.zoom.us/v2/meetings/" + resp[0].id,
                    qs: {
                        status: 'active'
                    },
                    auth: {
                        'bearer': token2
                    },
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: {
                        'settings': {
                            'jbh_time': 0,
                            'join_before_host': false
                        }
                    },
                    json: true //Parse the JSON string in the response
                }
        
                rp(patch_meeting)
                    .then(function (response) {
                        console.log("Patch Meeting Sec Acc Success")
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            } else {
                console.log("No upcoming meeting (sec_acc) in 30 minutes");
            }
        })
        .catch(function (err) {
            console.log(err)
        });
}

patch_meeting_first_acc();
patch_meeting_sec_acc();