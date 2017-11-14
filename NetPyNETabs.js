import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import NetPyNEPopulations from './components/definition/populations/NetPyNEPopulations';
import NetPyNECellRules from './components/definition/cellRules/NetPyNECellRules';
import NetPyNESynapses from './components/definition/synapses/NetPyNESynapses';
import NetPyNESimConfig from './components/definition/configuration/NetPyNESimConfig';
import NetPyNEInstantiated from './components/instantiation/NetPyNEInstantiated';
import Utils from './Utils';


const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },

  tabContainer: {
    padding: 10,
    height: 460,
    overflow: 'auto'
  },

  card: {
    clear: 'both'
  }
};

export default class NetPyNETabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'define',
      model: null,
      openDialog: false
    };

    var _this = this;

    GEPPETTO.on('OriginalModelLoaded', function (model) {
      var modelObject = JSON.parse(model);
      window.metadata = modelObject.metadata;
      _this.setState({ model: modelObject })
    });

  }

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  instantiate = (model) => {
    var that = this;

    Utils.sendPythonMessage('netpyne_geppetto.instantiateNetPyNEModelInGeppetto', [])
      .then(response => {
        that.handleCloseDialog();
        console.log("Instantiate NetPyNE Model in Geppetto was called");
        GEPPETTO.Manager.loadModel(JSON.parse(response));
      });
<<<<<<< HEAD

  };

  simulate = (model) => {
    var that = this;

    Utils.sendPythonMessage('netpyne_geppetto.simulateNetPyNEModelInGeppetto ', [])
      .then(response => {
        that.handleCloseDialog();
        console.log("Simulate NetPyNE Model in Geppetto was called");
        GEPPETTO.Manager.loadModel(JSON.parse(response));
      });

=======
>>>>>>> 6e49fbd64cace9abd306e5b57bec65c15677db6a
  };

  handleChange = (value) => {
    var currentTab = this.state.value;
    var dialogMessage = null;
    var openDialog = false;
    var confirmActionDialog = this.handleCloseDialog;
    switch (value) {
      case "define":
        openDialog = true;
        dialogMessage = "You are back to network definition, any changes will require to reinstantiate your network."
        break;
      case "explore":
        if (currentTab == "define") {
          openDialog = true;
          dialogMessage = "We are about to instantiate your network, this could take some time.",
            confirmActionDialog = this.instantiate;
        }
        break;
      case "simulate":
        if (currentTab == "explore") {
          openDialog = true;
          dialogMessage = "We are about to simulate your network, this could take some time.",
            confirmActionDialog = this.simulate;
        }
        break;
    }

    this.setState({
      value: value,
      dialogMessage: dialogMessage,
      openDialog: openDialog,
      confirmActionDialog: confirmActionDialog
    });
  };

  render() {

    if (this.state.model == null) {
      return (<div></div>)
    }

    var exploreContent = this.state.value == "explore" ? (<NetPyNEInstantiated model={this.state.model} requirement={'from neuron_ui.netpyne_init import *'} page={"explore"} />) : (<div></div>);
    var simulateContent = this.state.value == "simulate" ? (<NetPyNEInstantiated model={this.state.model} requirement={'from neuron_ui.netpyne_init import *'} page={"simulate"} />) : (<div></div>);

    return (
      <div>
        <Tabs
          value={this.state.value}
          style={{ height: '100%' }}
          tabTemplateStyle={{ height: '100%' }}
          contentContainerStyle={{ bottom: 0, position: 'absolute', top: 48, left: 0, right: 0 }}
          onChange={this.handleChange}
        >
          <Tab label="Define your network" value="define">
            <NetPyNEPopulations model={this.state.model.netParams.popParams} requirement={'from neuron_ui.netpyne_init import netParams'} />
            <NetPyNECellRules model={this.state.model.netParams.cellParams} requirement={'from neuron_ui.netpyne_init import netParams'} />
            <NetPyNESynapses model={this.state.model.netParams.cellParams} requirement={'from neuron_ui.netpyne_init import netParams'} />

            <Card style={styles.card}>
              <CardHeader
                title="Connections"
                subtitle="Define here the connectivity rules in your network"
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText expandable={true}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
              </CardText>
            </Card>
            <NetPyNESimConfig model={this.state.model.simConfig} requirement={'from neuron_ui.netpyne_init import simConfig'} />
          </Tab>
          <Tab label="Explore your network" value="explore" >
            {exploreContent}
          </Tab>
          <Tab label="Simulate and analyse" value="simulate">
            {simulateContent}
          </Tab>
        </Tabs>
        <Dialog
          title="NetPyNE"
          actions={<FlatButton
            label="Ok"
            primary={true}
            keyboardFocused={true}
            onClick={this.state.confirmActionDialog}
          />}
          modal={true}
          open={this.state.openDialog}
          onRequestClose={this.handleCloseDialog}
        >
          {this.state.dialogMessage}
        </Dialog>
      </div>
    )
  }
}
