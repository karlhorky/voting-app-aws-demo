class ApiService {
  constructor () {
    this.url = 'https://36yfx8yfid.execute-api.eu-west-1.amazonaws.com/dev';
  }
}


class TopicsService {
  constructor ($http, apiService) {
    this.$http = $http;
    this.apiService = apiService;
  }

  getTopics () {
    if (!this.topicsPromise) {
      this.topicsPromise = this.$http.get(`${this.apiService.url}/topics`);
    }

    return this.topicsPromise;
  }
}

TopicsService.$inject = ['$http', 'apiService'];


class VotingTopicsComponentController {
  constructor (topicsService) {
    this.loading = true;
    topicsService.getTopics().then(({data}) => {
      if (data.errorMessage) {
        this.error = data.errorMessage;
      } else if (data.length >= 0) {
        this.topics = data;
        this.loading = false;
      }
    });
  }
}

VotingTopicsComponentController.$inject = ['topicsService'];


angular.module('app', [])
  .service('apiService', ApiService)
  .service('topicsService', TopicsService)
  .component('votingTopics', {
    controller: VotingTopicsComponentController,
    controllerAs: 'votingTopics',
    template: `
      <div class="error" ng-bind="votingTopics.error"></div>

      <table ng-hide="votingTopics.loading">
        <tr>
          <th><i class="material-icons">toc</i></th>
          <th><i class="material-icons">account_circle</i></th>
          <th></th>
          <th><i class="material-icons">star</i></th>
        </tr>
        <tr ng-repeat="topic in votingTopics.topics">
          <td ng-bind="::topic.topic"></td>
          <td ng-bind="::topic.speaker"></td>
          <td><voter><button ng-click="voter.downVote(topic)"><i class="material-icons">thumb_down</i></button><button ng-click="voter.upVote(topic)"><i class="material-icons">thumb_up</i></button></voter></td>
          <td ng-bind="::topic.score"></td>
        </tr>
        <tr>
          <td><input ng-model="newTopic.topic"></td>
          <td><input ng-model="newTopic.speaker"></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    `
  });

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
