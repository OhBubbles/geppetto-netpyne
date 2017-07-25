
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Card, { CardHeader, CardText } from 'material-ui/Card';
import NetPyNEPopulation from './NetPyNEPopulation';
import NetPyNENewPopulation from './NetPyNENewPopulation';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

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

export default class NetPyNEPopulations extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      model: props.model
    };

    this.handleNewPopulation = this.handleNewPopulation.bind(this);
  }

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  handleNewPopulation(newPop) {
    var key = Object.keys(newPop)[0];

    var kernel = IPython.notebook.kernel;
    kernel.execute('from neuron_ui.netpyne_init import netParams');
    console.log('netParams.popParams["' + key + '"] = ' + JSON.stringify(newPop[key]))
    kernel.execute('netParams.popParams["' + key + '"] = ' + JSON.stringify(newPop[key]));
    this.setState({ model: Object.assign(this.state.model, newPop) });
  }

  render() {

    var populations = [];
    var populationsShortcut = [];
    for (var key in this.state.model) {
      populations.push(<NetPyNEPopulation model={this.state.model[key]} path={key} />)
      populationsShortcut.push(<MenuItem primaryText={key} />)
    }

    return (
      <Card style={styles.card}>
        <CardHeader
          title="Populations"
          subtitle="Define here the populations of your network"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <Paper style={styles.tabContainer} expandable={true}>
          <IconMenu style={{ float: 'left' }}
            iconButtonElement={
              <IconButton tooltip="Show all" onTouchTap={this.handleToggle}>
                <FontIcon className="fa fa-bars" />
              </IconButton>
            }
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
            {populationsShortcut}
          </IconMenu>
          <div style={{ clear: 'both' }} />
          <NetPyNENewPopulation handleClick={this.handleNewPopulation} />

          {populations}
        </Paper>
      </Card>



    );
  }
}
