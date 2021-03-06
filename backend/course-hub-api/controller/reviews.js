// //All search Related query
const config = require('../config/config.json');
const fetch = require("node-fetch");

exports.submitcomments = function(request, response){
    if(request.body.comment==undefined || request.body.comment.length==0){
        // console.log('StatusCode: 400');
        console.log('Error: BAD REQUEST!! comment can not be empty');
        response.json ({
            "status" : 400,
            "message" : "Error: BAD REQUEST!! comment can not be empty"
        });
    }
    else {
        var searchterm = request.query.term
        const url = config.elasticsearch.endpoint + 'reviews/_search'
        const searchquery = {
            query: {
                multi_match: {
                    query: `${searchterm}`,
                    fields: ["Title", "CourseProvider"],
                    fuzziness: "AUTO"
                }
            },
            _source: ["Title"],
            size: 10
        }
        fetch(url, {
            method: 'post',
            body: JSON.stringify(searchquery),
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
        }).then(res => {
            // console.log('search query: ', JSON.stringify(searchquery))
            // console.log("StatusCode: ", res.status);
            if (res.status == 200) {
                return res.json();
            } else {
                console.log('Error: ',res.statusText)
                error={
                    "status": res.status,
                    "message": res.statusText
                };
                return error
            }
        }).then(body => {
            if(body.status!=undefined && body.status!=200){
                response.json(body);
            }
            else {
                var suggestions = {}
                suggestions['suggestions'] = []
                var duplicatemap = {}
                suggestioncount = 0
                dbsuggestionlist = body['hits']['hits']
                for (index in dbsuggestionlist) {
                    doc = dbsuggestionlist[index]
                    if (duplicatemap[doc['_source']['Title'].toLowerCase()] == undefined) {
                        duplicatemap[doc['_source']['Title'].toLocaleLowerCase()] = 1
                        suggestions['suggestions'].push(doc['_source']['Title'])
                        suggestioncount = suggestioncount + 1
                        if (suggestioncount == 5) {
                            break;
                        }
                    }
                }
                // console.log('suggestions: ',suggestions);
                response.json(suggestions);
            }
        });
    }
}