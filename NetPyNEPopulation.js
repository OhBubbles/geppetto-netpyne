import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/internal/Tooltip';
import FlatButton from 'material-ui/FlatButton';

var PythonControlledCapability = require('../../js/communication/geppettoJupyter/PythonControlledCapability');
var PythonControlledTextField = PythonControlledCapability.createPythonControlledComponent(TextField);
var PythonControlledSelectField = PythonControlledCapability.createPythonControlledComponent(SelectField);


const styles = {
  populationCard: {
    fontSize: 24,
    margin: 10,
    width: 350,
    height: 350,
    float: 'left'
  },
  cardContent: {
  }
};

export default class NetPyNEPopulation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: props.model,
      page: 'main'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDimensionChange = this.handleDimensionChange.bind(this);
    this.handleRangeTypeChange = this.handleRangeTypeChange.bind(this);
    this.setPopulationDimension = this.setPopulationDimension.bind(this);

  }

  setPage(page) {
    this.setState({ page: page });
  }

  setPopulationDimension(event, value) {
    console.log("setPopulationDimension");
    GEPPETTO.trigger(GEPPETTO.Events.Send_Python_Message, {command:'netParams.popParams.setParam', parameters:[this.state.model.name, 'gridSpacing', value]});
  }

  handleRangeTypeChange(event, index, value) {
    var rangeTypeSuffix;
    if (value == 1) {
      rangeTypeSuffix = "Range";
    }
    else if (value == 2) {
      rangeTypeSuffix = "normRange";
    }
    this.setState({ rangeType: value, rangeTypeSuffix: rangeTypeSuffix });
  }

  handleDimensionChange(event, index, value) {
    if (value == 1) {
      var dimensionVariable = "numCells";
    }
    else if (value == 2) {
      var dimensionVariable = "density";
    }
    else if (value == 3) {
      var dimensionVariable = "gridSpacing";
    }
    this.setState({ dimension: value, dimensionVariable: dimensionVariable });
  }

  handleChange(event) {
    var model = this.state.model;
    model.name = event.target.value;
    this.setState({
      model: model,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      model: nextProps.model
    });
  }

  render() {
    var content;

    if (this.state.page == 'main') {
      content = (<div>
        <TextField
          value={this.state.model.name}
          floatingLabelText="The name of your population"
        /><br />

        <PythonControlledTextField
          floatingLabelText="Cell Model"
          requirement={this.props.requirement}
          model={"netParams.popParams['" + this.state.model.name + "']['cellModel']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Cell Type"
          requirement={this.props.requirement}
          model={"netParams.popParams['" + this.state.model.name + "']['cellType']"} />
        <br />
        <SelectField
          floatingLabelText="Population dimension"
          value={this.state.dimension}
          onChange={this.handleDimensionChange}
        >
          <MenuItem value={1} primaryText="Number of Cells" />
          <MenuItem value={2} primaryText="Density" />
          <MenuItem value={3} primaryText="Grid spacing" />
        </SelectField>
        <br />
        <TextField
          onChange={this.setPopulationDimension}
        />
        <br />
        <FlatButton label="Spatial distribution" fullWidth={true} secondary={true} onClick={this.setPage.bind(this, 'distribution')} />
      </div>);
    }
    else if (this.state.page == 'distribution') {
      content = (<div>
        <FlatButton label="Back" fullWidth={true} secondary={true} onClick={this.setPage.bind(this, 'main')} />

        <SelectField
          floatingLabelText="Range type"
          value={this.state.rangeType}
          onChange={this.handleRangeTypeChange}
        >
          <MenuItem value={1} primaryText="Absolute" />
          <MenuItem value={2} primaryText="Normalized" />
        </SelectField>
        <br />
        <PythonControlledTextField
          floatingLabelText="Neuron positions in x-axis"
          requirement={this.props.requirement}
          model={"netParams.popParams['" + this.state.model.name + "']['x" + this.state.rangeTypeSuffix + "']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Neuron positions in y-axis"
          requirement={this.props.requirement}
          model={"netParams.popParams['" + this.state.model.name + "']['y" + this.state.rangeTypeSuffix + "']"} />
        <br />
        <PythonControlledTextField
          floatingLabelText="Neuron positions in z-axis"
          requirement={this.props.requirement}
          model={"netParams.popParams['" + this.state.model.name + "']['z" + this.state.rangeTypeSuffix + "']"} />
        <br />



      </div>);;
    }
    return content;
  }
}
