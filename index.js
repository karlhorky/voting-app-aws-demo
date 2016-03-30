class ApiService {
  constructor () {
    this.url = 'https://36yfx8yfid.execute-api.eu-west-1.amazonaws.com/dev';
  }
}


class TopicsService {
  constructor ($http, apiService) {
    Object.assign(this, {$http, apiService});
  }

  getTopics () {
    if (!this.topicsPromise) {
      this.topicsPromise = this.$http.get(`${this.apiService.url}/topics`);
    }

    return this.topicsPromise;
  }
}


class VotingService {
  constructor ($http, apiService) {
    Object.assign(this, {$http, apiService});
  }

  vote (id, vote) {
    this.$http.post(`${this.apiService.url}/votes`, {topic_id: id, vote});
  }

  downVote (topic) {
    this.vote(topic.id, '-1');
  }

  upVote (topic) {
    this.vote(topic.id, '1');
  }
}


class VotingTopicsComponentController {
  constructor (topicsService) {
    this.loading = true;
    topicsService.getTopics().then(({data}) => {
      console.log(data);
      if (data.errorMessage) {
        this.error = data.errorMessage;
      } else if (data.length >= 0) {
        this.topics = data;
        this.loading = false;
      }
    });
  }
}


class VoterComponentController {
  constructor (votingService) {
    this.votingService = votingService;
  }

  downVote (topic) {
    this.clickedDownVote = true;
    this.votingService.downVote(topic);
  }

  upVote (topic) {
    this.clickedUpVote = true;
    this.votingService.upVote(topic);
  }
}

angular.module('app', [])
  .service('apiService', ApiService)
  .service('topicsService', TopicsService)
  .service('votingService', VotingService)
  .component('votingTopics', {
    controller: VotingTopicsComponentController,
    controllerAs: 'votingTopics',
    template: `
      <div class="error" ng-bind="votingTopics.error"></div>

      <table ng-hide="votingTopics.loading">
        <tr>
          <th><i class="material-icons">toc</i></th>
          <th><i class="material-icons">account_circle</i></th>
          <th><i class="material-icons">thumbs_up_down</i></th>
          <th><i class="material-icons">star</i></th>
        </tr>
        <tr ng-repeat="topic in votingTopics.topics">
          <td ng-bind="::topic.topic"></td>
          <td ng-bind="::topic.speaker"></td>
          <td>
            <voter topic="topic"></voter>
          </td></td>
          <td ng-bind="::topic.total"></td>
        </tr>
        <tr>
          <td><input ng-model="newTopic.topic" placeholder="Topic"></td>
          <td><input ng-model="newTopic.speaker" placeholder="Speaker"></td>
          <td><button><i class="material-icons">add_circle</i></button></td>
          <td></td>
        </tr>
      </table>
    `
  }).component('voter', {
    controller: VoterComponentController,
    controllerAs: 'voter',
    bindings: {
      topic: '='
    },
    template: `
      <button ng-click="voter.downVote(voter.topic)" ng-class="{selecttup: voter.clickedDownVote}"><i class="material-icons">thumb_down</i></button>
      <button ng-click="voter.upVote(voter.topic)" ng-class="{selectdn: voter.clickedUpVote}"><i class="material-icons">thumb_up</i></button>
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
