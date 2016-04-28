var React = require('react');
var UserStore = require('../stores/user_store');
var WorkoutShow = require('./workout_show');
var hashHistory = require('react-router').hashHistory;
var Modal = require('react-modal');
var WorkoutForm = require('./workout_form');
var ClientActions = require('../actions/client_actions');

var _style = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(255, 255, 255, 0.75)'
  },
  content : {
    top                   : '30%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
    padding: '0'
  }
};

var WEEKDAYS = [
  "MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"
];

var WorkoutIndex = React.createClass({
  getInitialState: function() {
    this.workout = [];
    this.formClicked = false;
    return {
      modalIsOpen: false
    };
  },
  openModal: function() {
    this.formClicked = false;
    this.setState({modalIsOpen: true, form: "login"});
  },
  closeModal: function() {
    this.workout = [];
    this.setState({modalIsOpen: false});
  },

  handleClick: function(id,name){
    return function(e){
      e.preventDefault();
      this.openModal();
      this.workout = <WorkoutShow workout_id={id} name={name}/>;
    }.bind(this);
  },
  parseTime: function(time){
    var tdate = new Date(time);
    var hr = tdate.getHours();
    var min = tdate.getMinutes();
    if (min < 10) {
      min = "0" + min;
    }
    if (hr < 12){
      return (hr + ":" + min + " AM");
    } else {
      return (hr + ":" + min + " PM");
    }
  },
  editAndDelete: function(workout){
    if  ( UserStore.currentUser() &&
      UserStore.currentUser().id === workout.user_id){
      return (
        <td>
          <button onClick={this.edit} value={workout.id}>Edit</button>
          <button onClick={this.delete} value={workout.id}>Delete</button>
        </td>
      );
    } else {
      return (<td></td>);
    }
  },
  edit: function(e){
    e.preventDefault();
  },
  delete: function(e){
    e.preventDefault();
    var options = {
      url: 'api/workouts/' + e.target.value,
      type: "CURRENT_GYM"
    };
    ClientActions.deleteWorkout(options);
    this.setState({modalIsOpen: false});
  },

  workouts: function(){
    var workouts = [];
    var self = this;
    this.props.workouts.forEach(function(workout){
      var date = new Date(workout.date);
      var wday = WEEKDAYS[date.getDay()];
      var time = self.parseTime(workout.time);
      workouts.push(
        <tr
          className = "workout-index-view"
          key={workout.name + workout.time}
          onClick={self.handleClick(workout.id,workout.name)}
        >
          <td>{wday}</td>
          <td>{date.getMonth() + "/" + date.getDate()} </td>
          <td>{time}</td>
          <td value={workout.id} >
            {workout.name}
          </td>
          {self.editAndDelete(workout)}
      </tr>);
    });
    return (
      <table className="workouts">
        <caption>{this.props.gymName}</caption>
        <tbody>
          {workouts}
        </tbody>
      </table>
    );
  },
  workoutForm: function(){
    if (this.formClicked) {
      return (
        <WorkoutForm closeModal={this.closeModal}/>
      );
    } else {
      return;
    }
  },
  openForm: function(){
    this.openModal();
    this.formClicked = true;
  },
  render: function() {
    var button = [];
    if (UserStore.currentUser()){
      button = (<button onClick={this.openForm}>Create New Workout</button>);
    }
    return (
      <div>
        {this.workouts()}
        {button}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={_style}
        >
          {this.workoutForm()}
          {this.workout}
        </Modal>
      </div>
    );
  }

});

module.exports = WorkoutIndex;
