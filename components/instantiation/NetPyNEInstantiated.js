
import React, { Component } from 'react';
import Canvas from '../../../../js/components/interface/3dCanvas/Canvas';
import ControlPanel from '../../../../js/components/interface/controlPanel/controlpanel';
import IconButton from '../../../../js/components/controls/iconButton/IconButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Utils from '../../Utils';

const styles = {
    modal: {
        position: 'absolute !important',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: '999',
        height: '100%',
        width: '100%',
        top: 0
    },

    menuItemDiv:{
        fontSize: '12px',
        lineHeight: '28px'
    },

    menuItem:{
        lineHeight: '28px',
        minHeight: '28px'
    }
};

export default class NetPyNEInstantiated extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            model: props.model,
            controlPanelHidden: true,
            plotButtonOpen: false
        };
        this.widgets=[];
        this.plotFigure = this.plotFigure.bind(this);
        this.getOpenedWidgets = this.getOpenedWidgets.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    plotFigure(pythonFigureMethod, plotName) {
        var that = this;
        //TODO Call a Python method to read HOC objects created by NetPyNE which will convert them to a geppetto model
        //using PyGeppetto and send back the JSON serialization
        //TODO Maybe create a top level Model or Project sync

        Utils.sendPythonMessage(pythonFigureMethod, [])
            .then(response => {
                G.addWidget(1).then(w => {
                    w.setName(plotName);
                    w.$el.append(response);
                    var svg = $(w.$el).find("svg")[0];
                    svg.removeAttribute('width');
                    svg.removeAttribute('height');
                    svg.setAttribute('width', '100%');
                    svg.setAttribute('height', '98%');
                    that.widgets.push(w);
                });
            });

    }

    getOpenedWidgets(){
        return this.widgets;
    }

    componentDidMount() {
        this.refs.canvas.displayAllInstances();
    }

    handleClick(event) {
        // This prevents ghost click.
        event.preventDefault();
    
        this.setState({
            plotButtonOpen: true,
            anchorEl: event.currentTarget,
        });
      }
    
      handleRequestClose() {
        this.setState({
            plotButtonOpen: false,
        });
      }

      
    render() {

        var controls;
        if (this.props.page == 'explore') {
            controls = (
                <Menu>
                  <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="2D Net Plot" onClick={() => { that.plotFigure('netpyne_geppetto.getNetPyNE2DNetPlot', '2D Net Plot') }}/>
                  <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Shape Plot" onClick={() => { that.plotFigure('netpyne_geppetto.getNetPyNEShapePlot', 'Shape Plot') }}/>
                  <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Connections Plot" onClick={() => { that.plotFigure('netpyne_geppetto.getNetPyNEConnectionsPlot', 'Connections Plot') }}/>
                </Menu>
            );

        }
        else if (this.props.page == 'simulate') {
            controls = (
                <Menu>
                    <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Raster Plot" onClick={() => { that.plotFigure('netpyne_geppetto.getNetPyNERasterPlot', 'Raster Plot') }}/>
                    <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Spike Hist Plot" onClick={() => { that.plotFigure('netpyne_geppetto.getNetPyNESpikeHistPlot', 'Spike Hist Plot') }}/>
                    <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Spike Stats Plot" onClick={() => { that.plotFigure('netpyne_geppetto.getNetPyNESpikeStatsPlot', 'Spike Stats Plot') }}/>
                    <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Rate PSD Plot" onClick={() => { that.plotFigure('netpyne_geppetto.getNetPyNERatePSDPlot', 'Rate PSD Plot') }}/>
                    <MenuItem style={styles.menuItem} innerDivStyle={styles.menuItemDiv} primaryText="Traces Plot" onClick={() => { that.plotFigure('netpyne_geppetto.getNetPyNETracesPlot', 'Traces Plot') }}/>
                </Menu>

                
            );
        }

        var that = this;
        return (
            <div id="instantiatedContainer" style={{ height: '100%', width: '100%' }}>
                <Canvas
                    id="CanvasContainer"
                    name={"Canvas"}
                    componentType={'Canvas'}
                    ref={"canvas"}
                    style={{ height: '100%', width: '100%' }}
                />
                <div id="controlpanel" style={{ top: 0 }}>
                    <ControlPanel
                        icon={"styles.Modal"}
                        useBuiltInFilters={true}
                    >
                    </ControlPanel>
                </div>
                <IconButton style={{ position: 'absolute', left: 35, top: 10 }} onClick={() => { $('#controlpanel').show(); }} icon={"fa-list"} />
                <div>
                <IconButton
                onClick={this.handleClick}
                style={{ position: 'absolute', left: 35, top: 318 }}
                label="Plot"
                icon={"fa-bar-chart"}

              />
              <Popover
                open={this.state.plotButtonOpen}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleRequestClose}
              >
                {controls}
                </Popover>
              </div>
            </div>

        );
    }
}
