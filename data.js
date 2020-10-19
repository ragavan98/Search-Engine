const elasticsearch = require('elasticsearch');
const cities = require('./cities.json');
const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
});
// ping the client to be sure Elasticsearch is up
client.ping({
    requestTimeout: 30000,
}, function(error) {
    // at this point, eastic search is down, please check your Elasticsearch service
    if (error) {
        console.error('Elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});

client.ping({
    requestTimeout: 30000,
}, function(error) {
    if (error) {
        console.error('ElasticSearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});

client.indices.create({
    index: 'practise'
}, function(error, response, status) {
    if (error) {
        console.log(error);
    } else {
        console.log("created a new index", response);
    }
});

client.index({
    index: 'practise',
    id: '1',
    type: 'cities_list',
    body: {
        "Key1": "Content for key one",
        "Key2": "Content for key two",
        "key3": "Content for key three",
    }
}, function(err, resp, status) {
    console.log(resp);
});


var bulk = [];
//loop through each city and create and push two objects into the array in each loop
//first object sends the index and type you will be saving the data as
//second object is the data you want to index
cities.forEach(city => {
        bulk.push({
            index: {
                _index: "practise",
                _type: "cities_list",
            }
        })
        bulk.push(city)
    })
    //perform bulk indexing of the data passed
client.bulk({ body: bulk }, function(err, response) {
    if (err) {
        console.log("Failed Bulk operation".red, err)
    } else {
        console.log("Successfully imported %s".green, cities.length);
    }
});