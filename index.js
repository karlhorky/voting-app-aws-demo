console.log('abc');

angular.module('app', []);
angular.element(document).ready(function() {
  angular.bootstrap(document, ['app']);
});
// GET https://36yfx8yfid.execute-api.eu-west-1.amazonaws.com/dev/topics/ivlPpLzsLb

// POST https://36yfx8yfid.execute-api.eu-west-1.amazonaws.com/dev/topics
// body: {
//  "title" : "doood",
//  "speaker" : "Michael Osl"
//}

// POST /dev/votes
// {
//     "id": ID
//     "vote": 1 // or -1
// }
