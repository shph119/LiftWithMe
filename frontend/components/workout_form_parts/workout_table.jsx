var React = require('react');
var WorkoutTableRow = require('./workout_table_row');

var WorkoutTable = React.createClass({
  getInitialState: function() {
    var rows = [];
    this.row = 0;
    if (this.props.editing) {
      this.props.exercises.forEach(function(exercise){
        var attrs = {exercise_id: exercise.id,
          sets: exercise.sets,
          reps: exercise.reps
        };
        rows.push(
          <WorkoutTableRow
            key={"workout-row-" + this.row}
            index={this.row}
            updateExercise={this.props.updateExercise}
            blankAttrs={attrs}
          />
        );
        this.row++;
      }.bind(this));
      this.row--;
      return {rows: rows};
    } else {
      return (
        {rows: [
          <WorkoutTableRow
          key={"workout-row-" + this.row}
          index={this.row}
          updateExercise={this.props.updateExercise}
          blankAttrs={this.props.blankAttrs}
        />
      ]});
    }
  },
  appendRow: function(e){
    e.preventDefault();
    this.row++;
    var rows = this.state.rows;
    rows.push(
      <WorkoutTableRow
        key={"workout-row-" + this.row}
        index={this.row}
        updateExercise={this.props.updateExercise}
        blankAttrs={this.props.blankAttrs}
      />
    );
    this.setState({rows: rows});
    this.props.addExercise();
  },
  removeLastRow: function(e){
    e.preventDefault();
    this.row--;
    this.state.rows.pop();
    this.setState({rows: this.state.rows});
    this.props.removeExercise();
  },
  tableHead: function(){
    return (
      <thead>
        <tr>
          <th> Exercise </th>
          <th> Sets </th>
          <th> Reps </th>
        </tr>
      </thead>
    );
  },
  tableBody: function(){
    return(
      <tbody>
        {this.state.rows}
      </tbody>
    );
  },
  render: function(){
    return (
      <div className="workout-table">
        <table>
          {this.tableHead()}
          {this.tableBody()}
        </table>
        <div className="table-buttons" >
          <input
            className="table-button"
            type="button"
            value="+"
            onClick={this.appendRow}
            />
          <input
            className="table-button"
            type="button"
            value="-"
            onClick={this.removeLastRow}
            />
        </div>
      </div>
    );
  }
});

module.exports = WorkoutTable;
