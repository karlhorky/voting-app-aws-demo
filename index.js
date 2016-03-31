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

  createTopic (topic) {
    return this.$http.post(`${this.apiService.url}/topics`, topic);
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

  downVote () {
    if (!this.clickedDownVote) {
      // Reset existing vote
      if (this.clickedUpVote) {
        this.votingService.downVote(this.topic);
        this.topic.total--;
      }
      
      this.clickedDownVote = true;
      this.clickedUpVote = false;
      this.votingService.downVote(this.topic);
      this.topic.total--;
    }
  }

  upVote () {
    if (!this.clickedUpVote) {
      // Reset existing vote
      if (this.clickedDownVote) {
        this.votingService.upVote(this.topic);
        this.topic.total++;
      }
      
      this.clickedUpVote = true;
      this.clickedDownVote = false;
      this.votingService.upVote(this.topic);
      this.topic.total++;
    }
  }
}


class topicCreatorComponentController {
  constructor (topicsService) {
    this.topicsService = topicsService;
  }

  createTopic (topic) {
    this.topicsService.createTopic(topic).then(({data}) => {
      Object.assign(topic, {id: data.id, total: 0});
      this.topics.push(topic);
      this.newTopic = {};
    });
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
        <thead>
          <tr>
            <th><i class="material-icons">toc</i></th>
            <th><i class="material-icons">account_circle</i></th>
            <th><i class="material-icons">thumbs_up_down</i></th>
            <th><i class="material-icons">star</i></th>
          </tr>
        </thead>
        <tfoot topics="votingTopics.topics"></tfoot>
        <tbody>
          <tr ng-repeat="topic in votingTopics.topics">
            <td ng-bind="::topic.topic"></td>
            <td ng-bind="::topic.speaker"></td>
            <td>
              <voter topic="topic"></voter>
            </td>
            <td ng-bind="topic.total"></td>
          </tr>
        </tbody>
      </table>
    `
  }).component('voter', {
    controller: VoterComponentController,
    controllerAs: 'voter',
    bindings: {
      topic: '='
    },
    template: `
      <button ng-click="voter.downVote()" ng-class="{selecttup: voter.clickedDownVote}"><i class="material-icons">thumb_down</i></button>
      <button ng-click="voter.upVote()" ng-class="{selectdn: voter.clickedUpVote}"><i class="material-icons">thumb_up</i></button>
    `
  }).component('tfoot', {
    controller: topicCreatorComponentController,
    controllerAs: 'topicCreator',
    bindings: {
      topics: '='
    },
    template: `
      <tr>
        <td><input ng-model="topicCreator.newTopic.topic" placeholder="Topic"></td>
        <td><input ng-model="topicCreator.newTopic.speaker" placeholder="Speaker"></td>
        <td colspan="2" class="center">
          <button ng-click="topicCreator.createTopic(topicCreator.newTopic)" class="topicadded"><i class="material-icons">add_circle</i></button>
        </td>
      </tr>
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
